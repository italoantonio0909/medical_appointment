import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform,
  Text,
} from 'react-native'
import { Block, theme } from 'galio-framework'
import { Search, DropdownPicker } from '../../components'
import { Images } from '../../constants'
import { HeaderHeight } from '../../constants/utils'
import UserList from './User-List'
import { userListService } from '../../services/admin'
import { userAvatarUri } from '../../services/authentication'
import { useDispatch, useSelector } from 'react-redux'
import { USERS_FILTER, USERS_LIST } from '../../state/actions'

const { width, height } = Dimensions.get('screen')

const thumbMeasure = (width - 48 - 32) / 3
const User = ({ navigation }) => {
  /*State*/
  const dispatch = useDispatch()
  const usersFilter = useSelector((state) => state.usersFilter)

  const users = useSelector((state) => {
    if (usersFilter.length > 0) {
      return usersFilter
    }
    return state.users
  })

  /*Component initial*/
  useEffect(() => {
    let mounted = true
    if (mounted) {
      getDataUsers()
    }
    return () => (mounted = false)
  }, [dispatch])

  /*Get users*/
  const getDataUsers = () => {
    userListService().then((response) => {
      dispatch({
        type: USERS_LIST,
        payload: response,
      })
    })
  }

  /*Filter user*/
  const filterUsers = (e) => {
    dispatch({
      type: USERS_FILTER,
      payload: e,
      filter: 'email',
    })
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
            style={{ width, marginTop: '25%' }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle>
                <Text size={17} color="#8898AA">
                  Panel de usuarios
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block middle>
                <Search
                  onChangeText={(e) => filterUsers(e)}
                  placeholder="Correo electrónico"
                />
              </Block>
              <Block flex>
                {!!users &&
                  users.map((user) => (
                    <UserList
                      key={user.id}
                      username={user.first_name + user.last_name}
                      email={user.email}
                      avatar={userAvatarUri(user.avatar)}
                    />
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
    width: width * 0.7,
    marginTop: 25,
  },
  container: {
    height: 90,
  },
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    //marginBottom: -HeaderHeight * 2,
    flex: 1,
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

export default User
