import React, { useState } from 'react'

import { useSelector } from 'react-redux'
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  LogBox,
} from 'react-native'
import { Block, Text } from 'galio-framework'
import { userPasswordChange } from '../../services/authentication'

import { Button, Icon, Input, Snackbar } from '../../components'
import { Images, argonTheme } from '../../constants'
import { emptyField } from '../../utils/validators'

const { width, height } = Dimensions.get('screen')

const ChangePassword = ({ navigation }) => {
  /*State fields and errors*/
  const [oldPassword, setOldPassword] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hidePassword, setHidePassword] = useState(true)
  const userProfileSelector = useSelector((state) => state.userProfile)

  /*Submit form*/
  const submit = async () => {
    setLoading(true)
    const oldPassworError = emptyField(oldPassword.value)
    const passwordError = emptyField(password.value)
    if (oldPassworError || passwordError) {
      setOldPassword({ ...oldPassword, error: oldPassworError })
      setPassword({ ...password, error: passwordError })
      setLoading(false)
      return
    }
    const ChangePasswordForm = {
      old_password: oldPassword.value,
      password: password.value,
    }

    try {
      const user_id = userProfileSelector.id
      await userPasswordChange(user_id, ChangePasswordForm)
      setOldPassword({ ...oldPassword, value: '' })
      setPassword({ ...password, value: '' })
      setLoading(false)
      setError('Contraseña actualizada, debes iniciar sesión.')
      setTimeout(function () {
        navigation.navigate('Login')
      }, 3000)
    } catch (error) {
      if (error.response) {
        setLoading(false)
        setError(error.response.data.errors[0].message)
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
      <StatusBar hidden />
      <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <Block flex middle>
          <Block style={styles.registerContainer}>
            <Block flex>
              <Block flex={0.17} middle>
                <Text color="#8898AA" size={18}>
                  Cambiar contraseña
                </Text>
              </Block>
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8}>
                    <Input
                      value={oldPassword.value}
                      error={!!oldPassword.error}
                      success={!!oldPassword.value}
                      onChangeText={(e) => setOldPassword({ value: e })}
                      placeholder="Contraseña anterior"
                      right
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="lock"
                          family="entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      value={password.value}
                      error={!!password.error}
                      success={!!password.value}
                      onChangeText={(e) => setPassword({ value: e })}
                      placeholder="Contraseña nueva"
                      secureTextEntry={!!hidePassword}
                      right
                      iconContent={
                        <Icon
                          onPress={() => setHidePassword(!hidePassword)}
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name={hidePassword ? 'eye-with-line' : 'eye'}
                          family="entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block middle>
                    <Button
                      onPress={submit}
                      color="primary"
                      loading={loading}
                      style={styles.createButton}
                    >
                      CAMBIAR CONTRASEÑA
                    </Button>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  )
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: '#F4F5F7',
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden',
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#8898AA',
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.7,
    marginTop: 25,
  },
})

export default ChangePassword
