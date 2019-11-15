import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Image
} from 'react-native';

import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Icon } from 'native-base';
import IpAddress from './constant';

export default class Login extends React.Component {
  /*static navigationOptions = {
    title: 'Enter in Smart Seat',
  };*/

  constructor(props) {
      super(props);
      this.state = {
        username: '',
        password: ''
      }
      this.onChangeText = this.onChangeText.bind(this);
      this.doLogin = this.doLogin.bind(this);
    }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  alertError = (text) =>{
    Alert.alert(
         'ERROR',
         text,
         [
           {text: 'cancel', onPress: () => console.log('OK Pressed'), style: "cancel"}
         ]
       );
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  doLogin() {
    if (this.state.username != "" && this.state.password != "") {
           fetch(IpAddress+'/login', {
           method: 'POST',
           headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password
           })
            }).then((response) => response.json())
              .then((responseData) => {
                console.log('response object:',responseData.logged);
                if (responseData.logged == "true") {
                  console.log('response logged:',responseData.logged);
                  this.saveItem("username", responseData.username);
                  this.saveItem("name", responseData.name);
                  this.saveItem("surname", responseData.surname);
                  this.saveItem("mail", responseData.mail);
                  this.saveItem("height",responseData.height);
                  this.saveItem("weight", responseData.weight);
                  this.saveItem("sex", responseData.sex);
                  console.log(responseData);
                  this.props.navigation.navigate('App');
                }else {
                  this.alertError("Username or Password are incorrect or null!")
                }
            })
            .catch((error) => {
              this.alertError("Server unavailable")
            })
            .done();
       } else {
        this.alertError("Empty fields!");
       }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content  contentContainerStyle={{ justifyContent: 'center', flex: 1, alignItems: 'center'}}>
        <View style={{paddingBottom: 25}}>
        <Image
          style={{width: 300, height: 117}}
          source={require('../../images/smartSeat_welcome.png')}
        />
        </View>

          <Item rounded style={styles.input}>
          <Input
            placeholder='Username'
            autoCapitalize="none"
            placeholderTextColor='#6fd3d0'
            style={{ color: '#787878' }}
            onChangeText={val => this.onChangeText('username', val)}
          />
          </Item>
          <Item rounded style={styles.input}>
          <Input
            placeholder='Password'
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor='#6fd3d0'
            style={{ color: '#787878' }}
            onChangeText={val => this.onChangeText('password', val)}
          />
          </Item>
          <View style={{paddingBottom: 15}} />
          <Button primary
          style={styles.signButton}
          onPress = {this.doLogin}>
          <Text>Login</Text>
          </Button>
          <Button primary
          style={styles.signButton}
          onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text>Sign Up</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    width: 280,
    height: 50,
    backgroundColor: '#f7f7f7',
    margin: 10,
    padding: 8,
    color: '#787878',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  signButton:{
    borderColor: '#787878',
    backgroundColor: '#6cc3c0',
    alignSelf: 'center',
    width: 200,
    padding: 8,
    justifyContent: 'center',
    marginTop: 10,
  }
})
