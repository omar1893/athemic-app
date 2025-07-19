<template>
    <q-btn
      :class="['auth-button', `auth-button--${variant}`]"
      class="body-bold item-center justify-center"
      @click="$emit('click')"
    >
        <img v-if="icon === 'ios'" src="@/assets/imgs/apple-logo-white.svg?inline" alt="Icon" class="auth-button__icon">
        <img v-if="icon === 'email'" src="@/assets/imgs/envelope.svg?inline" alt="Icon" class="auth-button__icon">
        <span class="q-ml-sm">{{ label }}</span>
    </q-btn>
  </template>
  
  <script setup lang="ts">
  interface Props {
    variant?: 'default' | 'primary' | 'outline';
    icon?: string;
    label: string;
  }
  
  withDefaults(defineProps<Props>(), {
    variant: 'default',
  });
  
  /* const emit = defineEmits(['click']); */
  </script>
  
  <style scoped>
  .auth-button {
    width: 100%;
    min-height: 56px;
    padding: 1.6rem;
    border-radius: 200px;
    font-weight: 600;
    font-size: 1.6rem;
    letter-spacing: -0.16px;
    line-height: 1.2;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: none;
  }
  
  .auth-button--default {
    background-color: #170033;
    color: white;
  }
  
  .auth-button--primary {
    background-color: #875EF8;
    color: white;
  }
  
  .auth-button--outline {
    border: 1px solid #170033;
    color: #170033;
    background-color: transparent;
  }
  
  .auth-button__icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    align-self: stretch;
    flex-shrink: 0;
    margin: auto 0;
  }
  
  .auth-button__label {
    align-self: stretch;
    margin: auto 0;
  }
  </style>
  