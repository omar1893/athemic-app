<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="login-container">
        <q-card class="login-form">

          <q-card-section>
            <form @submit.prevent="handleLogin" class="q-gutter-y-md">
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
                name="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                v-model="formData.password"
                :error="v$.password.$error"
                :error-message="getErrorMessage(v$.password)"
                @blur="v$.password.$touch()"
              />

              <div class="row justify-end q-mb-md">
                <q-btn flat dense color="primary" label="Forgot Password?" />
              </div>

              <q-btn
                type="submit"
                color="primary"
                class="full-width"
                size="large"
                :loading="isLoading"
                :disable="isLoading"
                label="Sign In"
              />
            </form>

            <div class="row items-center q-my-lg">
              <div class="col"><q-separator /></div>
              <div class="col-auto q-px-md">Or continue with</div>
              <div class="col"><q-separator /></div>
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-btn
                  outline
                  class="full-width"
                  color="primary"
                  @click="handleGoogleLogin"
                >
                  <q-icon name="img:https://www.google.com/favicon.ico" class="q-mr-sm" />
                  Google
                </q-btn>
              </div>
              <div class="col-6">
                <q-btn
                  outline
                  class="full-width"
                  color="primary"
                  @click="handleFacebookLogin"
                >
                  <q-icon name="img:https://www.facebook.com/favicon.ico" class="q-mr-sm" />
                  Facebook
                </q-btn>
              </div>
            </div>

            <div class="text-center q-mt-lg">
              <p class="text-grey-7">
                Don't have an account?
                <q-btn flat dense color="primary" label="Sign Up" @click="router.push('/register')" />
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
import { required, email, minLength } from '@vuelidate/validators';
import AInput from '@/components/AInput.vue';

const router = useRouter();
const isLoading = ref(false);

const formData = reactive({
  email: '',
  password: ''
});

const rules = {
  email: { 
    required, 
    email,
    $autoDirty: true 
  },
  password: { 
    required, 
    minLength: minLength(8),
    $autoDirty: true
  }
};

const v$ = useVuelidate(rules, formData);

const getErrorMessage = (field: any) => {
  if (!field.$error) return '';
  
  if (field.required.$invalid) return 'This field is required';
  if (field.email?.$invalid) return 'Please enter a valid email';
  if (field.minLength?.$invalid) return `Minimum length is ${field.minLength.$params.min} characters`;
  
  return 'Invalid input';
};

const handleLogin = async () => {
  const isFormCorrect = await v$.value.$validate();
  
  if (!isFormCorrect) return;

  try {
    isLoading.value = true;
    console.log('Logging in with:', formData);
    // Add your login logic here
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  console.log('Google login clicked');
};

const handleFacebookLogin = () => {
  console.log('Facebook login clicked');
};
</script>

<style lang="scss">
.login-container {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--ion-color-light);
}

.login-form {
  width: 100%;
  max-width: 450px;
  padding: 20px;
  border-radius: 16px;
}
</style>
