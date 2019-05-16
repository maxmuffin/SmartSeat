import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';

import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Icon, } from 'native-base';

export default class SignUp extends React.Component {
  static navigationOptions = {
    title: 'SignUp',
  };
  constructor(props) {
      super(props);
      this.state = {
        name: '',
        surname: '',
        username: '',
        password: '',
        email: ''
      }
      this.onChangeText = this.onChangeText.bind(this);
      this.doSignUp = this.doSignUp.bind(this);
    }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  alertError =(text)=>{
    Alert.alert(
         'ERROR',
         text,
         [
           {text: 'cancel', onPress: () => console.log('OK Pressed')}
         ]
       );
  }

  doSignUp() {
    if (this.state.name != "" && this.state.surname != "" && this.state.username != ""
       && this.state.email != "" && this.state.password!="") {
        if (this.state.email.includes("@") && this.state.email.includes(".")) {
           fetch('http://0.0.0.0:8000/signup', {
           method: 'POST',
           headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
            body: JSON.stringify({
              name: this.state.name,
              surname: this.state.surname,
              username: this.state.username,
              password: this.state.password,
              email: this.state.email
           })
            }).then((response) => response.json())
              .then((responseData) => {
                console.log('response object:',responseData);
                if (responseData.signed == "true") {
                  this.saveItem("id_token", this.state.username);
                  this.props.navigation.navigate('App');
                }else {
                  this.alertError("Username already exists")
                }
               }).done();
         }else{
           this.alertError("Wrong email!");
         }
       } else {
        this.alertError("Fields are wrong or incomplete");
       }
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content  contentContainerStyle={{ justifyContent: 'center', flex: 1, alignItems: 'center'}}>
          <Item rounded style={styles.input}>
            <Input
            placeholder='Name'
            autoCapitalize="none"
            placeholderTextColor='white'
            style={{ color: 'white' }}
            onChangeText={val => this.onChangeText('name', val)}/>
          </Item>
          <Item rounded style={styles.input}>
          <Input
            placeholder='Surname'
            autoCapitalize="none"
            placeholderTextColor='white'
            style={{ color: 'white' }}
            onChangeText={val => this.onChangeText('surname', val)}
          />
          </Item>
          <Item rounded style={styles.input}>
          <Input
            placeholder='Email'
            autoCapitalize="none"
            placeholderTextColor='white'
            style={{ color: 'white' }}
            onChangeText={val => this.onChangeText('email', val)}
          />
          </Item>
          <Item rounded style={styles.input}>
          <Input
            placeholder='Username'
            autoCapitalize="none"
            placeholderTextColor='white'
            style={{ color: 'white' }}
            onChangeText={val => this.onChangeText('username', val)}
          />
          </Item>
          <Item rounded style={styles.input}>
          <Input
            placeholder='Password'
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor='white'
            style={{ color: 'white' }}
            onChangeText={val => this.onChangeText('password', val)}
          />
          </Item>
          <Button primary
          style={styles.signUpButton}
          onPress = {this.doSignUp}>
          <Text>Sign Up</Text>
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
  signUpButton:{
    borderColor: '#67baf6',
    alignSelf: 'center',
    width: 200,
    padding: 8,
    justifyContent: 'center',
    marginTop: 10,
  }
})
