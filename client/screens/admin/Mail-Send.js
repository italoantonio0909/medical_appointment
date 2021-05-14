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
import { emptyField } from '../../utils/validators'
import { HeaderHeight } from '../../constants/utils'
import { userListService, emailCreateService } from '../../services/admin'
import { useDispatch, useSelector } from 'react-redux'
import UserList from './User-List'
import { argonTheme } from '../../constants'
import { userAvatarUri } from '../../services/authentication'
const { width, height } = Dimensions.get('screen')
const thumbMeasure = (width - 48 - 32) / 3

const MailSend = ({ navigation }) => {
  /*State*/
  const [notification, setNotification] = useState('')
  const [bodyText, setBodyText] = useState({ value: '', error: '' })
  const [subject, setSubject] = useState({ value: '', error: '' })
  const users = useSelector((state) => state.usersSendMail)
  const [loading, setLoading] = useState(false)

  const resetState = () => {
    setBodyText({ value: '' })
    setSubject({ value: '' })
  }

  /*Submit*/
  const submit = async () => {
    const bodyTextError = emptyField(bodyText.value)
    const subjectError = emptyField(subject.value)
    if (bodyTextError || subjectError) {
      setBodyText({ ...bodyText, error: bodyTextError })
      setSubject({ ...subject, error: subjectError })
      return
    }
    const userList = users.map((user) => user.id)
    const formEmail = {
      users: userList,
      subject: subject.value,
      body_text: bodyText.value,
    }
    try {
      setLoading(true)
      await emailCreateService(formEmail)
      setLoading(false)
      setNotification('Emails enviados')
      setTimeout(function () {
        navigation.navigate('Mail')
        setNotification('')
        resetState()
      }, 2000)
    } catch (error) {
      if (error.response) {
        setLoading(false)
        setNotification(error.response.data.errors[0].message)
      }
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
                  Panel de envío correos electrónicos
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <Input
                      value={subject.value}
                      onChangeText={(e) => setSubject({ value: e })}
                      success={!!subject.value}
                      error={!!subject.error}
                      placeholder="Intención del mensaje"
                    />
                    <Input
                      value={bodyText.value}
                      onChangeText={(e) => setBodyText({ value: e })}
                      success={!!bodyText.value}
                      error={!!bodyText.error}
                      placeholder="Cuerpo del mensaje"
                    />
                  </Block>
                </KeyboardAvoidingView>
                <Button
                  onPress={submit}
                  onlyIcon
                  loading={loading}
                  icon="paper-plane"
                  color="success"
                  iconFamily="Entypo"
                  iconSize={20}
                ></Button>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>

              <Block flex>
                <Block middle style={{ marginTop: 10, marginBottom: 25 }}>
                  <Text size={17} color="#8898AA">
                    Lista de emitentes:
                  </Text>
                </Block>
                {users &&
                  users.map((user) => (
                    <Block key={user.id}>
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
    width: width * 0.4,
    marginTop: 10,
    marginLeft: 20,
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

export default MailSend
