import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView, Switch,
} from 'react-native';
import { Avatar, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';

import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right} from 'native-base';

export default class Profile extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Profile",
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
        mail: '',
        name:'',
        height:'',
        weight:'',
        sex:'',
        avatar:'',
        disabled: false,
      }
      this.userLogout = this.userLogout.bind(this);

    }

  async userLogout() {
    try {
      console.log("user logout");
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('mail');
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

  componentDidMount() {
    AsyncStorage.multiGet(["username", "name","surname","mail", "height", "weight", "sex"]).then(response => {
            this.setState({username: response[0][1]})
            this.setState({name: response[1][1]})
            this.setState({surname: response[2][1]})
            this.setState({mail: response[3][1]})
            this.setState({height: response[4][1]})
            this.setState({weight: response[5][1]})
            this.setState({sex: response[6][1]}) // Key1
        })
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

    /*<Container style={styles.container}>
        <Content  contentContainerStyle={{ flexDirection:"column",justifyContent: 'center', flexGrow: 1}}>

            <Button primary
            style={styles.signButton}
            onPress = {this.userLogout}>
            <Text>Logout</Text>
            </Button>
        </Content>
      </Container>*/
      <ScrollView style={styles.scroll}>
        <View style={styles.userRow}>
          <View style={styles.userImage}>
            <Icon size={100} style={styles.ProfileIcon} title="Profile" name={'ios-contact'}/>
            <Text style={{fontSize: 35,  color: "black", marginLeft:15}}> {this.state.username} </Text>
          </View>
        </View>
        <View style={styles.userColumn}>
          <Item>
            <Input disabled placeholder={this.state.name} style={styles.infoBox}/>
            <Text style={{color:"grey"}}>Name</Text>
          </Item>
          <Item>

            <Input id="surnameBox" disabled placeholder={this.state.surname} style={styles.infoBox}/>
            <Text style={{color:"grey"}}>Surname</Text>
          </Item>
          <Item>

          <Input id="mailBox" disabled placeholder={this.state.mail} style={styles.infoBox}/>
            <Text style={{color:"grey"}}>Mail</Text>
          </Item>
          <Item>

            <Input id="weightBox" disabled placeholder={this.state.weight} style={styles.infoBox}/>
            <Text style={{color:"grey"}}>Weight (kg)</Text>
          </Item>
          <Item>

            <Input id="heightBox" disabled placeholder={this.state.height} style={styles.infoBox}/>
            <Text style={{color:"grey"}}>Height (cm)</Text>
          </Item>
          <Item>
            <Input id="sexBox" disabled placeholder={this.state.sex} style={styles.infoBox}/>
            <Text style={{color:"grey"}}>Gender</Text>
          </Item>
        </View>
        <View style={styles.Logout}>
          <TouchableOpacity onPress={this.userLogout}>
            <Text>Logout </Text>
            <View>
                 <Icon size={30} style={styles.Logout} title="Profile" name={'ios-log-out'}/>
            </View>
         </TouchableOpacity>
       </View>
      </ScrollView>


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
  editButton:{
    color: 'rgba(23,126,251,0.8)',
    marginRight: 15,
    fontSize:20,
  },
  Logout:{
    padding:5,
    fontSize:20,
    marginRight:10,
  },
 ProfileIcon:{
   padding:5,
   marginLeft:10,
 },
 scroll: {
   backgroundColor: 'white',
 },
 userRow: {
   alignItems: 'center',
   flexDirection: 'row',
   paddingBottom: 8,
   paddingLeft: 15,
   paddingRight: 15,
   paddingTop: 6,
 },
 userColumn: {
   justifyContent: 'space-between',
   alignItems: 'stretch',
   flexDirection: 'column',
   flex:1,
   paddingBottom: 8,
   paddingLeft: 15,
   paddingRight: 15,
   paddingTop: 6,
 },
 userImage: {
   marginRight: 12,
   flexDirection:"row",
   flex:1,
   alignItems: 'center',
 },
 infoBox:{
   alignItems: 'center',
   fontSize: 25,
   flex:1,
 },
 Logout:{
   flexDirection: 'row',
   flex:1,
   alignSelf: 'center',
     marginTop: 10,

 }
})
