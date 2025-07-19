import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import MainView from '../views/MainView.vue'
import PinVerificationView from '../views/PinVerificationView.vue'
import ProfileDetailsView from '../views/ProfileDetailsView.vue'
import ConfirmAddressView from '../views/ConfirmAddressView.vue'
import GoogleCallback from '../views/GoogleCallback.vue'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    name: 'Main',
    component: MainView
  },
  {
    path: '/pin-verification',
    name: 'PinVerification',
    component: PinVerificationView
  },
  {
    path: '/profile-details',
    name: 'ProfileDetails',
    component: ProfileDetailsView
  },
  {
    path: '/confirm-address',
    name: 'ConfirmAddress',
    component: ConfirmAddressView
  },
  {
    path: '/auth/callback',
    name: 'GoogleCallback',
    component: GoogleCallback
  },
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetailView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
