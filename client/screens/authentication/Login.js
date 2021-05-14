import React, { useState } from 'react'

import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  LogBox,
} from 'react-native'

import { Block, Text } from 'galio-framework'
import { Button, Icon, Input, Snackbar } from '../../components'
import { Images, argonTheme } from '../../constants'

import { userLogin, userSaveToken, userMe } from '../../services/authentication'
import { emptyField } from '../../utils/validators'

import { useDispatch } from 'react-redux'
import { USERS_PROFILE } from '../../state/actions'

const { width, height } = Dimensions.get('screen')

const Login = ({ navigation }) => {
  /*State and elements forms*/
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hidePassword, setHidePassword] = useState(true)
  const dispatch = useDispatch()

  /*Reset state*/
  const resetState = () => {
    setEmail({ value: '' })
    setPassword({ value: '' })
  }

  /*Login form submit*/
  const submit = async () => {
    /*Validate fields*/
    const emailError = emptyField(email.value)
    const passwordError = emptyField(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    setLoading(true)
    const loginForm = {
      email: email.value,
      password: password.value,
    }
    try {
      const response = await userLogin(loginForm)
      /*Received token user and save*/
      const tokenLogin = response.session
      await userSaveToken(tokenLogin)
      /*Data profile and dispatch state*/
      dispatch({
        type: USERS_PROFILE,
        payload: response.data,
      })
      /*Check is admin*/
      const isAdmin = response.data.is_superuser
      if (isAdmin === true) {
        setLoading(false)
        resetState()
        navigation.navigate('Admin')
      } else {
        setLoading(false)
        resetState()
        navigation.navigate('App')
      }
    } catch (error) {
      setLoading(false)
      setError('Credenciales no válidas')
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
          <Block style={styles.loginContainer}>
            <Block flex>
              <Block flex={0.17} middle>
                <Text size={17} color="#8898AA">
                  Inicio de sesión
                </Text>
              </Block>
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <Input
                      success={!!email.value}
                      error={!!email.error}
                      value={email.value}
                      onChangeText={(e) => setEmail({ value: e })}
                      placeholder="Correo electrónico"
                    />
                    <Input
                      success={!!password.value}
                      value={password.value}
                      error={!!password.error}
                      onChangeText={(e) => setPassword({ value: e })}
                      borderLess
                      secureTextEntry={!!hidePassword}
                      placeholder="Contraseña"
                      right
                      iconContent={
                        <Icon
                          onPress={() => setHidePassword(!hidePassword)}
                          size={20}
                          color={argonTheme.COLORS.ICON}
                          name={hidePassword ? 'eye-with-line' : 'eye'}
                          family="EnTypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>

                  <Block row style={styles.passwordCheck}>
                    <Text
                      onPress={() => navigation.navigate('ResetPassword')}
                      size={13}
                      color={argonTheme.COLORS.SUCCESS}
                    >
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </Block>
                  <Block middle>
                    <Button
                      onPress={submit}
                      loading={loading}
                      color="primary"
                      style={styles.createButton}
                    >
                      INICIAR SESIÓN
                    </Button>
                    <Block row style={styles.passwordCheck}>
                      <Text size={12} color={argonTheme.COLORS.MUTED}>
                        ¿No tienes una cuenta?
                      </Text>
                      <Text
                        onPress={() => navigation.navigate('Register')}
                        size={12}
                        color={argonTheme.COLORS.SUCCESS}
                      >
                        {' Crear una cuenta'}
                      </Text>
                    </Block>
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
  loginContainer: {
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
    marginTop: 20,
  },
})

export default Login
