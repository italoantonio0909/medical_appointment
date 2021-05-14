import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform,
  Text,
} from 'react-native'
import { Block, theme, Card } from 'galio-framework'
import { Search } from '../../components'
import { Images } from '../../constants'
import { HeaderHeight } from '../../constants/utils'
import { emailListService } from '../../services/admin'
import { useDispatch, useSelector } from 'react-redux'
import { EMAIL_SENDED, EMAIL_SENDED_FILTER } from '../../state/actions'
import UserList from './User-List'

const { width, height } = Dimensions.get('screen')

const thumbMeasure = (width - 48 - 32) / 3
const MailSended = ({ navigation }) => {
  /*State*/
  const dispatch = useDispatch()

  // Check if users filters emails is active
  const usersfilterEmailSended = useSelector(
    (state) => state.usersfilterEmailSended
  )
  const users = useSelector((state) => {
    if (usersfilterEmailSended.length > 0) {
      return usersfilterEmailSended
    } else {
      return state.usersSendedMails
    }
  })

  /*Component initial*/
  useEffect(() => {
    let mounted = true
    if (mounted) {
      getDataEmails()
    }
    return () => (mounted = false)
  }, [dispatch])

  /*Get users*/
  const getDataEmails = () => {
    emailListService().then((response) => {
      dispatch({
        type: EMAIL_SENDED,
        payload: response,
      })
    })
  }

  /*Filter user*/
  const filterEmails = (e) => {
    dispatch({
      type: EMAIL_SENDED_FILTER,
      payload: e,
      filter: 'email',
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
                  Panel de correo electrónicos enviados
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block middle>
                <Search
                  onChangeText={(e) => filterEmails(e)}
                  placeholder="Buscar por email de usuario."
                />
              </Block>

              <Block flex>
                {users.length == 0 && (
                  <Card title="No se han enviado emails aún." />
                )}
                {users &&
                  users.map((email) => (
                    <UserList
                      key={email.id}
                      username={email.user.email}
                      email={`${email.date_sent} ` + email.body_text}
                      avatar="https://previews.123rf.com/images/imagevectors/imagevectors1601/imagevectors160100652/50599932-piso-icono-correo-verde-y-c%C3%ADrculo-verde.jpg"
                      noimage
                    />
                  ))}
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
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
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

export default MailSended
