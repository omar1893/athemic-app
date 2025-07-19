<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="main-container">
        <div class="image-container">
          <img src="@/assets/imgs/athemic-girl.png" alt="Athemic" class="main-image" />
        </div>
        <div class="content-wrapper">

          <div class="text-container">
            <img src="@/assets/imgs/logo-athemic.png" alt="Logo" class="logo" />
            <h1 class="title-600 text-center text-dark">Almost everything delivered</h1>
          </div>

          <div class="buttons-container w-full">
              <q-btn class="google-btn-wrapper bg-dark text-white body-bold row reverse" @click="startGoogleOAuth">
                  <img src="@/assets/imgs/google-logo-white.svg" alt="Google" class="google-icon">
                  <span class="q-ml-sm">Continue with Google</span>
              </q-btn>
            <login-button label="Continue with Apple" icon="ios" variant="primary" />
            <login-button label="Continue with your Email" icon="email" variant="outline"
              @click="navigateToLogin" />
          </div>

        </div>
      </div>
      <email-login ref="emailLoginModal" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
/* import { useRouter } from 'vue-router'; */
import LoginButton from '@/components/LoginButton.vue';
import EmailLogin from '@/components/EmailLogin.vue';
import { ref, onMounted } from 'vue';
import config from '@/config';
import authService from '@/services/auth.service';

/* const router = useRouter(); */
const emailLoginModal = ref();
console.log(config)

/* 

const handleGoogleLogin = () => {
  console.log('Google login clicked');
};

const handleAppleLogin = () => {
  console.log('Apple login clicked');
}; */

const navigateToLogin = () => {
  emailLoginModal.value.visible = true;
};

function handleGoogleCallback(response) {
  console.log('Google login success:', response);
  if (response.credential) {
    authService.loginWithGoogle(response.credential).then(res => {
      console.log('Backend login response:', res);
    }).catch(err => {
      console.error('Google login backend error:', err);
    });
  }
}

function renderGoogleButton() {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.initialize({
      client_id: config.AT_GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large' }
    );
  } else {
    setTimeout(renderGoogleButton, 300); // Retry until script is loaded
  }
}

function handleCustomGoogleLogin() {
  const googleBtn = document.querySelector('#google-signin-btn div');
  console.log(googleBtn);
  
  if (googleBtn) {
    googleBtn.click();
  }
}

function startGoogleOAuth() {
  const clientId = config.AT_GOOGLE_CLIENT_ID;
  const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
  const scope = encodeURIComponent('openid email profile');
  const responseType = 'code';
  const state = Math.random().toString(36).substring(2);
  const codeChallengeMethod = 'S256';

  // Generar un code_verifier válido para PKCE
  const codeVerifier = generateRandomString(128);
  localStorage.setItem('pkce_code_verifier', codeVerifier);
  console.log('PKCE code_verifier:', codeVerifier);

  generateCodeChallenge(codeVerifier).then(codeChallenge => {
    console.log('PKCE code_challenge:', codeChallenge);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;
    console.log('Redirecting to:', url);
    window.location.href = url;
  });
}

function generateRandomString(length) {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  array.forEach(value => {
    result += validChars.charAt(value % validChars.length);
  });
  return result;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

onMounted(() => {
  renderGoogleButton();
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.main-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $white;
  gap: 10rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

.content-wrapper {
  width: 100%;
  max-width: $max-width;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding-bottom: 8px;
  background: #fff;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  margin-top: -32px;
  z-index: 2;
  position: relative;
}

.image-container {
  width: 140%;
  background-color: #875EF8;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  height: 51vh;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  z-index: 3;
  position: relative;

  .main-image {
    width: 80%;
    aspect-ratio: 1.131;
    object-fit: contain;
    margin: 0 auto;
  }
}

.text-container {
  width: 100%;
  max-width: 276px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;

  .logo {
    width: 141px;
    max-width: 100%;
    min-height: 24px;
  }

  .title {
    margin-top: 14px;
    font-family: $font-family;
    font-size: $font-size-large;
    color: $dark;
    font-weight: 600;
    text-align: center;
    line-height: $line-height-large;
  }
}

.buttons-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-indicator {
  width: 134px;
  height: 5px;
  background-color: $dark;
  border-radius: 100px;
  margin-top: 29px;
}

.google-btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $dark;
  border-radius: 200px;
  padding: 16px;
  text-transform: none;
}

#google-signin-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
}
</style>