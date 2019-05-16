import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    try {
      const userToken = await AsyncStorage.getItem('id_token');
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    } catch(e) {
      console.log(e);
    }

  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
