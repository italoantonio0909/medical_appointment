import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native'
import { Block, Text } from 'galio-framework'
import { userConfirmPassword } from '../../services/authentication'
import { emptyField } from '../../utils/validators'

import { Button, Icon, Input, Snackbar } from '../../components'
import { Images, argonTheme } from '../../constants'

const { width, height } = Dimensions.get('screen')

const ConfirmPassword = ({ navigation }) => {
  /*State and form inputs*/
  const [token, setToken] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState('')

  /*Reset state*/
  const resetState = () => {
    setToken({ value: '' })
    setPassword({ value: '' })
  }

  /*Send form */
  const submit = async () => {
    setLoading(true)
    const tokenError = emptyField(token.value)
    const passwordError = emptyField(password.value)
    if (tokenError || passwordError) {
      setToken({ ...token, error: tokenError })
      setPassword({ ...password, error: passwordError })
      setLoading(false)
      return
    }
    const confirmPasswordForm = {
      password: password.value,
    }
    const tokenValue = token.value
    const tokenWithoutSpace = tokenValue.split(' ').join('')
    try {
      await userConfirmPassword(tokenWithoutSpace, confirmPasswordForm)
      setNotification('Contraseña reestablecida.')
      setLoading(false)
      resetState()
      setTimeout(function () {
        navigation.navigate('Login')
      }, 2000)
    } catch (error) {
      if (error.response) {
        setLoading(false)
        setNotification(error.response.data.errors[0].message)
      }
    }
  }
  return (
    <Block flex middle>
      {!!notification && (
        <Snackbar
          actionHandler={() => {
            setNotification('')
          }}
          actionText="Entendido"
          textMessage={notification}
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
                  Confirmar contraseña
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
                      success={!!token.value}
                      error={!!token.error}
                      value={token.value}
                      onChangeText={(e) => {
                        setToken({ value: e })
                        setNotification('')
                      }}
                      placeholder="Código de verificación"
                      right
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="popup"
                          family="Entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                    <Input
                      value={password.value}
                      error={!!password.error}
                      success={!!password.value}
                      onChangeText={(e) => {
                        setPassword({ value: e })
                        setNotification('')
                      }}
                      placeholder="Contraseña nueva"
                      right
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="new-message"
                          family="Entypo"
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
                      REESTABLECER CONTRASEÑA
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

export default ConfirmPassword
