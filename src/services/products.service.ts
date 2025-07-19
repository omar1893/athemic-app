import axios from 'axios';
import config from '@/config';
import { useAuthStore } from '@/stores/auth.store';

const productsService = {
  async getAll(params?: Record<string, any>) {
    const authStore = useAuthStore();
    const headers = authStore.accessToken ? {
      Authorization: `Bearer ${authStore.accessToken}`
    } : {};
    
    const response = await axios.get(`${config.API_PRODUCTS}/productos`, { 
      params,
      headers
    });
    return response.data;
  },

  async getBestSellers() {
    const authStore = useAuthStore();
    const headers = authStore.accessToken ? {
      Authorization: `Bearer ${authStore.accessToken}`
    } : {};
    
    const response = await axios.get(`${config.API_PRODUCTS}/productos/mas-vendidos`, {
      headers
    });
    return response.data;
  }
};

export default productsService; 