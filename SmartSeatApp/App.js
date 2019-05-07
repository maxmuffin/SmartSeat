import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './pages/HomeScreen';
import SettingsScreen from './pages/SettingsScreen';
import GraphScreen from './pages/GraphScreen';

const App  = createMaterialBottomTabNavigator(
    {
        Home: { screen: HomeScreen,
            navigationOptions:{
                tabBarLabel:'Home',
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <Icon style={[{color: tintColor}]} size={25} name={'ios-home'}/>
                    </View>),
            }
        },
        Graph: { screen: GraphScreen,
            navigationOptions:{
                tabBarLabel:'Graph',
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <Icon style={[{color: tintColor}]} size={25} name={'ios-stats'}/>
                    </View>),
                activeColor: '#f60c0d',
                inactiveColor: '#f65a22',
                barStyle: { backgroundColor: '#f69b31' },
            }
        },
        Settings: { screen: SettingsScreen,
            navigationOptions:{
                tabBarLabel:'Settings',
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <Icon style={[{color: tintColor}]} size={25} name={'ios-cog'}/>
                    </View>),
                activeColor: '#615af6',
                inactiveColor: '#46f6d7',
                barStyle: { backgroundColor: '#67baf6' },
            }
        },
    },
    {
      initialRouteName: "Home",
      activeColor: '#f0edf6',
      inactiveColor: '#226557',
      barStyle: { backgroundColor: '#3BAD87' },
    },
);

export default createAppContainer(App);
