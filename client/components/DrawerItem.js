import React from 'react'
import { StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { Block, Text, theme } from 'galio-framework'

import Icon from './Icon'
import argonTheme from '../constants/Theme'

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props

    switch (title) {
      case 'Home':
        return (
          <Icon
            name="shop"
            family="ArgonExtra"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.PRIMARY}
          />
        )
      case 'Index':
        return (
          <Icon
            name="shop"
            family="ArgonExtra"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.INFO}
          />
        )

      case 'Profile':
        return (
          <Icon
            name="camera"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.INFO}
          />
        )
      case 'User':
        return (
          <Icon
            name="users"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.INFO}
          />
        )
      case 'AppointmentCreate':
        return (
          <Icon
            name="calendar"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.INFO}
          />
        )
      case 'User':
        return (
          <Icon
            name="folder"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.INFO}
          />
        )
      case 'Account':
        return (
          <Icon
            name="calendar-date"
            family="ArgonExtra"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.SUCCESS}
          />
        )
      case 'Specialty':
        return (
          <Icon
            name="briefcase"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.SUCCESS}
          />
        )
      case 'AssignDate':
        return (
          <Icon
            name="calendar"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.SUCCESS}
          />
        )
      case 'EmailSended':
        return (
          <Icon
            name="mail"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.SUCCESS}
          />
        )
      case 'Logout':
        return (
          <Icon
            name="arrow-left"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.INFO}
          />
        )
      case 'ChangePassword':
        return (
          <Icon
            name="lock"
            family="Entypo"
            size={14}
            color={focused ? 'white' : argonTheme.COLORS.INFO}
          />
        )

      default:
        return null
    }
  }

  render() {
    const { focused, title, navigation } = this.props

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null,
    ]

    return (
      <TouchableOpacity
        style={{ height: 60 }}
        onPress={() => navigation.navigate(title)}
      >
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={15}
              bold={focused ? true : false}
              color={focused ? 'white' : 'rgba(0,0,0,0.5)'}
            >
              {title === 'Home' && 'Citas médicas asignadas'}
              {title === 'Index' && 'Inicio'}
              {title === 'Profile' && 'Perfil'}
              {title === 'EmailSended' && 'Correos electrónicos'}
              {title === 'Logout' && 'Cerrar sesión'}
              {title === 'ChangePassword' && 'Cambiar contraseña'}
              {title === 'AssignDate' && 'Días no disponibles'}
              {title === 'Specialty' && 'Specialidad'}
              {title === 'User' && 'Usuarios'}
              {title === 'AppointmentCreate' && 'Agendar citas médicas'}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
  },
})

export default DrawerItem
