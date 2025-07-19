import axios from 'axios';
import config from '@/config';
import { useAuthStore } from '@/stores/auth.store';

const interactionsService = {
  async addInteraction(data: Record<string, any>) {
    const authStore = useAuthStore();
    const headers = authStore.accessToken ? {
      Authorization: `Bearer ${authStore.accessToken}`
    } : {};
    console.log('addInteraction', data);
    const response = await axios.post(`${config.API_PRODUCTS}/productos/interaction`, data, {
      headers
    });
    return response.data;
  },

  async incrementCart(productId: string) {
    const authStore = useAuthStore();
    const headers = authStore.accessToken ? {
      Authorization: `Bearer ${authStore.accessToken}`
    } : {};
    
    const response = await axios.post(`${config.API_PRODUCTS}/productos/${productId}/carrito`, {}, {
      headers
    });
    return response.data;
  }
};

export default interactionsService; 