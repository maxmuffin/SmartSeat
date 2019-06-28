import React from 'react';
import { View, TouchableOpacity, StyleSheet , Image, ImageBackground, Dimensions} from 'react-native';
import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Colors, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderButtons, { HeaderButton} from 'react-navigation-header-buttons';
import IpAddress from './auth/constant';


export default class HomeScreen extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        username: '',
        imageId: 3,
        imageSource: [
                      {id:"noSitting",image:require('../images/noSitting.png')},
                      {id:"correct",image:require('../images/correct.png')},
                      {id:"wrong",image:require('../images/wrong.png')},
                      {id:"logo",image:require('../images/smartSeat_logo.png')},
                      {id:"noConnection",image:require('../images/noConnection.png')}
                    ],
      }
      this.goToProfile = this.goToProfile.bind(this);
    }
    componentDidMount() {
    this.mounted = true;
    this.timer = setInterval(()=> this.getPosture(), 3000);
    }


    async getPosture(){
       fetch(IpAddress+'/predict_value', {method: "GET"})
        .then(
          (response) => {
            if(response.ok == true && response.status >= 200 && response.status < 300) {
              return response.json();
            } else {
              console.log("Server can't be reached!");
              this.state.imageId = 1;
            }
          },
        )
        .then((responseData) =>
        {
          console.log(responseData);
          if (responseData.chairOn === "True") {
            this.state.imageId = responseData.prediction;
          }else{
            this.state.imageId = 4;
          }
         this.forceUpdate();
       })
      .catch((error) => {
        this.state.imageId = 4;
        this.forceUpdate();
      });

    }

  /*  try {
          this.timeout = setInterval(async () => {
            fetch('http://192.168.43.136:8000/predictValue')
              .then((response) => response.json())
               .then((responseData) => {
                 console.log(responseData.prediction)
              }).done();
          }, 3000);
        } catch(e) {
          console.log(e);
        };*/

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  goToProfile = () =>{
    this.props.navigation.navigate('Profile');
  };



  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "mySeat",
      headerRight: (
          <Icon size={30} style={styles.ProfileIcon} title="Profile" name={'ios-contact'} onPress={() => navigation.navigate('Profile')}/>
      ),
      headerTitleStyle:{
        fontWeight: 'bold',
      }
    };
  };


  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <Container style={styles.container}>
        <Content  contentContainerStyle={{ justifyContent: 'center', flex: 1, alignItems: 'center'}}>
          <Image
              style={{
                flex: 1,
                 alignSelf: 'stretch',
                 width: width,
                 height: height
              }}
              resizeMode="contain"
              source={this.state.imageSource[this.state.imageId].image}
              />
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({

 tryButton:{
   backgroundColor: '#67baf6',
    borderColor: '#67baf6',
    alignSelf: 'center',
    width: 200,
    padding: 10,
    justifyContent: 'center',
    marginTop: 10,
  },

  ProfileIcon:{
    padding:5,
    marginRight:10,
  },
});
