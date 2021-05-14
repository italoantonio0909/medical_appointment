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
import { emptyField } from '../../utils/validators'
import { specialtyCreateService } from '../../services/admin'

const { width, height } = Dimensions.get('screen')

const Specialty = ({ navigation }) => {
  const [title, setTitle] = useState({ value: '', error: '' })
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState('')

  const submit = async () => {
    setLoading(true)
    const titleError = emptyField(title.value)
    if (titleError) {
      setLoading(false)
      setTitle({ error: titleError })
      return
    }
    const specialtyCreateForm = {
      title: title.value,
    }

    try {
      await specialtyCreateService(specialtyCreateForm)
      setNotification('Especialidad agregada.')
      setLoading(false)
      setTitle({ value: '' })
    } catch (error) {
      setLoading(false)
      if (error.response) {
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
                  Módulo de Especialidad.
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
                      value={title.value}
                      error={!!title.error}
                      success={!!title.value}
                      onChangeText={(e) => setTitle({ value: e })}
                      placeholder="Título de especialidad"
                      right
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="folder"
                          family="entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Button
                    onPress={submit}
                    color="primary"
                    loading={loading}
                    style={styles.createButton}
                  >
                    AGREGAR
                  </Button>
                  <Button
                    small
                    onPress={() => navigation.navigate('SpecialtyList')}
                    style={{ backgroundColor: argonTheme.COLORS.SUCCESS }}
                  >
                    Listado
                  </Button>
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
    marginTop: 24,
  },
})

export default Specialty
