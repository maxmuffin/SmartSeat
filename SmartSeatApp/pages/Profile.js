import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableHighlight
} from 'react-native';

import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Icon } from 'native-base';

export default class Profile extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Profile",
      headerRight: (
              <TouchableHighlight onPress={this.userLogout}>
               <Icon size={30} style={styles.Logout} title="Profile" name={'ios-log-out'}/>
       </TouchableHighlight>
      ),
      headerTitleStyle:{
        fontWeight: 'bold',
      }
    };
  };

  constructor(props) {
      super(props);
      this.state = {
        username: '',
      }
      this.userLogout = this.userLogout.bind(this);
    }

  async userLogout() {
    try {
      console.log("user logout");
      await AsyncStorage.removeItem('id_token');
      this.alertSuccess('Logout Success!');
      this.props.navigation.navigate('Logout');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  alertSuccess = (text) =>{
    Alert.alert(
         'SUCCESS',
         text,
         [
           {text: 'OK', onPress: () => console.log('OK Pressed'), style: "cancel"}
         ]
       );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content  contentContainerStyle={{ justifyContent: 'center', flex: 1, alignItems: 'center'}}>
            <Button primary
            style={styles.signButton}
            onPress = {this.userLogout}>
            <Text>Logout</Text>
            </Button>
        </Content>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
  input: {
    width: 250,
    height: 50,
    backgroundColor: '#67baf6',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  signButton:{
    borderColor: '#67baf6',
    alignSelf: 'center',
    width: 200,
    padding: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
  Logout:{
    padding:5,
    marginRight:10,
  },
})
