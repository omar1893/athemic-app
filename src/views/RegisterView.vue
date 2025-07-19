<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="register-container">
        <q-card class="register-form">
          <q-card-section class="text-center">
            <h2 class="text-h4 text-weight-bold q-mb-md">Create Account</h2>
            <p class="text-subtitle1 text-grey-7">Fill in your information</p>
          </q-card-section>

          <q-card-section>
            <form @submit.prevent="handleRegister" class="q-gutter-y-md">
              <AInput
                name="fullName"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                v-model="formData.fullName"
                :error="v$.fullName.$error"
                :error-message="getErrorMessage(v$.fullName)"
                @blur="v$.fullName.$touch()"
              />

              <AInput
                name="phone"
                type="tel"
                label="Phone Number"
                placeholder="Enter your phone number"
                v-model="formData.phone"
                :error="v$.phone.$error"
                :error-message="getErrorMessage(v$.phone)"
                @blur="v$.phone.$touch()"
              />

              <AInput
                name="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                v-model="formData.email"
                :error="v$.email.$error"
                :error-message="getErrorMessage(v$.email)"
                @blur="v$.email.$touch()"
              />

              <AInput
                name="emailConfirmation"
                type="email"
                label="Confirm Email"
                placeholder="Confirm your email"
                v-model="formData.emailConfirmation"
                :error="v$.emailConfirmation.$error"
                :error-message="getErrorMessage(v$.emailConfirmation)"
                @blur="v$.emailConfirmation.$touch()"
              />

              <AInput
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                v-model="formData.password"
                :error="v$.password.$error"
                :error-message="getErrorMessage(v$.password)"
                @blur="v$.password.$touch()"
              />

              <AInput
                name="passwordConfirmation"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                v-model="formData.passwordConfirmation"
                :error="v$.passwordConfirmation.$error"
                :error-message="getErrorMessage(v$.passwordConfirmation)"
                @blur="v$.passwordConfirmation.$touch()"
              />

              <q-btn
                type="submit"
                color="primary"
                class="full-width"
                size="large"
                :loading="isLoading"
                :disable="isLoading"
                label="Create Account"
              />
            </form>

            <div class="text-center q-mt-lg">
              <p class="text-grey-7">
                Already have an account?
                <q-btn flat dense color="primary" label="Sign In" @click="router.push('/login')" />
              </p>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import AInput from '@/components/AInput.vue';

const router = useRouter();
const isLoading = ref(false);

const formData = reactive({
  fullName: '',
  phone: '',
  email: '',
  emailConfirmation: '',
  password: '',
  passwordConfirmation: ''
});

const rules = {
  fullName: { 
    required,
    $autoDirty: true 
  },
  phone: { 
    required,
    $autoDirty: true 
  },
  email: { 
    required, 
    email,
    $autoDirty: true 
  },
  emailConfirmation: { 
    required,
    email,
    sameAsEmail: sameAs(formData.email),
    $autoDirty: true 
  },
  password: { 
    required,
    minLength: minLength(8),
    $autoDirty: true 
  },
  passwordConfirmation: {
    required,
    minLength: minLength(8),
    sameAsPassword: sameAs(formData.password),
    $autoDirty: true
  }
};

const v$ = useVuelidate(rules, formData);

const getErrorMessage = (field: any) => {
  if (!field.$error) return '';
  
  if (field.required.$invalid) return 'This field is required';
  if (field.email?.$invalid) return 'Please enter a valid email';
  if (field.minLength?.$invalid) return `Minimum length is ${field.minLength.$params.min} characters`;
  if (field.sameAsEmail?.$invalid) return 'Emails do not match';
  if (field.sameAsPassword?.$invalid) return 'Passwords do not match';
  
  return 'Invalid input';
};

const handleRegister = async () => {
  const isFormCorrect = await v$.value.$validate();
  
  if (!isFormCorrect) return;

  try {
    isLoading.value = true;
    console.log('Registering with:', formData);
  } catch (error) {
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss">
.register-container {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--ion-color-light);
}

.register-form {
  width: 100%;
  max-width: 450px;
  padding: 20px;
  border-radius: 16px;
}
</style> 