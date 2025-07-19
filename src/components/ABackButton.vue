<template>
  <q-btn flat round dense icon="chevron_left" @click="handleBack" class="a-back-btn" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
function handleBack() {
  router.back();
}
</script>

<style scoped lang="scss">
.a-back-btn {
  background: #17003314;
  color: #170033;
  box-shadow: none;
  width: 36px;
  height: 36px;
  border-radius: 100%;
}
</style> 