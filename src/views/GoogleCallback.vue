<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="callback-container">
        <div v-if="loading" class="loading">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Procesando inicio de sesión...</p>
        </div>
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <ion-button @click="goToHome">Volver al inicio</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonSpinner, IonButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import authService from '@/services/auth.service';
import userService from '@/services/user.service';
import { handleAuthResponse } from '@/utils/authHandler';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const loading = ref(true);
const error = ref('');

async function handleCallback() {
  try {
    const code = route.query.code as string;
    
    if (!code) {
      throw new Error('No se recibió el código de autorización');
    }

    const codeVerifier = localStorage.getItem('pkce_code_verifier');
    if (!codeVerifier) {
      throw new Error('No se encontró el code verifier');
    }

    const response = await authService.exchangeCodeForToken(code, codeVerifier);
    
    localStorage.removeItem('pkce_code_verifier');
    console.log(response);
    const backendRes = await authService.loginWithGoogle(response.id_token);
    if (backendRes.accessToken) {
      handleAuthResponse({
        accessToken: backendRes.accessToken,
        expiresIn: backendRes.expiresIn
      });
    }
    console.log(authStore.accessToken);
    
    if (authStore.accessToken) {
      const { exists } = await userService.getUserDetails(authStore.userData?.authId, authStore.accessToken);
      if (!exists) {
        router.push('/profile-details');
      } else {
        router.push('/home');
      }
    } else {
      router.push('/profile-details');
    }
  } catch (err) {
    console.error('Error en el callback:', err);
    error.value = 'Error al procesar el inicio de sesión. Por favor, inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}

function goToHome() {
  router.push('/');
}

onMounted(() => {
  handleCallback();
});
</script>

<style lang="scss" scoped>
.callback-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  
  p {
    font-size: 1.6rem;
    color: var(--ion-color-dark);
  }
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.6rem;
  
  p {
    font-size: 1.6rem;
    color: var(--ion-color-danger);
  }
}
</style> 