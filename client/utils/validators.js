export const emptyField = (field) => {
  if (!field || field.length == 0) return 'Campo requerido'
}

export const validateTime = (time) => {
  if (time.getHours() > 17 || time.getHours() < 8) {
    return 'Hora fuera del rango de atención.'
  }
}

export const formatDate = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
export const formatTime = (time) => {
  return `${time.getHours()}:${time.getMinutes()}`
}
