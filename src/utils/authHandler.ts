import { useAuthStore } from '@/stores/auth.store';

export function handleAuthResponse(response: { accessToken: string; expiresIn: number }) {
  const authStore = useAuthStore();
  
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('expiresIn', response.expiresIn.toString());
  
  authStore.setAuthData(response.accessToken, response.expiresIn);
} 