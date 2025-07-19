<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding flex flex-column items-center">
      <div class="flex flex-column justify-center h-full w-full text-dark">
        <div class="w-full form-container">
          <ABackButton class="q-mb-md" />
          <h1 class="title-600">Confirm address</h1>

          <form @submit.prevent="handleSubmit" class="q-gutter-y-md w-full address-form">
            <div class="inputs-top">
              <div class="input-group">
                <div class="body-small text-dark">Location Details</div>
                <AInput
                  name="locationDetails"
                  placeholder="Location Details"
                  v-model="formData.locationDetails"
                  :error="v$.locationDetails.$error"
                  :error-message="getErrorMessage(v$.locationDetails)"
                  @blur="v$.locationDetails.$touch()"
                />
              </div>
              <div class="input-group">
                <div class="body-small text-dark">Home number</div>
                <AInput
                  name="homeNumber"
                  placeholder="Home number"
                  v-model="formData.homeNumber"
                  :error="v$.homeNumber.$error"
                  :error-message="getErrorMessage(v$.homeNumber)"
                  @blur="v$.homeNumber.$touch()"
                />
              </div>
              <div class="input-group">
                <div class="body-small text-dark">References</div>
                <AInput
                  name="references"
                  placeholder="References"
                  v-model="formData.references"
                  :error="v$.references.$error"
                  :error-message="getErrorMessage(v$.references)"
                  @blur="v$.references.$touch()"
                />
              </div>
              <div class="input-group">
                <div class="body-small text-dark">Postal code</div>
                <AInput
                  name="postalCode"
                  placeholder="1234567"
                  v-model="formData.postalCode"
                  :error="v$.postalCode.$error"
                  :error-message="getErrorMessage(v$.postalCode)"
                  @blur="v$.postalCode.$touch()"
                />
              </div>
              <div class="input-group q-mt-md">
                <div class="body-small text-dark q-mb-xs">Tag</div>
                <div class="tag-buttons">
                  <q-btn
                    v-for="tag in tags"
                    :key="tag.value"
                    @click="selectTag(tag.value)"
                    class="q-mr-sm q-mb-sm tag-btn text-capitalize body-bold"
                    :class="{ 'selected-tag': selectedTag === tag.value }"
                  >
                    <img :src="tag.icon" alt="tag icon" class="tag-icon" />
                    {{ tag.label }}
                  </q-btn>
                </div>
              </div>
            </div>
            <q-btn
              type="submit"
              color="primary"
              class="full-width basic-btn q-mt-lg"
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
import AInput from '@/components/AInput.vue';
import { useAuthStore } from '@/stores/auth.store';
import userService from '@/services/user.service';
import { UserAddressData } from '@/types/address.types';
import ABackButton from '@/components/ABackButton.vue';
import homeIcon from '@/assets/imgs/home.svg';
import workIcon from '@/assets/imgs/carry-bag.svg';

const router = useRouter();
const isLoading = ref(false);
const authStore = useAuthStore();

const formData = reactive({
  locationDetails: '',
  homeNumber: '',
  references: '',
  postalCode: ''
});

const selectedTag = ref('home');
const tags = [
  { value: 'home', label: 'Home', icon: homeIcon },
  { value: 'work', label: 'Work', icon: workIcon }
];

const rules = {
  locationDetails: { required: helpers.withMessage('Location details are required', required) },
  homeNumber: { required: helpers.withMessage('Home number is required', required) },
  references: { required: helpers.withMessage('References are required', required) },
  postalCode: {
    required: helpers.withMessage('Postal code is required', required),
    validZip: helpers.withMessage('Please enter a valid postal code', helpers.regex(/^\d{5,7}$/))
  }
};

const v$ = useVuelidate(rules, formData);

const getErrorMessage = (field: any) => {
  if (!field.$error) return '';
  return Object.values(field.$errors)[0].$message;
};

function selectTag(tag: string) {
  selectedTag.value = tag;
}

const handleSubmit = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  try {
    isLoading.value = true;
    const userId = localStorage.getItem('userId');
    if (!userId || !authStore.accessToken) {
      throw new Error('No authentication token or user ID found');
    }
    const addressData: UserAddressData = {
      calle: formData.locationDetails,
      ciudad: '',
      provincia: '',
      pais: '',
      codigoPostal: formData.postalCode,
      referencias: formData.references,
      tag: selectedTag.value
    };
    await userService.createUserAddress(userId, addressData, authStore.accessToken);
    router.push('/home');
  } catch (error) {
    console.error('Address save error:', error);
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
.address-form {
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
.tag-buttons {
  display: flex;
  gap: 8px;
}
.tag-btn {
  border-radius: 1.2rem;
  padding: 0.8rem 1.2rem;
  border: 1.5px solid #17003314;
}
.selected-tag {
  background-color: #17003314;
}
</style> 