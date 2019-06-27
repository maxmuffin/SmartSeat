import React from 'react';
import { View, TouchableOpacity, StyleSheet , Image, ImageBackground} from 'react-native';
import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Colors, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderButtons, { HeaderButton} from 'react-navigation-header-buttons';



export default class HomeScreen extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        username: '',
        imageId: 4,
        imageSource: [
                          {id:"noConnection",image:require('../images/noConnection.png')},
                          {id:"noSitting",image:require('../images/noSitting.png')},
                          {id:"correct",image:require('../images/correct.png')},
                          {id:"wrong",image:require('../images/wrong.png')},
                          {id:"logo",image:require('../images/smartSeat_logo.png')},


                      ],
        predictValue:''
      }
      this.goToProfile = this.goToProfile.bind(this);
    }
    componentDidMount() {
    this.mounted = true;
    this.timer = setInterval(()=> this.getPosture(), 3000);
    }


    async getPosture(){
       fetch('http://172.20.10.2:8000/predict_value', {method: "GET"})
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
            if (response.chairOn == "True") {
              this.state.imageId = responseData.prediction;
            }else{
              this.state.imageId = 0;
            }
           this.forceUpdate();
         })
      .catch((error) => {
        this.state.imageId = 0;
        this.forceUpdate();
      });

    }

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

    return (
      <Container style={styles.container}>
        <Content  contentContainerStyle={{ justifyContent: 'center', flex: 1, alignItems: 'center'}}>
          <Image
              style={{
                flex: 1,
                 alignSelf: 'stretch',
                 width: undefined,
                 height: undefined

              }}
              resizeMode="cover"
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
