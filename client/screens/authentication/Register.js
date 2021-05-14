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
import { userRegister } from '../../services/authentication'

import { emptyField } from '../../utils/validators'

const { width, height } = Dimensions.get('screen')

const Register = ({ navigation }) => {
  /*State and form inputs with errors*/
  const [password, setPassword] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [firstName, setFirstName] = useState({ value: '', error: '' })
  const [lastName, setLastName] = useState({ value: '', error: '' })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hidePassword, setHidePassword] = useState(true)

  /*Submit form signup*/
  const submit = async () => {
    setLoading(true)
    const firstNameError = emptyField(firstName.value)
    const lastNameError = emptyField(lastName.value)
    const passwordError = emptyField(password.value)
    const emailError = emptyField(email.value)
    if (firstNameError || lastNameError || passwordError || emailError) {
      setFirstName({ ...firstName, error: firstNameError })
      setLastName({ ...lastName, error: lastNameError })
      setPassword({ ...password, error: passwordError })
      setEmail({ ...email, error: emailError })
      setLoading(false)
      return
    }
    const registerForm = {
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
    }
    try {
      await userRegister(registerForm)
      navigation.navigate('Login')
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
                <Text color="#8898AA" size={17}>
                  Crear una cuenta
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
                      value={firstName.value}
                      error={!!firstName.error}
                      success={!!firstName.value}
                      onChangeText={(e) => {
                        setFirstName({ value: e })
                        setError('')
                      }}
                      placeholder="Nombres"
                      right
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="creative-commons-attribution"
                          family="Entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      value={lastName.value}
                      error={!!lastName.error}
                      success={!!lastName.value}
                      onChangeText={(e) => {
                        setLastName({ value: e })
                        setError('')
                      }}
                      placeholder="Apellidos"
                      right
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="add-user"
                          family="Entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      success={!!email.value}
                      value={email.value}
                      error={!!email.error}
                      onChangeText={(e) => {
                        setEmail({ value: e })
                        setError('')
                      }}
                      right
                      placeholder="Dirección de correo electrónico"
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="mail"
                          family="Entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      secureTextEntry={!!hidePassword}
                      success={!!password.value}
                      value={password.value}
                      error={!!password.error}
                      onChangeText={(e) => {
                        setPassword({ value: e })
                        setError('')
                      }}
                      right
                      placeholder="Contraseña"
                      iconContent={
                        <Icon
                          onPress={() => setHidePassword(!hidePassword)}
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name={hidePassword ? 'eye-with-line' : 'eye'}
                          family="Entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block row style={styles.passwordCheck}>
                    <Text on size={12} color={argonTheme.COLORS.MUTED}>
                      Ya tengo una cuenta:
                    </Text>
                    <Text
                      onPress={() => navigation.navigate('Login')}
                      bold
                      size={12}
                      color={argonTheme.COLORS.SUCCESS}
                    >
                      {' Iniciar sesión'}
                    </Text>
                  </Block>
                  <Block middle>
                    <Button
                      onPress={submit}
                      color="primary"
                      loading={loading}
                      style={styles.createButton}
                    >
                      CREAR UNA CUENTA
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

export default Register
