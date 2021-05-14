import React from 'react'
import { withNavigation } from '@react-navigation/compat'
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native'
import { Button, Block, NavBar, Text, theme } from 'galio-framework'

import Icon from './Icon'
import Input from './Input'
import Tabs from './Tabs'
import argonTheme from '../constants/Theme'

const { height, width } = Dimensions.get('window')
const iPhoneX = () =>
  Platform.OS === 'ios' &&
  (height === 812 || width === 812 || height === 896 || width === 896)

const NotificationAdminButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('NotificationAdmin')}
  >
    <Icon
      family="ArgonExtra"
      size={20}
      name="bell"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
)
const NotificationButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]}>
    <Icon
      family="ArgonExtra"
      size={20}
      name="bell"
      onPress={() => navigation.navigate('AppointmentNotification')}
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
)

const EmailButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('Mail')}
  >
    <Icon
      family="antDesign"
      size={20}
      name="mail"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
)

const TrashButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('AppointmentDeleted')}
  >
    <Icon
      family="entypo"
      size={20}
      name="trash"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
)

const SearchButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]}>
    <Icon
      size={16}
      family="Galio"
      name="search-zoom-in"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
)

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props
    return back ? navigation.goBack() : navigation.openDrawer()
  }
  renderRight = () => {
    const { white, title, navigation } = this.props

    if (title === 'Title') {
      return [
        <BellButton key="chat-title" navigation={navigation} isWhite={white} />,
        <BasketButton
          key="basket-title"
          navigation={navigation}
          isWhite={white}
        />,
      ]
    }

    switch (title) {
      case 'Inicio':
        return [
          <TrashButton
            key="trash-home"
            navigation={navigation}
            isWhite={white}
          />,
          <NotificationButton
            key="chat-home"
            navigation={navigation}
            isWhite={white}
          />,
        ]

      case 'Administración':
        return [
          <EmailButton
            key="email-home"
            navigation={navigation}
            isWhite={white}
          />,
          <NotificationAdminButton
            key="notification-home"
            navigation={navigation}
            isWhite={white}
          />,
        ]
      default:
        break
    }
  }
  renderSearch = () => {
    const { navigation } = this.props
    return (
      <Input
        placeholder="Buscar citas por fecha"
        right
        color="black"
        style={styles.search}
        placeholderTextColor={'#8898AA'}
        iconContent={
          <Icon
            size={16}
            color={theme.COLORS.MUTED}
            name="search-zoom-in"
            family="ArgonExtra"
          />
        }
      />
    )
  }
  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props

    return (
      <Block row style={styles.options}>
        <Button shadowless style={[styles.tab, styles.divider]}>
          <Block row middle>
            <Icon
              name="pluscircleo"
              family="AntDesign"
              style={{ paddingRight: 8 }}
              color={argonTheme.COLORS.ICON}
            />
            <Text size={16} style={styles.tabTitle}>
              {optionLeft || 'Mis citas'}
            </Text>
          </Block>
        </Button>

        <Button shadowless style={styles.tab}>
          <Block row middle>
            <Icon
              size={16}
              name="calendar"
              family="AntDesign"
              style={{ paddingRight: 8 }}
              color={argonTheme.COLORS.ICON}
            />
            <Text size={16} style={styles.tabTitle}>
              {optionRight || 'Agendar cita'}
            </Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderOptionsAdmin = () => {
    const { navigation, optionLeft, optionRight } = this.props

    return (
      <Block row style={styles.options}>
        <Button shadowless style={[styles.tab, styles.divider]}>
          <Block row middle>
            <Icon
              name="pluscircleo"
              family="AntDesign"
              style={{ paddingRight: 8 }}
              color={argonTheme.COLORS.ICON}
            />
            <Text size={16} style={styles.tabTitle}>
              {optionLeft || 'Citas del día'}
            </Text>
          </Block>
        </Button>

        <Button
          //onPress={() => navigation.navigate('User')}
          shadowless
          style={styles.tab}
        >
          <Block row middle>
            <Icon
              size={16}
              name="calendar"
              family="AntDesign"
              style={{ paddingRight: 8 }}
              color={argonTheme.COLORS.ICON}
            />
            <Text size={16} style={styles.tabTitle}>
              {optionRight || 'Usuarios'}
            </Text>
          </Block>
        </Button>
      </Block>
    )
  }

  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props
    const defaultTab = tabs && tabs[0] && tabs[0].id

    if (!tabs) return null

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={(id) => navigation.setParams({ tabId: id })}
      />
    )
  }
  renderHeader = () => {
    const { search, options, optionsAdmin, tabs } = this.props
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? this.renderSearch() : null}
          {options ? this.renderOptions() : null}
          {tabs ? this.renderTabs() : null}
          {optionsAdmin ? this.renderOptionsAdmin() : null}
        </Block>
      )
    }
  }
  render() {
    const {
      back,
      title,
      white,
      transparent,
      bgColor,
      iconColor,
      titleColor,
      navigation,
      ...props
    } = this.props

    const noShadow = ['Profile'].includes(title)
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ]

    const navbarStyles = [
      styles.navbar,
      bgColor && { backgroundColor: bgColor },
    ]

    return (
      <Block style={headerStyles}>
        <NavBar
          back={false}
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          left={
            <Icon
              name={back ? 'chevron-left' : 'menu'}
              family="entypo"
              size={20}
              onPress={this.handleLeftPress}
              color={
                iconColor ||
                (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)
              }
              style={{ marginTop: 2 }}
            />
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor },
          ]}
          {...props}
        />
        {this.renderHeader()}
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER,
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: argonTheme.COLORS.HEADER,
  },
})

export default withNavigation(Header)
