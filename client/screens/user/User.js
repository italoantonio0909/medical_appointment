import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  LogBox,
  Alert,
} from 'react-native'
import { Block, Card, theme, Icon } from 'galio-framework'
import {
  appointmentDeleteService,
  appointmentListService,
} from '../../services/appointment'
import { useSelector, useDispatch } from 'react-redux'
import { APPOINTMENT_DELETE, APPOINTMENT_LIST } from '../../state/actions'
const { width, height } = Dimensions.get('screen')

const User = ({ navigation }) => {
  /*State*/
  const dispatch = useDispatch()
  const appointments = useSelector((state) => state.appointment)
  const userProfile = useSelector((state) => state.userProfile)

  useEffect(() => {
    let mounted = true
    if (mounted) {
      getAppointment()
    }
    return () => (mounted = false)
  }, [dispatch])

  /*Get appointment */
  const getAppointment = async () => {
    const user = await userProfile.id
    appointmentListService(user).then((response) => {
      dispatch({
        type: APPOINTMENT_LIST,
        payload: response,
      })
    })
  }

  /* Delete Appointment*/
  const deleteAppointmentSubmit = async (appointment) => {
    const user_id = userProfile.id
    Alert.alert(
      '¿ Desea eliminar ésta cita ?',
      'Esta acción puede afectar su asistencia al consultorio médico.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              await appointmentDeleteService(user_id, appointment)
              dispatch({
                type: APPOINTMENT_DELETE,
                payload: appointment,
              })
              navigation.navigate('AppointmentDeleted')
            } catch (error) {}
          },
        },
      ],
      { cancelable: false }
    )
  }
  return (
    <Block flex center style={styles.home}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {appointments.length == 0 && (
            <Card title="No tienes citas médicas asignadas aún." />
          )}
          {appointments &&
            appointments.map((element) => (
              <Card
                key={element.id}
                style={styles.space}
                title={element.specialty.title}
                caption={element.date}
                location={
                  <Block row right>
                    <Block
                      row
                      middle
                      style={{ marginHorizontal: theme.SIZES.BASE }}
                    >
                      <Icon
                        name="calendar"
                        family="entypo"
                        color={theme.COLORS.MUTED}
                        size={20}
                      />
                      <Text
                        color={theme.COLORS.MUTED}
                        size={theme.SIZES.FONT * 0.875}
                        style={{ marginLeft: theme.SIZES.BASE * 0.25 }}
                      >
                        {element.time}
                      </Text>
                    </Block>
                    <Block
                      row
                      middle
                      style={{ marginHorizontal: theme.SIZES.BASE }}
                    >
                      <Icon
                        onPress={() => deleteAppointmentSubmit(element.id)}
                        name="trash"
                        family="entypo"
                        color={theme.COLORS.MUTED}
                        size={30}
                      />
                    </Block>
                  </Block>
                }
                borderless
                shadowColor={theme.COLORS.BLACK}
              />
            ))}
        </Block>
      </ScrollView>
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
  space: {
    marginTop: 10,
  },
})

export default User
