import React, { useEffect, useState } from "react"
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Text,
} from "react-native"
import { Block, theme } from "galio-framework"
import { HeaderHeight } from "../../constants/utils"

const { width, height } = Dimensions.get("screen")

import { Button, Icon, Input } from "../../components"
import { Images, argonTheme } from "../../constants"
import { userAvatarUri, userLogout } from "../../services/authentication"
import { useSelector } from "react-redux"
const thumbMeasure = (width - 48 - 32) / 3

const Logout = ({ navigation }) => {
  /*Initial state*/
  const [avatar, setAvatar] = useState("")
  const [loading, setLoading] = useState(false)

  const userProfile = useSelector((state) => state.userProfile)
  /*State*/
  useEffect(() => {
    let mounted = true
    if (mounted) {
      getProfile()
    }
    return function () {
      mounted = false
    }
  }, [userProfile])

  /*Get profile*/
  const getProfile = () => {
    setAvatar(userAvatarUri(userProfile.avatar))
  }

  /*Submit*/
  const submit = async () => {
    setLoading(true)
    await userLogout()
    setLoading(false)
    navigation.navigate("Login")
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
            style={{ width, marginTop: "25%" }}
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
                  <Block middle>
                    <Button
                      style={styles.logoutButton}
                      onPress={submit}
                      color="success"
                      iconFamily="antDesign"
                      icon="checkcircle"
                      iconSize={20}
                      loading={loading}
                    >
                      CERRAR SESIÓN
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
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    //marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  logoutButton: {
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
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
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
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
})

export default Logout
