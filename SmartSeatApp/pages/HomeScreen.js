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

    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: "mySeat",
        headerRight: (
            <Icon size={30} style={styles.ProfileIcon} title="Profile" name={'ios-contact'} onPress={() => navigation.navigate('Profile')}/>
        ),
        headerTitleStyle:{
          fontWeight: 'bold',
          color: '#858585'
        }
      };
    };

    componentDidMount() {
    this.mounted = true;
    this.timer = setInterval(()=> this.getPosture(), 3000);
    }

    componentWillUnmount() {
      clearInterval(this.timer);
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
  };

  goToProfile = () =>{
    this.props.navigation.navigate('Profile');
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
  ProfileIcon:{
    padding:5,
    marginRight:10,
  },
});
