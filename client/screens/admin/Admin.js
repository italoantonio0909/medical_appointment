import React, { useEffect } from 'react'
import { Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { APPOINTMENT_DAY } from '../../state/actions'
import { userAvatarUri } from '../../services/authentication'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  LogBox,
} from 'react-native'
import { Block, theme, Card, Icon } from 'galio-framework'
import { argonTheme, articles } from '../../constants'
const { width, height } = Dimensions.get('screen')
import { appointmentDayListService } from '../../services/admin'

const Admin = () => {
  /* State and selector*/
  const appointmentDayList = useSelector((state) => state.appointmentDay)
  const dispatch = useDispatch()

  useEffect(() => {
    let mounted = true
    if (mounted) {
      getAppointmentDay()
    }
    return () => (mounted = false)
  }, [])

  /*get appointments day*/
  const getAppointmentDay = () => {
    const date = new Date().toISOString().slice(0, 10)

    appointmentDayListService(date).then((response) => {
      dispatch({
        type: APPOINTMENT_DAY,
        payload: response,
      })
    })
  }

  return (
    <Block flex center style={styles.home}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {appointmentDayList.length == 0 && (
            <Card title="Aún no tienes citas médicas para hoy." />
          )}
          {appointmentDayList &&
            appointmentDayList.map((element) => (
              <Card
                borderless
                avatar={userAvatarUri(element.user.avatar)}
                key={element.id}
                style={styles.cards}
                title={element.user.email}
                caption={element.specialty.title}
                location={element.date}
                location={
                  <Block flex>
                    <Block middle row>
                      <Icon
                        name="stopwatch"
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
                  </Block>
                }
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
  createButton: {
    width: width * 0.7,
    marginTop: 25,
  },
  cards: {
    width: width - theme.SIZES.BASE * 2,
    marginVertical: theme.SIZES.BASE * 0.875,
    marginTop: 10,
    elevation: 2,
  },
})

export default Admin
