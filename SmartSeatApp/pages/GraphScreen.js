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
        <Content  contentContainerStyle={{ justifyContent: 'center', flex: 1, alignItems: 'center'}}>
          <Text style={ {fontSize: 25}}> Your daily postures</Text>

        <ProgressChart
                style= {styles.ProgressChart}
                data={data}
                width={screenWidth}
                height={250}
                chartConfig={chartConfig}
            />
          <ContributionGraph
            values={commitsData}
            endDate={new Date('2017-04-01')}
            numDays={105}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
          />
        </Content>
      </Container>
    );
  }
}
const commitsData = [
  { date: '2017-01-02', count: 1 },
  { date: '2017-01-03', count: 2 },
  { date: '2017-01-04', count: 3 },
  { date: '2017-01-05', count: 4 },
  { date: '2017-01-06', count: 5 },
  { date: '2017-01-30', count: 2 },
  { date: '2017-01-31', count: 3 },
  { date: '2017-03-01', count: 2 },
  { date: '2017-04-02', count: 4 },
  { date: '2017-03-05', count: 2 },
  { date: '2017-02-30', count: 4 }
];

const chartConfig={
      backgroundColor: '#e26a00',
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 30,
        padding: 40,
        marginTop:20,


      }
    };
const screenWidth = Dimensions.get('window').width;
const data = [0.4, 0.6, 0.8,0.1,0.2];
const data2 ={
  labels: ['Test1', 'Test2'],
  legend: ['L1', 'L2', 'L3'],
  data: [
    [60, 60, 60],
    [30,30,60],
  ],
  barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
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
