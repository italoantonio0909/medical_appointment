import React from 'react'
import { Dimensions } from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// screens
import UserIndex from '../screens/user/User'
import Onboarding from '../screens/Onboarding'
// drawer
import CustomDrawerContent from './MenuUser'
import CustomDrawerContentAdmin from './MenuAdmin'

// header for screens
import { Header } from '../components'
import Register from '../screens/authentication/Register'
import Login from '../screens/authentication/Login'
import ResetPassword from '../screens/authentication/Reset-Password'
import ConfirmPassword from '../screens/authentication/Confirm-Password'
import Profile from '../screens/authentication/Profile'
import ProfileUpdate from '../screens/authentication/Profile-Update'
import changePassword from '../screens/authentication/Change-Password'
import Admin from '../screens/admin/Admin'
import User from '../screens/admin/User'
import Specialty from '../screens/admin/Specialty'
import NotificationAdmin from '../screens/admin/Notification-Admin'
import Appoinment from '../screens/admin/Appoinment'
import Mail from '../screens/admin/Mail'
import MailSended from '../screens/admin/Mail-Sended'
import AppointmentAssign from '../screens/admin/Appointment-Assign'
import MailSend from '../screens/admin/Mail-Send'
import Logout from '../screens/authentication/Logout'
import userIndex from '../screens/user/User'
import SpecialtyList from '../screens/admin/Specialty-List'
import AppointmentDeleted from '../screens/user/Appointment-Deleted'
import AppointmentCreate from '../screens/user/Appointment-Create'
import AppointmentNotification from '../screens/user/Appointment-Notification'

const { width } = Dimensions.get('screen')

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={UserIndex}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Inicio"
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
    </Stack.Navigator>
  )
}
/*
  Component navigation Onboarding is default

  Possible navigation
  -Login
*/
export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Login" component={LoginStack} />
    </Stack.Navigator>
  )
}
/*
  Component navigation Login

  Possible navigation
  -Register
  -ResetPassword
*/
function LoginStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Login"
        component={Login}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Register" component={RegisterStack} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordStack} />
      <Stack.Screen name="App" component={AppStack} />
      <Drawer.Screen name="Admin" component={AdminStack} />
    </Stack.Navigator>
  )
}

/*
  Component navigation Login

  Possible navigation
  -Register
  -ResetPassword
*/
function LogoutStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Logout"
        component={Logout}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Login" component={LoginStack} />
    </Stack.Navigator>
  )
}

/*
  Component navigation Register

  Possible navigation
  -Login
*/
function RegisterStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Register"
        component={Register}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Login" component={LoginStack} />
      <Stack.Screen name="App" component={AppStack} />
      <Drawer.Screen name="Admin" component={AdminStack} />
    </Stack.Navigator>
  )
}

/*
  Component navigation ResetPassword

  Possible navigation
  -ConfirmPassword
  
*/
function ResetPasswordStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="ConfirmPassword" component={ConfirmPasswordStack} />
    </Stack.Navigator>
  )
}

/*
  Component navigation ConfirmPassword

  Possible navigation
  
*/
function ConfirmPasswordStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="ConfirmPassword"
        component={ConfirmPassword}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Login" component={LoginStack} />
    </Stack.Navigator>
  )
}

/*
  Component navigation Profile

  Possible navigation
  -ProfileUpdate

*/
function ProfileStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Profile"
        component={Profile}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="ProfileUpdate" component={ProfileUpdateStack} />
    </Stack.Navigator>
  )
}

/*
  Component navigation ProfileUpdate

  Possible navigation
  -App

*/
function ProfileUpdateStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="ProfileUpdate"
        component={ProfileUpdate}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  )
}

/*
  Component navigation ChangePassword

  Possible navigation

*/
function ChangePasswordStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="ChangePassword"
        component={changePassword}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Index" component={AdminIndexStack} />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  )
}
/*
  Component navigation Appoinment deleted

*/
function AppoimentDeletedStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="AppointmentDeleted"
        component={AppointmentDeleted}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

/*
  Component navigation Appoinment create

*/
function AppoimentCreateStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="AppointmentCreate"
        component={AppointmentCreate}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Inicio"
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
    </Stack.Navigator>
  )
}

function AppointmentNotificationStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="AppointmentNotification"
        component={AppointmentNotification}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Inicio"
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
      <Stack.Screen name="User" component={UserStack} />
    </Stack.Navigator>
  )
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: 'white',
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: 'white',
        inactiveTintColor: '#000',
        activeBackgroundColor: 'transparent',
        itemStyle: {
          width: width * 0.75,
          backgroundColor: 'transparent',
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: 'normal',
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Home" component={HomeStack} />
      <Drawer.Screen name="Admin" component={AdminStack} />
      <Drawer.Screen name="Login" component={LoginStack} />
      <Drawer.Screen name="Register" component={RegisterStack} />
      <Drawer.Screen name="ResetPassword" component={ResetPasswordStack} />
      <Drawer.Screen name="ConfirmPassword" component={ConfirmPasswordStack} />
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="ProfileUpdate" component={ProfileUpdateStack} />
      <Drawer.Screen name="ChangePassword" component={ChangePasswordStack} />
      <Drawer.Screen name="Logout" component={LogoutStack} />
      <Drawer.Screen
        name="AppointmentDeleted"
        component={AppoimentDeletedStack}
      />
      <Drawer.Screen
        name="AppointmentCreate"
        component={AppoimentCreateStack}
      />
      <Drawer.Screen
        name="AppointmentNotification"
        component={AppointmentNotificationStack}
      />
    </Drawer.Navigator>
  )
}

/*Admin stack*/

function AdminIndexStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Index"
        component={Admin}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Administración"
              search
              optionsAdmin
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
    </Stack.Navigator>
  )
}

function AdminStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContentAdmin {...props} />}
      drawerStyle={{
        backgroundColor: 'white',
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: 'white',
        inactiveTintColor: '#000',
        activeBackgroundColor: 'transparent',
        itemStyle: {
          width: width * 0.75,
          backgroundColor: 'transparent',
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: 'normal',
        },
      }}
      initialRouteName="Index"
    >
      <Drawer.Screen name="Index" component={AdminIndexStack} />
      <Drawer.Screen name="User" component={UserStack} />
      <Drawer.Screen name="Appointment" component={AppoinmetStack} />
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="ChangePassword" component={ChangePasswordStack} />
      <Drawer.Screen name="Mail" component={MailStack} />
      <Drawer.Screen name="MailSend" component={MailSendStack} />
      <Drawer.Screen name="EmailSended" component={MailSendedStack} />
      <Drawer.Screen name="Logout" component={LogoutStack} />
      <Drawer.Screen name="Specialty" component={SpecialtyStack} />
      <Stack.Screen name="SpecialtyList" component={SpecialtyListStack} />
      <Drawer.Screen
        name="NotificationAdmin"
        component={NotificationAdminStack}
      />
      <Drawer.Screen name="AssignDate" component={AppointmentAssignStack} />
    </Drawer.Navigator>
  )
}

/*
  Component navigation AppointmentAssign

*/
function AppointmentAssignStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="AppointmentAssign"
        component={AppointmentAssign}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

/*
  Component navigation User

*/
function UserStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="User"
        component={User}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

/*
  Component navigation Notification

*/
function NotificationAdminStack(props) {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="NotificationAdmin"
        component={NotificationAdmin}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

/*
  Component navigation Notification

*/
function MailSendedStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="EmailSended"
        component={MailSended}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

/*
  Component navigation Mail

*/
function MailStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Mail"
        component={Mail}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

/*
  Component navigation Mail

*/
function MailSendStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="MailSend"
        component={MailSend}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

/*
  Component navigation Mail

*/
function SpecialtyStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Specialty"
        component={Specialty}
        option={{
          headerTransparent: true,
        }}
      />
      <Drawer.Screen name="SpecialtyList" component={SpecialtyListStack} />
    </Stack.Navigator>
  )
}

function SpecialtyListStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="SpecialtyList"
        component={SpecialtyList}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}

/*
  Component navigation Appoinment

*/
function AppoinmetStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Appointment"
        component={Appoinment}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  )
}
