<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>

<style lang="scss">
@import './styles/styles.scss';
ion-content {
  --background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 5.11%, #FFF 17.92%), linear-gradient(130deg, #EAEEFD 5.38%, #E3E9FD 35.38%, #D7DBF9 59.18%), #FFF!important;
}
</style>
