import axios from 'axios'

const API_URL = 'https://mercapp-seller-production.up.railway.app/api'

export const productsService = {
  create: (data: any, config?: any) => axios.post(`${API_URL}/productos`, data, config),
  getAll: (params?: any, headers?: any) => axios.get(`${API_URL}/productos`, { params, headers }),
  getById: (id: string) => axios.get(`${API_URL}/productos/${id}`),
  getBestSellers: () => axios.get(`${API_URL}/productos/mas-vendidos`),
  addInteraction: (data: any) => axios.post(`${API_URL}/productos/interaction`, data),
  incrementCart: (id: string) => axios.post(`${API_URL}/productos/${id}/carrito`),
} 