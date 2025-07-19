import axios, { AxiosError } from 'axios';
import config from '@/config';
import { UserProfileData } from '@/types/user.types';
import { UserAddressData } from '@/types/address.types';

const userService = {
  async getUserDetails(userId: string, token: string) {
    try {
      const response = await axios.get(`${config.API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { data: response.data, exists: true };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return { data: null, exists: false };
      }
      throw error;
    }
  },

  async createUserProfile(userData: UserProfileData, token: string) {
    const response = await axios.post(`${config.API_URL}/users`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async createUserAddress(userId: string, address: UserAddressData, token: string) {
    const response = await axios.post(`${config.API_URL}/users/${userId}/direcciones`, address, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default userService; 