import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform,
  Text,
  View,
  KeyboardAvoidingView,
} from 'react-native'
import { Block, theme, Checkbox } from 'galio-framework'
import { Search, Button, Snackbar, Input, Icon } from '../../components'
import { Images } from '../../constants'
import { HeaderHeight } from '../../constants/utils'
import { userListService } from '../../services/admin'
import { userAvatarUri } from '../../services/authentication'
import { useDispatch, useSelector } from 'react-redux'
import UserList from './User-List'
import { argonTheme } from '../../constants/'
import { USERS_FILTER, USERS_LIST, USERS_SEND_MAILS } from '../../state/actions'
const { width, height } = Dimensions.get('screen')
const thumbMeasure = (width - 48 - 32) / 3

const Mail = ({ navigation }) => {
  /*State*/
  const [notification, setNotification] = useState('')
  const [email, setEmail] = useState([])
  const dispatch = useDispatch()
  const usersFilter = useSelector((state) => state.usersFilter)
  const users = useSelector((state) => {
    if (usersFilter.length > 0) {
      return usersFilter
    } else {
      return state.users
    }
  })

  /*Component initial*/
  useEffect(() => {
    let mounted = true
    if (mounted) {
      getDataUsers()
    }
    return () => (mounted = false)
  }, [dispatch])

  /*Get users*/
  const getDataUsers = () => {
    userListService().then((response) => {
      dispatch({
        type: USERS_LIST,
        payload: response,
      })
    })
  }

  /*Filter user*/
  const filterUsers = (e) => {
    dispatch({
      type: USERS_FILTER,
      payload: e,
      filter: 'email',
    })
  }

  /*Submit*/
  const submit = () => {
    if (email.length == 0) {
      setNotification('Seleccione al menos un elemento.')
    } else {
      dispatch({
        type: USERS_SEND_MAILS,
        payload: email,
      })
      navigation.navigate('MailSend')
    }
  }

  /*Select email users checkbox*/
  const onChangeEmail = (id, first_name, last_name, mail, avatar) => {
    if (email.length > 0) {
      const exists = email.filter((email) => email.id == id)
      if (exists.length > 0) {
        setEmail(email.filter((email) => email.id !== id))
      } else {
        setEmail([
          ...email,
          {
            id: id,
            first_name: first_name,
            last_name: last_name,
            email: mail,
            avatar: avatar,
          },
        ])
      }
    } else {
      setEmail([
        ...email,
        {
          id: id,
          first_name: first_name,
          last_name: last_name,
          email: mail,
          avatar: avatar,
        },
      ])
    }
  }
  return (
    <Block>
      {!!notification && (
        <Snackbar
          actionHandler={() => {
            setNotification('')
          }}
          actionText="Entendido"
          textMessage={notification}
        />
      )}
      <Block flex style={styles.profile}>
        <ImageBackground
          source={Images.RegisterBackground}
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
                  Panel de correo electrónicos
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block middle>
                <Search
                  onChangeText={(e) => filterUsers(e)}
                  placeholder="Buscar usuarios por correo."
                />

                <Button
                  onPress={submit}
                  style={styles.createButton}
                  icon="plus"
                  iconFamily="antdesign"
                  iconSize={20}
                  color="success"
                >
                  REDACTAR
                </Button>
              </Block>

              <Block flex style={styles.container}>
                {users &&
                  users.map((user) => (
                    <Block key={user.id}>
                      <Checkbox
                        iconSize={17}
                        onChange={() => {
                          onChangeEmail(
                            user.id,
                            user.first_name,
                            user.last_name,
                            user.email,
                            user.avatar
                          )
                        }}
                        label=""
                        color="success"
                      ></Checkbox>
                      <UserList
                        username={user.first_name + user.last_name}
                        email={user.email}
                        avatar={userAvatarUri(user.avatar)}
                        noimage
                      />
                    </Block>
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

export default Mail
