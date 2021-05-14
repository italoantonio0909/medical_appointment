import axios from 'axios'
import BASE_URL from './core'

export const fetchClient = (token) => {
  const defaultOptions = {
    baseURL: `${BASE_URL}/`,
  }

  // Create instance
  const instance = axios.create(defaultOptions)

  // Set the AUTH token for any request
  instance.interceptors.request.use(async function (config) {
    config.withCredentials = true
    config.headers.Authorization = token
      ? `Session ${token}`
      : 'Session 68da58e1ed96110f4b1c27828cfccc42591649eb'
    return config
  })

  return instance
}
