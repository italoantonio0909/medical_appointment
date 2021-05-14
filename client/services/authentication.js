import { fetchClient } from './axiosConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BASE_URL from './core'

/**
 *
 * @param {object} loginData Username and password
 */
export const userLogin = (loginData) => {
  return fetchClient()
    .post('/api/auth/login/', loginData)
    .then((response) => response.data)
}

/**
 *
 * @param {object} formRegister Data new user
 */
export const userRegister = (formRegister) => {
  return fetchClient()
    .post('/api/auth/register/', formRegister)
    .then((response) => response.data)
}

/**
 *
 * @param {objec} formResetPassword send mail user with verification code
 */
export const userResetPassword = (formResetPassword) => {
  return fetchClient()
    .post('/api/auth/reset_password/', formResetPassword)
    .then((response) => response.data)
}

/**
 *
 * @param {object} formConfirmPassword Token received and new password reset
 */
export const userConfirmPassword = (token, formConfirmPassword) => {
  return fetchClient()
    .post(`/api/auth/reset_password_check/${token}/`, formConfirmPassword)
    .then((response) => response.data)
}

/**
 *
 * @param {object} formChangePassword Old password and new password reset
 */
export const userPasswordChange = async (user_id, formChangePassword) => {
  const token = await userGetToken()
  return fetchClient(token)
    .post(`/api/auth/change_password/${user_id}/`, formChangePassword)
    .then((response) => response.data)
}

/**
 *
 * @param {string} token Token in sesion user
 */
export const userMe = async () => {
  const token = await userGetToken()
  return fetchClient(token)
    .get('/api/auth/me/')
    .then((response) => response.data)
}

/**
 *
 * @param {number} user_id User id in session
 * @param {object} formUpdateProfile Date updated profile
 */
export const userProfileUpdate = async (user_id, formUpdateProfile) => {
  const token = await userGetToken()
  return fetchClient(token)
    .post(`/api/auth/update_profile/${user_id}/`, formUpdateProfile)
    .then((response) => response.data)
}

/**
 * Delete token Storage
 */
export const userLogout = async () => {
  await AsyncStorage.removeItem('token')
}

/**
 *
 * @param {string} token Token user saved
 */
export const userSaveToken = async (token) => {
  return await AsyncStorage.setItem('token', token)
}

/**
 * Obtain token in storage
 */
export const userGetToken = async () => {
  return await AsyncStorage.getItem('token')
}

/**
 *
 * @param {string} avatar Avatar user url
 * @return {string} Avatar with server url
 */
export const userAvatarUri = (avatar) => {
  return `${BASE_URL}${avatar}`
}
