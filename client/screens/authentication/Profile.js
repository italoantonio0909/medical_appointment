import React, { useEffect, useState } from "react"
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
} from "react-native"
import { Block, Text, theme, Card } from "galio-framework"

import { Button } from "../../components"
import { Images, argonTheme } from "../../constants"
import { HeaderHeight } from "../../constants/utils"
import { userAvatarUri } from "../../services/authentication"
import { useSelector } from "react-redux"

const { width, height } = Dimensions.get("screen")

const thumbMeasure = (width - 48 - 32) / 3
const Profile = ({ navigation }) => {
  /*State*/
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState("")
  const userProfile = useSelector((state) => state.userProfile)

  /*Component initial*/
  useEffect(() => {
    let mounted = true
    if (mounted) {
      getProfile()
    }
    return function () {
      mounted = false
    }
  }, [userProfile])

  /*obtain data user*/
  const getProfile = async () => {
    const usernameProfile = userProfile.username
    const emailProfile = userProfile.email
    const avatarProfile = userAvatarUri(userProfile.avatar)
    setUsername(usernameProfile)
    setEmail(emailProfile)
    setAvatar(avatarProfile)
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
                <Block middle row space="evenly" style={{ paddingBottom: 24 }}>
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.SUCCESS }}
                  >
                    EN LÍNEA
                  </Button>
                </Block>
              </Block>
              <Block flex>
                <Card
                  flex
                  borderless
                  style={styles.card}
                  title={username}
                  caption={email}
                  avatar={avatar}
                  imageStyle={styles.cardImageRadius}
                  imageBlockStyle={{ padding: theme.SIZES.BASE / 2 }}
                  image={avatar}
                />
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={{ marginBottom: 16 }}>
                  <Button
                    onPress={() => navigation.navigate("ProfileUpdate")}
                    color="primary"
                    style={styles.createButton}
                  >
                    ACTUALIZAR PERFIL
                  </Button>
                </Block>
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

export default Profile
