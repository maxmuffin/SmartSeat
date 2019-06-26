import React from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit';
import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Icon } from 'native-base';

export default class GraphScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Health Data",
      headerRight: (
          <Icon size={30} style={styles.ProfileIcon} title="Profile" name={'ios-contact'} onPress={() => navigation.navigate('Profile')}/>
      ),
      headerTitleStyle:{
        color: '#f69b31',
        fontWeight: 'bold',
      }
    };
  };
  render() {
    return (
      <Container style={styles.container}>
        <Content  contentContainerStyle={{ justifyContent: 'flex-start', flex: 1, alignItems: 'center'}}>
            <LineChart
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                datasets: [{
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100
                  ]
                }]
              }}
              width={Dimensions.get('window').width-32} // from react-native
              height={400}
              yAxisLabel={'$'}
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 32,
                borderRadius: 16,
                marginRight: 16,
                marginLeft: 16,
              }}
            />
        </Content>
      </Container>
    );
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
  container:{
    backgroundColor:'white',
  },
  signButton:{
    borderColor: '#67baf6',
    alignSelf: 'center',
    width: 200,
    padding: 8,
    justifyContent: 'center',
    marginTop: 10,
  },
  ProfileIcon:{
    padding:5,
    marginRight:10,
  },
  ProgressChart:{
    margin:20
  }
})
