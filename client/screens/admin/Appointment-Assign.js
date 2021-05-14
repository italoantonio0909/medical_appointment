import React, { useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform,
  Text,
  Alert,
} from 'react-native'
import { Block, theme } from 'galio-framework'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Button, Snackbar, Icon, Input } from '../../components'
import { Images } from '../../constants'
import { argonTheme } from '../../constants'
import { HeaderHeight } from '../../constants/utils'
import { useSelector } from 'react-redux'
import { appointmentAssignService } from '../../services/admin'
import {
  formatDate,
  validateTime,
  formatTime,
  emptyField,
} from '../../utils/validators'

const { width, height } = Dimensions.get('screen')
const thumbMeasure = (width - 48 - 32) / 3

const AppointmentAssign = ({ navigation }) => {
  /*State*/
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState()
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [dateTimeInput, setDateTimeInput] = useState({ value: '', error: '' })
  const [notification, setNotification] = useState('')
  const user = useSelector((state) => state.userProfile)

  // Show notification
  const showAlert = (message) => {
    Alert.alert(message)
  }
  /*Submit*/
  const submit = async () => {
    const errorDateTimeInput = emptyField(dateTimeInput.value)
    if (errorDateTimeInput) {
      setDateTimeInput({ error: errorDateTimeInput })
      return
    }
    const dateSelected = formatDate(date)
    const timeSelected = formatTime(time)
    const formAppointment = {
      state: true,
      user: user.id,
      date: dateSelected,
      time: timeSelected,
    }
    try {
      await appointmentAssignService(formAppointment)
      showAlert(
        'Fecha asignada como no laborable.',
        'Se notificará a los usuarios.'
      )
      setDateTimeInput({ value: '', error: '' })
    } catch (error) {
      if (error.response) {
        showAlert(error.response.data.errors[0].message)
      }
    }
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

  return (
    <Block>
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
      <Block flex style={styles.profile}>
        <ImageBackground
          source={Images.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: '25%' }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle>
                <Text size={17} color="#8898AA">
                  Panel de asignación de citas. Estos dias serán asignados como
                  no laborables y se notificará a los usuarios.
                </Text>
              </Block>

              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block flex middle>
                <Input
                  success={!!dateTimeInput.value}
                  error={!!dateTimeInput.error}
                  value={dateTimeInput.value}
                  onChangeText={showDatepicker}
                  placeholder="Digite fecha y hora no laborable"
                  right
                  iconContent={
                    <Icon
                      size={20}
                      color={argonTheme.COLORS.ICON}
                      name="calendar"
                      family="EnTypo"
                      style={styles.inputIcons}
                    />
                  }
                />
                <Button
                  onPress={submit}
                  color="primary"
                  style={styles.createButton}
                >
                  ASIGNAR
                </Button>
              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  createButton: {
    width: width * 0.7,
    marginTop: 25,
    marginLeft: 20,
  },
  container: {
    marginTop: 40,
  },
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    //position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  inputIcons: {
    marginRight: 12,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure,
  },
})

export default AppointmentAssign
