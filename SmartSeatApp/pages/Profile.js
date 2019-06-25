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
              <TouchableHighlight onPress={() => this.userLogout}>
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
        password: '',
        email: '',
        name:'',
        height:'',
        weight:'',
        sex:'',
      }
      this.userLogout = this.userLogout.bind(this);
    }

  async userLogout() {
    try {
      console.log("user logout");
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('surname');
      await AsyncStorage.removeItem('height');
      await AsyncStorage.removeItem('weight');
      await AsyncStorage.removeItem('sex');

      this.alertSuccess('Logout Success!');
      this.props.navigation.navigate('Logout');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  async getUserInformation(){
    try {
      this.state.username = await AsyncStorage.getItem('username');
      this.state.email = await AsyncStorage.getItem('email');
      this.state.name = await AsyncStorage.getItem('name');
      this.state.surname = await AsyncStorage.getItem('surname');
      this.state.height = await AsyncStorage.getItem('height');
      this.state.weight = await AsyncStorage.getItem('weight');
      this.state.sex = await AsyncStorage.getItem('sex');
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  componentDidMount() {
    (async () => {
          await this.getUserInformation();
      })();
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
    (async () => {
          await this.getUserInformation();
          console.log(this.state.name);
      })();
    return (
      <Container style={styles.container}>
        <Content  contentContainerStyle={{ flexDirection:"column",justifyContent: 'center', flexGrow: 1}}>
      
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
