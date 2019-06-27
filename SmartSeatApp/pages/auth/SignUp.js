import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Picker
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
        mail: '',
        weight:'50',
        height: '150',
        sex:'male',
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
       && this.state.mail != "" && this.state.password!="" ) {
        if (this.state.mail.includes("@") && this.state.mail.includes(".")) {
          if (this.state.weight!= "" && this.state.sex!="" && this.state.height!="") {
             fetch('http://192.168.43.136:8000/signup', {
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
                mail: this.state.mail,
                weight: this.state.weight,
                height: this.state.height,
                sex: this.state.sex,
             })
              }).then((response) => response.json())
                .then((responseData) => {
                  console.log('response object:',responseData);
                  if (responseData.signed == "true") {
                    this.saveItem("username", this.state.username);
                    this.saveItem("name", this.state.name);
                    this.saveItem("surname", this.state.surname);
                    this.saveItem("mail", this.state.mail);
                    this.saveItem("height", this.state.height);
                    this.saveItem("weight", this.state.weight);
                    this.saveItem("sex", this.state.sex);
                    this.props.navigation.navigate('App');
                  }else {
                    this.alertError("Username already exists")
                  }
                 }).done();
             }else{
               this.alertError("Compile your personal info!");
          }
         }else{
           this.alertError("Wrong mail!");
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
    var arrHeight = [];
    var height= 150;
    for (var i = 0; i <= 40; i++) {
      arrHeight[i] = height.toString();
      height++;
    };

    var arrWeight = [];
    var weight= 50;
    for (var i = 0; i <= 50; i++) {
      arrWeight[i] = weight.toString();
      weight++;
    };
    return (
      <Container style={styles.container}>
        <Content  contentContainerStyle={{flex:1, justifyContent: 'center', alignItems: 'center', paddingVertical: 100}}>
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
            placeholder='Mail'
            autoCapitalize="none"
            placeholderTextColor='white'
            style={{ color: 'white' }}
            onChangeText={val => this.onChangeText('mail', val)}
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
          <Item style={{flexDirection:"row",flex:1}}>
          <Picker
            selectedValue={this.state.sex}
            style={{width: 100, height: 50}}
            itemStyle={{height:44}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({sex: itemValue})
            }>
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
          <Picker
            selectedValue={this.state.height}
            mode="dropdown"
            style={{width: 90, height: 50}}
            itemStyle={{height:44}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({height: itemValue})
            }>
            {arrHeight.map((itemValue, itemIndex) => {
                return (<Picker.Item label={itemValue+" cm"} value={itemValue} key={itemIndex}/>)
            })}
          </Picker>
          <Picker style={{flexDirection:"row"}}
            selectedValue={this.state.weight}
            mode="dropdown"
            style={{width: 90, height: 50}}
            itemStyle={{height:44}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({weight: itemValue})
            }>
            {arrWeight.map((itemValue, itemIndex) => {
                return (<Picker.Item label={itemValue+" kg"} value={itemValue} key={itemIndex}/>)
            })}
          </Picker>
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
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
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
    justifyContent: 'center',
    margin:0
  }
})
