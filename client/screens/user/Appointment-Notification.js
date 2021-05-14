import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform,
  Text,
  Alert,
} from 'react-native'
import { Block, Card, theme, Icon } from 'galio-framework'
import {
  AppointmentDeletedNotificationService,
  appointmentAcceptService,
} from '../../services/appointment'
import {
  APPOINTMENT_CREATE,
  APPOINTMENT_DELETED_NOTIFICATION,
  APPOINTMENT_DELETED_NOTIFICATION_DELETE,
} from '../../state/actions'
import { Images } from '../../constants'
import { HeaderHeight } from '../../constants/utils'
import { useDispatch, useSelector } from 'react-redux'

const { width, height } = Dimensions.get('screen')

const thumbMeasure = (width - 48 - 32) / 3
const AppointmentNotification = ({ navigation }) => {
  //Data initial
  const dispatch = useDispatch()
  const appointmentDeleted = useSelector(
    (state) => state.appointmentDeletedNotification
  )

  useEffect(() => {
    let mounted = true
    if (mounted) {
      getNotifications()
    }
    return function () {
      mounted = false
    }
  }, [dispatch])

  const submit = async (user_id, appointment_id) => {
    try {
      Alert.alert(
        '¿Desea tomar esta turno?',
        'Se asignará el horario ya establecido en la cita médica',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Aceptar',
            onPress: async () => {
              try {
                const response = await appointmentAcceptService(
                  user_id,
                  appointment_id
                )
                dispatch({
                  type: APPOINTMENT_CREATE,
                  payload: response,
                })
                dispatch({
                  type: APPOINTMENT_DELETED_NOTIFICATION_DELETE,
                  payload: appointment_id,
                })
                Alert.alert(
                  'Se asignó correctamente.',
                  'Estaremos enviando notificaciones de aviso.'
                )
              } catch (error) {
                Alert.alert(error.response.data.errors[0].message)
              }
            },
          },
        ],
        { cancelable: false }
      )
    } catch (error) {
      Alert.alert(error.response.data.errors[0].message)
    }
  }

  const getNotifications = () => {
    AppointmentDeletedNotificationService().then((response) => {
      dispatch({
        type: APPOINTMENT_DELETED_NOTIFICATION,
        payload: response,
      })
    })
  }

  return (
    <Block flex style={styles.profile}>
      <Block flex>
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
                  Notificaciones de citas rechazadas. Puedes aprovechar estos
                  turnos disponibles al ritmo de tu horario.
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block flex>
                <Block flex>
                  {appointmentDeleted.length == 0 && (
                    <Card title="No existen citas rechazadas aún." />
                  )}
                  {appointmentDeleted &&
                    appointmentDeleted.map((element) => (
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
                                name="select1"
                                onPress={() =>
                                  submit(element.user.id, element.id)
                                }
                                family="antDesign"
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
              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  space: {
    marginTop: 10,
  },
  createButton: {
    width: width * 0.7,
    marginTop: 25,
  },
  container: {
    height: 90,
  },
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    //marginBottom: -HeaderHeight * 2,
    flex: 1,
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

export default AppointmentNotification
