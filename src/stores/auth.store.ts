import { ref } from 'vue';
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  authId: string;
  email: string;
  exp: number;
  iat: number;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const email = ref('');
  const userData = ref<UserData | null>(null);
  const accessToken = ref<string | null>(null);
  const expiresIn = ref<number | null>(null);

  const setEmail = (newEmail: string) => {
    email.value = newEmail;
  };

  const setAuthData = (token: string, expires: number) => {
    accessToken.value = token;
    expiresIn.value = expires;
    try {
      userData.value = jwtDecode(token) as UserData;
      console.log(userData.value);
      
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }
  };

  const loadStoredAuth = () => {
    const storedToken = localStorage.getItem('accessToken');
    const storedExpires = localStorage.getItem('expiresIn');

    if (storedToken && storedExpires) {
      setAuthData(storedToken, parseInt(storedExpires));
    }
  };

  const clearAuth = () => {
    accessToken.value = null;
    expiresIn.value = null;
    userData.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');
  };

  return {
    email,
    userData,
    accessToken,
    expiresIn,
    setEmail,
    setAuthData,
    loadStoredAuth,
    clearAuth
  };
}); 