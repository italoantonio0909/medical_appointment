import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform,
  Text,
  Alert,
} from 'react-native'
import { Block, theme, Card, Icon } from 'galio-framework'
import { Search } from '../../components'
import { Images } from '../../constants'
import { HeaderHeight } from '../../constants/utils'
import {
  specialtyListService,
  specialtyUpdateService,
} from '../../services/admin'
import { useDispatch, useSelector } from 'react-redux'
import {
  SPECIALTY_LIST,
  SPECIALTY_DELETE,
  SPECIALTY_FILTER,
} from '../../state/actions'

const { width, height } = Dimensions.get('screen')

const thumbMeasure = (width - 48 - 32) / 3
const SpecialtyList = ({ navigation }) => {
  const dispatch = useDispatch()

  //Check state filter is active
  const specialtiesFilter = useSelector((state) => state.specialtiesFilter)

  const specialties = useSelector((state) => {
    if (specialtiesFilter.length > 0) {
      return specialtiesFilter
    }
    return state.specialties
  })

  // Deactive specialty
  const specialtiesDelete = async (specialtyId) => {
    const data = {
      is_active: false,
    }
    await specialtyUpdateService(specialtyId, data)
    dispatch({
      type: SPECIALTY_DELETE,
      payload: specialtyId,
    })
    navigation.navigate('Specialty')
  }
  const filterSpecialties = (e) => {
    dispatch({
      type: SPECIALTY_FILTER,
      payload: e,
    })
  }
  const specialtiesDeleteAlert = async (specialtyId) => {
    try {
      Alert.alert(
        'Desea eliminar la especialidad?',
        'Al desactivarla los usuarios no podrán agendar citas con esta especialidad ?',
        [
          {
            text: 'Aceptar',
            onPress: () => specialtiesDelete(specialtyId),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ],
        { cancelable: false }
      )
    } catch (error) {}
  }
  /*Get specialties*/
  const specialtiesList = async () => {
    try {
      const response = await specialtyListService()
      dispatch({
        type: SPECIALTY_LIST,
        payload: response,
      })
    } catch (error) {}
  }
  /*Obtain initial data*/
  useEffect(() => {
    let mounted = true
    if (mounted) {
      specialtiesList()
    }
    return () => (mounted = false)
  }, [dispatch])

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
                  Panel de Especialidades.
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block middle>
                <Search
                  onChangeText={(e) => filterSpecialties(e)}
                  placeholder="Título de especialidad"
                />
              </Block>

              <Block flex>
                {specialties.length == 0 && (
                  <Card title="No tienes especialidades médicas asignadas aún." />
                )}
                {specialties &&
                  specialties.map((element) => (
                    <Card
                      key={element.id}
                      style={styles.container}
                      title={element.title}
                      location={
                        <Block row right>
                          <Block
                            row
                            middle
                            style={{ marginHorizontal: theme.SIZES.BASE }}
                          >
                            <Icon
                              onPress={() => specialtiesDeleteAlert(element.id)}
                              name="trash"
                              family="entypo"
                              color={theme.COLORS.MUTED}
                              size={30}
                            />
                          </Block>
                        </Block>
                      }
                      borderless
                      shadowColor={theme.COLORS.BLACK}
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
    marginBottom: 8,
    flex: 1,
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

export default SpecialtyList
