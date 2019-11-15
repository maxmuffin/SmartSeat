import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './pages/HomeScreen';
import ProfileScreen from './pages/Profile';
import GraphScreen from './pages/GraphScreen';
import LoginScreen from './pages/auth/Authentication';
import SignUpScreen from './pages/auth/SignUp';
import AuthLoadingScreen from './pages/auth/AuthLoading';


const AuthStack = createStackNavigator(
  {
    Authentication: {screen: LoginScreen},
    SignUp: {screen: SignUpScreen},
  }
);


const GraphStack = createStackNavigator(
  {
    Graph: {screen: GraphScreen},
    Profile: {screen: ProfileScreen},
      Logout: {screen: AuthLoadingScreen},
  }
);

const mySeatStack = createStackNavigator(
  {
      Home: {screen:HomeScreen},
      Profile:{screen: ProfileScreen},
      Logout: {screen: AuthLoadingScreen},
  }
);


const AppStack  = createMaterialBottomTabNavigator(
    {
      Graph: { screen: GraphStack,
          navigationOptions:{
              tabBarLabel:'Health Data',
              tabBarIcon: ({ tintColor }) => (
                  <View>
                      <Icon style={[{color: tintColor}]} size={25} name={'ios-stats'}/>
                  </View>),
              activeColor: '#ffffff',
              inactiveColor: '#6cc3c0',
              barStyle: { backgroundColor: '#787878' },
          }
      },
      mySeat: { screen: mySeatStack,
          navigationOptions:{
              tabBarLabel:'mySeat',
              tabBarIcon: ({ tintColor }) => (
                  <View>
                      <Icon style={[{color: tintColor}]} size={25} name={'ios-body'}/>
                  </View>),
              activeColor: '#ffffff',
              inactiveColor: '#787878',
              barStyle: { backgroundColor: '#6cc3c0' },
          }
      },
    },
    {
      initialRouteName: "mySeat",
      activeColor: '#f0edf6',
      inactiveColor: '#226557',
      barStyle: { backgroundColor: '#3BAD87' },
    },
);

export default createAppContainer(createSwitchNavigator(
  {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
