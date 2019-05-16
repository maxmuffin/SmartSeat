import React from 'react';
import { View, TouchableOpacity, StyleSheet , Image} from 'react-native';
import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Colors, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderButtons, { HeaderButton} from 'react-navigation-header-buttons';



export default class HomeScreen extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        username: '',
        imageId: 0,
        imageSource: [
                          {id:"Great!",image:require('../images/postures/1.png'), text: "Correct posture !", color: "green"},
                          {id:"Assume the correct posture",image:require('../images/postures/2.png'), text: "Wrong Posture detected !", color: "red"},
                          {id:"Assume the correct posture",image:require('../images/postures/3.png'), text: "Wrong Posture detected !", color: "red"},
                          {id:"Assume the correct posture",image:require('../images/postures/4.png'), text: "Wrong Posture detected !", color: "red"},
                          {id:"Assume the correct posture",image:require('../images/postures/5.png'), text: "Wrong Posture detected !", color: "red"},
                          {id:"Assume the correct posture",image:require('../images/postures/6.png'), text: "Wrong Posture detected !", color: "red"},
                          {id:"Assume the correct posture",image:require('../images/postures/7.png'), text: "Wrong Posture detected !", color: "red"},
                          {id:"Assume the correct posture",image:require('../images/postures/8.png'), text: "Wrong Posture detected !", color: "red"},
                        ],
      }
      this.goToProfile = this.goToProfile.bind(this);
    }
    componentDidMount() {
    this.timeout = setInterval(() => {
      let currentId = this.state.imageId;
      console.log(currentId);
      if (currentId == 7) {
        this.setState({ imageId: 0});
      }else{
        this.setState({ imageId: currentId + 1});
      };
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
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
          <Text style={{ marginTop: 30, fontSize: 30, color: this.state.imageSource[this.state.imageId].color }}> {this.state.imageSource[this.state.imageId].text}</Text>
            <Image
              style={{
                alignSelf: 'center',
                height: 300,
                width: 250,
              }}
              resizeMode="stretch"
              source={this.state.imageSource[this.state.imageId].image}
              />
            <Text style={{ marginTop: 50, fontSize: 20,  }}> {this.state.imageSource[this.state.imageId].id}</Text>
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
