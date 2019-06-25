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
        predictValue:'',
      }
      this.goToProfile = this.goToProfile.bind(this);
    }
    componentDidMount() {
    this.mounted = true;
    this.timer = setInterval(()=> this.getPosture(), 3000);
    }

    async getPosture(){

       fetch('http://192.168.43.136:8000/predict_value', {method: "GET"})
        .then((response) => response.json())
        .then((responseData) =>
        {
          //set your data here

           this.state.predictValue = responseData.prediction;
           console.log(this.state.predictValue);
           this.forceUpdate();
        })
        .catch((error) => {
            console.error(error);
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
            <Text style={{ marginTop: 50, fontSize: 20,  color: "black"}}> {this.state.predictValue} </Text>
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
