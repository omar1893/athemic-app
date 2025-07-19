import axios from 'axios'
import appConfig from '../config'

const getBaseUrl = () => {
  return appConfig.apiUrl
}

const ApiCall = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

ApiCall.interceptors.request.use((config: any) => {
  /* const token = AuthStore.data.token */
  /* if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  } */

  return config
},
(err: any) => Promise.reject(err))

ApiCall.interceptors.response.use(
  (res: any) => res,
  (err: any) => {
    /* if (err.response.status === 401 && AuthStore.isAuthenticated()) {
      AuthStore.logout()
    } */
    return Promise.reject(err)
  }
)

export const setBaseUrl = (url: string) => {
  ApiCall.defaults.baseURL = url
}

export default ApiCall
