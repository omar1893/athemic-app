<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding flex flex-column items-center">
      <div class="text-left">
        <ABackButton />
      </div>
      <div class="center-container">
        <div class="w-full text-dark">
          <div>
            <h1 class="title-600">6-Digit code</h1>
          </div>

          <h3 class="body q-mb-lg">Enter the code that we've sent to "{{ email }}"</h3>

          <form @submit.prevent="handlePinSubmit" class="q-gutter-y-lg w-full">
            <div class="row justify-between q-gutter-x-sm">
              <q-input v-for="(digit, index) in 6" :key="index" v-model="pinDigits[index]" type="text" dense outlined
                class="pin-input subtitle-bold" maxlength="1" :ref="el => pinInputRefs[index] = el"
                @update:model-value="val => handlePinInput(val, index)" @paste="event => handlePaste(event, index)"
                @keydown="event => handleKeydown(event, index)" />
            </div>

            <q-btn type="submit" color="primary" class="full-width text-capitalize body-bold basic-btn" rounded size="large"
              :loading="isLoading" :disable="isLoading || !isPinComplete" label="Confirm" />

            <div class="text-center q-mt-md">
              <q-btn flat dense :disable="isLoading || resendDisabled" @click="handleResendCode"
                class="text-capitalize text-dark body-bold">
                {{ resendButtonText }}
              </q-btn>
            </div>
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import authService from '@/services/auth.service';
import userService from '@/services/user.service';
import { handleAuthResponse } from '@/utils/authHandler';
import ABackButton from '@/components/ABackButton.vue';

const router = useRouter();
const authStore = useAuthStore();
const email = computed(() => authStore.email);

const isLoading = ref(false);
const pinDigits = ref(['', '', '', '', '', '']);
const pinInputRefs = ref<any[]>([]);

const resendDisabled = ref(false);
const resendTimer = ref(0);
const resendButtonText = computed(() =>
  resendDisabled.value ? `Resend code in ${resendTimer.value}s` : 'Resend code'
);

const isPinComplete = computed(() => {
  return pinDigits.value.every(digit => digit !== '');
});

const handlePinInput = (val: string, index: number) => {
  const digit = val.replace(/\D/g, '').slice(0, 1);
  pinDigits.value[index] = digit;
  if (digit && index < 5) {
    pinInputRefs.value[index + 1]?.focus();
  }
};

const handlePaste = (event: ClipboardEvent, index: number) => {
  event.preventDefault();
  const paste = event.clipboardData?.getData('text') || '';
  const digits = paste.replace(/\D/g, '').slice(0, 6 - index).split('');
  digits.forEach((digit, i) => {
    pinDigits.value[index + i] = digit;
    if (pinInputRefs.value[index + i]) {
      pinInputRefs.value[index + i].focus();
    }
  });
};

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !pinDigits.value[index] && index > 0) {
    pinDigits.value[index - 1] = '';
    pinInputRefs.value[index - 1]?.focus();
  }
};

const startResendTimer = () => {
  resendDisabled.value = true;
  resendTimer.value = 60;

  const interval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      clearInterval(interval);
      resendDisabled.value = false;
    }
  }, 1000);
};

const handleResendCode = async () => {
  try {
    isLoading.value = true;
    await authService.loginWithEmail(email.value);
    startResendTimer();
  } catch (error) {
    console.error('Resend code error:', error);
  } finally {
    isLoading.value = false;
  }
};

const handlePinSubmit = async () => {
  if (!isPinComplete.value) return;

  try {
    isLoading.value = true;
    const pin = pinDigits.value.join('');
    const response = await authService.confirmLogin(email.value, pin);
    handleAuthResponse(response);

    // Get user details using the token
    if (authStore.userData?.authId && authStore.accessToken) {
      const { exists } = await userService.getUserDetails(authStore.userData.authId, authStore.accessToken);

      // If user doesn't exist, redirect to profile creation
      if (!exists) {
        router.push('/profile-details');
      } else {
        router.push('/home');
      }
    }
  } catch (error) {
    console.error('PIN verification error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss">
.center-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.pin-verification-container {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--ion-color-light);
}

.pin-verification-form {
  width: 100%;
  max-width: 450px;
  padding: 20px;
  border-radius: 16px;
  position: relative;
}

.logo-container {
  padding: 40px 0;
}

.pin-input {
  .q-field__control {
    width: 56px !important;
    height: 72px !important;
    border-radius: 18px !important;
    background: rgba(23, 0, 51, 0.08);
    border: none !important;
    display: flex;
    align-items: center;
    justify-content: center;

    &:before {
      border: none !important;
    }
  }

  .q-field__native {
    text-align: center;
    font-size: inherit;
    font-weight: inherit;
    padding: 8px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }
}
</style>