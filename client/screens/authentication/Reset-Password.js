import React, { useState } from 'react'
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ClippingRectangle,
} from 'react-native'
import { Block, Text } from 'galio-framework'
import { userResetPassword } from '../../services/authentication'
import { emptyField } from '../../utils/validators'

import { Button, Icon, Input, Snackbar } from '../../components'
import { Images, argonTheme } from '../../constants'

const { width, height } = Dimensions.get('screen')

const ResetPassword = ({ navigation }) => {
  /*State and component forms*/
  const [email, setEmail] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState('')

  /*Send form and send mail*/
  const submit = async () => {
    setLoading(true)
    const emailError = emptyField(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      setLoading(false)
      return
    }
    const resetPasswordForm = {
      email: email.value,
    }
    try {
      await userResetPassword(resetPasswordForm)
      navigation.navigate('ConfirmPassword')
      setLoading(false)
      setEmail({ value: '' })
    } catch (error) {
      if (error.response) {
        setNotification('Cuenta no activa.')
        setLoading(false)
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
                  Reestablecer contraseña
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
                      onChangeText={(e) => {
                        setEmail({ value: e })
                        setNotification('')
                      }}
                      placeholder="Dirección de correo electrónico"
                      right
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="ic_mail_24px"
                          family="ArgonExtra"
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
                      ENVIAR EMAIL
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

export default ResetPassword
