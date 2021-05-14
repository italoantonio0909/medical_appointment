import {
  APPOINTMENT_CREATE,
  APPOINTMENT_DAY,
  APPOINTMENT_DELETE,
  APPOINTMENT_DELETED_LIST,
  APPOINTMENT_FILTER,
  APPOINTMENT_LIST,
  EMAIL_SENDED,
  EMAIL_SENDED_FILTER,
  USERS_FILTER,
  USERS_UPDATE,
  USERS_LIST,
  USERS_SEND_MAILS,
  USERS_PROFILE,
  APPOINTMENT_DELETED_NOTIFICATION,
  APPOINTMENT_DELETED_NOTIFICATION_DELETE,
  SPECIALTY_LIST,
  SPECIALTY_DELETE,
  SPECIALTY_FILTER,
  ADMIN_APPOINTMENT_DELETED,
} from './actions'

const initialState = {
  userProfile: [],
  users: [],
  usersFilter: [],
  usersSendMail: [],
  usersSendedMails: [],
  usersfilterEmailSended: [],
  appointment: [],
  appointmentDeletedListUser: [],
  appointmentFilter: [],
  appointmentDay: [],
  appointmentDeletedNotification: [],
  adminAppointmentDeleted: [],
  specialties: [],
  specialtiesFilter: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS_PROFILE: {
      return { ...state, userProfile: action.payload }
    }
    case USERS_UPDATE: {
      return { ...state, userProfile: action.payload }
    }
    case USERS_LIST: {
      return { ...state, users: action.payload }
    }

    case USERS_FILTER:
      if (action.filter === 'email') {
        const usersFilter = state.users.filter((user) =>
          user.email.toLowerCase().includes(action.payload.toLowerCase())
        )
        return {
          ...state,
          usersFilter,
        }
      }

    case EMAIL_SENDED: {
      return { ...state, usersSendedMails: action.payload }
    }
    case EMAIL_SENDED_FILTER: {
      if (action.filter === 'email') {
        const usersfilterEmailSended = state.usersSendedMails.filter((email) =>
          email.user.email.toLowerCase().includes(action.payload.toLowerCase())
        )
        return { ...state, usersfilterEmailSended }
      }
    }

    case USERS_SEND_MAILS: {
      return { ...state, usersSendMail: action.payload }
    }

    case APPOINTMENT_LIST: {
      return { ...state, appointment: action.payload }
    }
    case APPOINTMENT_CREATE: {
      return {
        ...state,
        appointment: state.appointment.concat(action.payload),
      }
    }
    case APPOINTMENT_FILTER: {
      const filterAppointment = state.appointment.filter((appointment) =>
        appointment.date.includes(action.payload)
      )
      return {
        ...state,
        filterAppointment,
      }
    }
    case APPOINTMENT_DELETE: {
      const appointmentDeleted = state.appointment.filter(
        (appointment) => appointment.id !== action.payload
      )
      return { ...state, appointment: appointmentDeleted }
    }

    case APPOINTMENT_DELETED_LIST: {
      return { ...state, appointmentDeletedListUser: action.payload }
    }
    case APPOINTMENT_DAY: {
      return { ...state, appointmentDay: action.payload }
    }
    case APPOINTMENT_DELETED_NOTIFICATION: {
      return { ...state, appointmentDeletedNotification: action.payload }
    }
    case APPOINTMENT_DELETED_NOTIFICATION_DELETE: {
      const appointmentDeleted = state.appointmentDeletedNotification.filter(
        (appointment) => appointment.id !== action.payload
      )
      return { ...state, appointmentDeletedNotification: appointmentDeleted }
    }
    case SPECIALTY_LIST: {
      return { ...state, specialties: action.payload }
    }
    case SPECIALTY_DELETE: {
      const specialtyDeleted = state.specialties.filter(
        (specialty) => specialty.id !== action.payload
      )
      return { ...state, appointment: specialtyDeleted }
    }
    case SPECIALTY_FILTER: {
      const specialtiesFilter = state.specialties.filter((element) =>
        element.title.toLowerCase().includes(action.payload.toLowerCase())
      )
      return {
        ...state,
        specialtiesFilter,
      }
    }
    case ADMIN_APPOINTMENT_DELETED: {
      return { ...state, adminAppointmentDeleted: action.payload }
    }
    default:
      return state
  }
}

export default reducer
