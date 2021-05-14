import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  LogBox,
  Alert,
  View,
  Platform,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { Block, theme, Icon } from 'galio-framework'
import { argonTheme } from '../../constants'
import { appointmentCreateService } from '../../services/appointment'
import { specialtyListService } from '../../services/admin'
import { useSelector, useDispatch } from 'react-redux'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Button, Snackbar, Input } from '../../components'
import { APPOINTMENT_CREATE, SPECIALTY_LIST } from '../../state/actions'
import { formatDate, emptyField, formatTime } from '../../utils/validators'
const { width, height } = Dimensions.get('screen')

const AppointmentCreate = ({ navigation }) => {
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState()
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [items, setItems] = useState()
  const [specialtyId, setSpecialtyId] = useState(0)
  const [dateTimeInput, setDateTimeInput] = useState({ value: '', error: '' })
  const dispatch = useDispatch()
  const userProfile = useSelector((state) => state.userProfile)

  useEffect(() => {
    let mounted = true
    if (mounted) {
      getSpecialties()
    }
    return () => (mounted = false)
  }, [])

  const getSpecialties = async () => {
    try {
      const response = await specialtyListService()
      dispatch({
        type: SPECIALTY_LIST,
        payload: response,
      })

      let vector = []
      response.forEach((element) => {
        vector.push({ label: element.title, value: element.id })
      })
      setItems(vector)
    } catch (error) {}
  }
  // Show notification
  const showAlert = (message, description) => {
    Alert.alert(message, description)
  }
  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios')
    if (mode == 'date') {
      const currentDate = selectedValue || new Date()
      setDate(currentDate)
      setMode('time')
      setShow(Platform.OS !== 'ios') // to show the picker again in time mode
    } else {
      const selectedTime = selectedValue || new Date()
      setTime(selectedTime)
      setShow(Platform.OS === 'ios')
      setMode('date')
      // When date and time is ready set input value
      setDateTimeInput({
        value: `Fecha ${formatDate(date)} -- hora ${formatTime(selectedTime)}`,
      })
    }
  }

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = () => {
    showMode('date')
  }

  const showTimepicker = () => {
    showMode('time')
  }

  const submit = async () => {
    const errorDateTimeInput = emptyField(dateTimeInput.value)
    if (specialtyId == 0) {
      showAlert('Seleccione especialidad.', 'Verifique su selección.')
      return
    }
    if (errorDateTimeInput) {
      setDateTimeInput({ error: errorDateTimeInput })
      return
    }
    const dateSelected = formatDate(date)
    const timeSelected = formatTime(time)
    const user = userProfile.id
    const formAppointment = {
      user: user,
      specialty: specialtyId,
      state: false,
      date: dateSelected,
      time: timeSelected,
    }
    try {
      const response = await appointmentCreateService(formAppointment)
      dispatch({
        type: APPOINTMENT_CREATE,
        payload: response,
      })
      showAlert(
        'Cita asignada con éxito',
        'Enviaremos notificaciones de aviso.'
      )
      setDateTimeInput('')
    } catch (error) {
      if (error.response) {
        showAlert(error.response.data.errors[0].message, 'Verifique los datos')
      }
    }
  }

  return (
    <Block flex={2} style={{ marginTop: 40, marginLeft: 20, marginRight: 20 }}>
      <View
        style={{
          // The solution: Apply zIndex to any device except Android
          ...(Platform.OS !== 'android' && {
            zIndex: 10,
          }),
        }}
      >
        <DropDownPicker
          items={
            items ? items : [{ label: 'Selección de specialidades', value: 0 }]
          }
          //items={}
          placeholder="Especialidad"
          labelStyle={{ fontSize: 14, color: '#000' }}
          itemStyle={{ fontSize: 14, color: '#000' }}
          placeholderStyle={{ fontSize: 14, color: '#000' }}
          containerStyle={{ height: 40 }}
          style={{ backgroundColor: '#ffffff' }}
          dropDownStyle={{
            elevation: 5,
            backgroundColor: '#fafafa',
            marginTop: 2,
          }}
          onChangeItem={(item) => setSpecialtyId(item.value)}
        />
      </View>

      <Input
        success={!!dateTimeInput.value}
        error={!!dateTimeInput.error}
        value={dateTimeInput.value}
        onChangeText={showDatepicker}
        placeholder="Digite fecha y hora."
        right
        iconContent={
          <Icon
            size={20}
            color={argonTheme.COLORS.ICON}
            name="calendar"
            family="EnTypo"
          />
        }
      />
      <Button
        style={{ ...styles.createButton }}
        onPress={submit}
        color="primary"
      >
        AGENDAR CITA
      </Button>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          timeZoneOffsetInMinutes={0}
          onChange={onChange}
        />
      )}
    </Block>
  )
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  createButton: {
    width: width * 0.7,
    marginLeft: 27,
  },
  container: {
    marginTop: 50,
  },
})

export default AppointmentCreate
