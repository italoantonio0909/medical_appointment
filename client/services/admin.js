import { userGetToken } from './authentication'
import { fetchClient } from './axiosConfig'

/**
 *
 * @param {object} specialty Specialty object create
 */
export const specialtyCreateService = (specialty) => {
  return fetchClient()
    .post('api/specialties/create/', specialty)
    .then((response) => response.data)
}

/**
 *
 * @param {object} specialty Specialty object create
 */
export const specialtyUpdateService = (specialtyId, data) => {
  return fetchClient()
    .post(`api/specialties/update/${specialtyId}/`, data)
    .then((response) => response.data)
}

/**
 * Appointment list
 *
 */
export const specialtyListService = () => {
  return fetchClient()
    .get('api/specialties/list/?is_active=true')
    .then((response) => response.data)
}

/**
 * Function allow obtain users
 *
 */
export const userListService = () => {
  return fetchClient()
    .get('api/users/?is_admin=false')
    .then((response) => response.data)
}

/**
 * Function allow send mails
 * @param {object} data Data object with information
 *
 */
export const emailCreateService = (data) => {
  return fetchClient()
    .post('api/emails/create/', data)
    .then((response) => response.data)
}

/**
 * List emails
 *
 */
export const emailListService = () => {
  return fetchClient()
    .get('api/emails/list/')
    .then((response) => response.data)
}

/**
 * List appotiments day
 *
 */
export const appointmentDayListService = (date) => {
  return fetchClient()
    .get(`api/appointment/list/?date=${date}`)
    .then((response) => response.data)
}

/**
 *
 * @param {object} data Appointment assign not working
 */
export const appointmentAssignService = async (data) => {
  const token = await userGetToken()
  return fetchClient(token)
    .post('api/appointment_assign/create/', data)
    .then((response) => response.data)
}

export const appointmentNotificationDelete = async () => {
  const token = await userGetToken()
  return fetchClient(token)
    .get(`api/appointment/list/?rejected=${true}`)
    .then((response) => response.data)
}
