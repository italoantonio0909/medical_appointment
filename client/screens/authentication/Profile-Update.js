import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Text,
} from 'react-native'
import { Block, theme } from 'galio-framework'
import { HeaderHeight } from '../../constants/utils'

const { width, height } = Dimensions.get('screen')

import { Button, Icon, Input, Snackbar } from '../../components'
import { Images, argonTheme } from '../../constants'
import { userProfileUpdate, userAvatarUri } from '../../services/authentication'
import { emptyField } from '../../utils/validators'
import { useDispatch, useSelector } from 'react-redux'
import { USER_PROFILE, USERS_UPDATE } from '../../state/actions'
const thumbMeasure = (width - 48 - 32) / 3

const ProfileUpdate = ({ navigation }) => {
  /*Initial state*/
  const [firstName, setFirstName] = useState({ value: '', error: '' })
  const [lastName, setLastName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [avatar, setAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const userProfile = useSelector((state) => state.userProfile)
  const dispatch = useDispatch()

  /*State*/
  useEffect(() => {
    let mounted = true
    if (mounted) {
      getProfile()
    }
    return () => (mounted = true)
  }, [userProfile])

  /*Get profile*/
  const getProfile = async () => {
    setEmail({ value: userProfile.email })
    setFirstName({ value: userProfile.first_name })
    setLastName({ value: userProfile.last_name })
    setAvatar(userAvatarUri(userProfile.avatar))
  }

  /*Submit*/

  const submit = async () => {
    setLoading(true)
    const firstNameError = emptyField(firstName.value)
    const lastNameError = emptyField(lastName.value)
    const emailError = emptyField(email.value)
    if (firstNameError || lastNameError || emailError) {
      setFirstName({ ...firstName, error: firstNameError })
      setLastName({ ...lastName, error: lastNameError })
      setEmail({ ...email, error: emailError })
      return
    }

    const user = userProfile.id
    const ProfileUpdateForm = {
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
    }

    try {
      const response = await userProfileUpdate(user, ProfileUpdateForm)
      dispatch({
        type: USERS_UPDATE,
        payload: response.data,
      })
      navigation.navigate('Profile')
      setLoading(false)
      setError('')
    } catch (error) {
      if (error.response) {
        setError(error.response.data.errors[0].message)
        setLoading(false)
      }
    }
  }
  return (
    <Block flex middle>
      {!!error && (
        <Snackbar
          actionHandler={() => {
            setError('')
          }}
          actionText="Entendido"
          textMessage={error}
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
              <Block style={styles.info}>
                {!!avatar && (
                  <Block middle style={styles.avatarContainer}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                  </Block>
                )}
              </Block>
              <Block flex>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8}>
                    <Input
                      success={!!firstName.value}
                      error={!!firstName.error}
                      onChangeText={(e) => setFirstName({ value: e })}
                      value={firstName.value}
                      placeholder="Nombres"
                      right
                      iconContent={
                        <Icon
                          size={18}
                          style={{ marginTop: 2, marginRight: 5 }}
                          color={argonTheme.COLORS.ICON}
                          name="adduser"
                          family="AntDesign"
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      success={!!lastName.value}
                      error={!!lastName.error}
                      onChangeText={(e) => setLastName({ value: e })}
                      value={lastName.value}
                      placeholder="Apellidos"
                      right
                      iconContent={
                        <Icon
                          size={18}
                          style={{ marginTop: 2, marginRight: 5 }}
                          color={argonTheme.COLORS.ICON}
                          name="adduser"
                          family="AntDesign"
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      success={!!email.value}
                      error={!!email.error}
                      onChangeText={(e) => setEmail({ value: e })}
                      value={email.value}
                      placeholder="Dirección de correo electrónico"
                      right
                      iconContent={
                        <Icon
                          size={18}
                          style={{ marginTop: 2, marginRight: 5 }}
                          color={argonTheme.COLORS.ICON}
                          name="mail"
                          family="Entypo"
                        />
                      }
                    />
                  </Block>

                  <Block middle>
                    <Button
                      loading={loading}
                      onPress={submit}
                      color="primary"
                      style={styles.createButton}
                    >
                      ACTUALIZAR PERFIL
                    </Button>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  )
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    //marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  createButton: {
    width: width * 0.7,
    marginTop: 25,
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

export default ProfileUpdate
