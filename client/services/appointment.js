import { fetchClient } from './axiosConfig'
import { userGetToken } from './authentication'

/**
 *
 * @param {object} appointment Object appointment with the information
 */
export const appointmentCreateService = async (appointment) => {
  const token = await userGetToken()
  return fetchClient(token)
    .post('/api/appointment/create/', appointment)
    .then((response) => response.data)
}

/**
 *
 * @param {number} appointment_id Id appointment delete
 *
 */
export const appointmentDeleteService = async (user_id, appointment_id) => {
  const token = await userGetToken()
  return fetchClient(token)
    .post(`/api/appointment/delete/${user_id}/${appointment_id}/`)
    .then((response) => response.data)
}

/**
 *
 * @param {number} user_id User id of sesion
 *
 */
export const appointmentListService = async (user_id) => {
  const token = await userGetToken()
  return fetchClient(token)
    .get(`/api/appointment/list/?user=${user_id}&rejected=false`)
    .then((response) => response.data)
}

/**
 *
 * @param {number} User Identification id to list appointment deleted
 *
 */
export const appointmentListDeletedService = async (user) => {
  const token = await userGetToken()
  return fetchClient(token)
    .get(`/api/appointment/list/?user=${user}&rejected=true`)
    .then((response) => response.data)
}

/**
 *
 * @param {number} appointment_id Id appointment of delete
 * @param {number} user_id User id in session
 *
 */
export const appointmentAcceptService = async (user_id, appointment_id) => {
  const token = await userGetToken()
  return fetchClient(token)
    .post(`/api/appointment/accept/${user_id}/${appointment_id}/`)
    .then((response) => response.data)
}

export const AppointmentDeletedNotificationService = async () => {
  const token = await userGetToken()
  return fetchClient(token)
    .get('/api/appointment/list/?rejected=true')
    .then((response) => response.data)
}
