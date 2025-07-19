<template>
  <ion-modal
    :is-open="visible"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    @didDismiss="closeModal"
    class="login-modal"
  >
    <div class="flex column gap-6 q-pa-xl">
      <div class="flex justify-between items-center">
        <i class="pi pi-times text-xl cursor-pointer" @click="closeModal"></i>
      </div>

      <form @submit.prevent="handleEmailSubmit" class="flex column gap-4">
        <AInput 
          name="email" 
          type="email" 
          label="Email" 
          placeholder="Enter your email" 
          v-model="formData.email"
          :error="v$.email.$error" 
          :error-message="getErrorMessage(v$.email)" 
          @blur="v$.email.$touch()" 
        >
          <template #prepend>
            <i class="fa fa-envelope" />
          </template>
        </AInput>
        <q-btn 
          type="submit" 
          color="primary" 
          class="q-mt-md basic-btn" 
          :loading="isLoading" 
          :disable="isLoading"
          label="Continue" 
        />
      </form>

      <p class="text-center text-haiti body">
        By continuing, you agree to Athemic's
        <a href="#" class="text-gray-700">Privacy policy</a> and
        <a href="#" class="text-gray-700">Terms of service</a>
      </p>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { IonModal } from '@ionic/vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import AInput from '@/components/AInput.vue';
import authService from '@/services/auth.service';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();

const visible = ref(false);
const isLoading = ref(false);

const formData = reactive({
  email: ''
});

const rules = {
  email: {
    required,
    email,
    $autoDirty: true
  }
};

const v$ = useVuelidate(rules, formData);

const getErrorMessage = (field: any) => {
  if (!field.$error) return '';
  if (field.required.$invalid) return 'This field is required';
  if (field.email?.$invalid) return 'Please enter a valid email';
  return 'Invalid input';
};

const closeModal = () => {
  visible.value = false;
};

const handleEmailSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  try {
    isLoading.value = true;
    await authService.loginWithEmail(formData.email);
    const authStore = useAuthStore();
    authStore.setEmail(formData.email);
    router.push({ name: 'PinVerification' });
    closeModal();
  } catch (error) {
    console.error('Email submission error:', error);
  } finally {
    isLoading.value = false;
  }
};

defineExpose({
  visible
});
</script>

<style lang="scss" scoped>
.login-modal {
  --height: auto;
  --max-height: 90%;
  --width: 100%;
  --border-radius: 24px;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  padding: 2rem 1.6rem 1.6rem 1.6rem;
}

:deep(.ion-page) {
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}

:deep(.modal-wrapper) {
  border-radius: var(--border-radius);
}

:deep(.ion-page) {
  border-radius: var(--border-radius);
  overflow: hidden;
  background: white;
}
</style> 