<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding flex flex-column items-center">
      <div class="flex flex-column justify-center h-full w-full">
        <div class="w-full form-container text-dark">
          <h1 class="title-600">Profile details</h1>

          <form @submit.prevent="handleSubmit" class="q-gutter-y-md w-full profile-form">
            <div class="inputs-top">
              <div class="input-group">
                <div class="body-small text-error">Full name</div>
                <AInput
                  name="fullName"
                  placeholder="John doe"
                  v-model="formData.fullName"
                  :error="v$.fullName.$error"
                  :error-message="getErrorMessage(v$.fullName)"
                  @blur="v$.fullName.$touch()"
                />
              </div>
              <div class="input-group">
                <div class="body-small text-dark">Date of birth</div>
                <AInput
                  name="dateOfBirth"
                  type="date"
                  placeholder="dd/mm/aaaa"
                  v-model="formData.dateOfBirth"
                  :error="v$.dateOfBirth.$error"
                  :error-message="getErrorMessage(v$.dateOfBirth)"
                  @blur="v$.dateOfBirth.$touch()"
                />
              </div>
              <div class="input-group">
                <div class="body-small text-dark">Phone number</div>
                <AInput
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  v-model="formData.phone"
                  :error="v$.phone.$error"
                  :error-message="getErrorMessage(v$.phone)"
                  @blur="v$.phone.$touch()"
                />
              </div>

<!--             <AInput
              name="zipCode"
              label="ZIP Code"
              v-model="formData.zipCode"
              :error="v$.zipCode.$error"
              :error-message="getErrorMessage(v$.zipCode)"
              @blur="v$.zipCode.$touch()"
            /> -->
            </div>
            <q-btn
              type="submit"
              color="primary"
              class="full-width basic-btn q-mt-lg text-capitalize"
              :loading="isLoading"
              :disable="isLoading || v$.$invalid"
              label="Save"
            />
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { ref, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import userService from '@/services/user.service';
import AInput from '@/components/AInput.vue';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);

const formData = reactive({
  fullName: '',
  dateOfBirth: '',
  phone: '',
  /* zipCode: '' */
});

const rules = {
  fullName: { 
    required: helpers.withMessage('Full name is required', required),
    minLength: helpers.withMessage('Full name must be at least 3 characters', minLength(3))
  },
  dateOfBirth: { 
    required: helpers.withMessage('Date of birth is required', required)
  },
  phone: { 
    required: helpers.withMessage('Phone number is required', required),
    validPhone: helpers.withMessage('Please enter a valid phone number', helpers.regex(/^\+?[1-9]\d{1,14}$/))
  },
/*   zipCode: {
    required: helpers.withMessage('ZIP code is required', required),
    validZip: helpers.withMessage('Please enter a valid ZIP code', helpers.regex(/^\d{5}(-\d{4})?$/))
  } */
};

const v$ = useVuelidate(rules, formData);

const getErrorMessage = (field: any) => {
  if (!field.$error) return '';
  return Object.values(field.$errors)[0].$message;
};

const handleSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  try {
    isLoading.value = true;
    if (!authStore.accessToken) {
      throw new Error('No authentication token found');
    }

    const userData = {
      nombre: formData.fullName,
      fechaNacimiento: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : '',
      telefono: formData.phone,
      /* zipCode: formData.zipCode */
    };

    const response = await userService.createUserProfile(userData, authStore.accessToken);
    if (response && response.id) {
      localStorage.setItem('userId', response.id);
    }
    router.push('/confirm-address');
  } catch (error) {
    console.error('Profile update error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.basic-btn {
  margin-top: auto;
}
.form-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}
.profile-form {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
.inputs-top {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.inputs-top .input-label:first-child {
  margin-top: 0;
}
</style> 