import React from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit';
import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Icon, Resizable} from 'native-base';
import PureChart from 'react-native-pure-chart';

export default class GraphScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Health Data",
      headerTitleStyle:{
        color: 'black',
        fontWeight: 'bold',
      }
    };
  };


  render() {
    let sampleData = [
    {
      seriesName: 'series1',
      data: [
        {x: '10:00', y: 1},
        {x: '11:00', y: 2},
        {x: '11:02', y: 0},
        {x: '11:03', y: 1},
        {x: '11:05', y: 1},
        {x: '10:00', y: 1},
        {x: '11:00', y: 2},
        {x: '11:02', y: 0},
        {x: '11:03', y: 1},
        {x: '11:05', y: 1},
        {x: '10:00', y: 1},
        {x: '11:00', y: 2},
        {x: '11:02', y: 0},
        {x: '11:03', y: 1},
        {x: '11:05', y: 1},
        {x: '10:00', y: 1},
        {x: '11:00', y: 2},
        {x: '11:02', y: 0},
        {x: '11:03', y: 1},
        {x: '11:05', y: 1},

      ],
      color: '#6cc3c0'
    }
  ]

  let sampleData1 = [
    {
      seriesName: 'Not sitted',
      data: [
        {x: '2018-02-01', y: 30},
        {x: '2018-02-02', y: 200},
        {x: '2018-02-03', y: 170},
        {x: '2018-02-04', y: 250},
        {x: '2018-02-05', y: 10}
      ],
      color: '#297AB1'
    },
    {
      seriesName: 'Correct',
      data: [
        {x: '2018-02-01', y: 20},
        {x: '2018-02-02', y: 100},
        {x: '2018-02-03', y: 140},
        {x: '2018-02-04', y: 550},
        {x: '2018-02-05', y: 40}
      ],
      color: 'green'
    },
    {
      seriesName: 'Wrong',
      data: [
        {x: '2018-02-01', y: 20},
        {x: '2018-02-02', y: 100},
        {x: '2018-02-03', y: 140},
        {x: '2018-02-04', y: 550},
        {x: '2018-02-05', y: 40}
      ],
      color: 'red'
    }
  ]

  return (
    <ScrollView contentContainerStyle={styles.Container}>
      <Content  contentContainerStyle={{flex:1, justifyContent: 'space-between', alignItems:'center', width: Dimensions.get('window').width,
      height: Dimensions.get('window').height }} resizeMode="contain">
      <Text style={{fontWeight: 'bold', color: '#787878'}}>Today</Text>
      <PureChart data={sampleData} type='line' width= {Dimensions.get('window').width} height={250} numberOfYAxisGuideLine ={1}/>
      <Text style={{fontWeight: 'bold'}}>Daily Postures</Text>
      <PureChart data={sampleData1} type='bar' width= {Dimensions.get('window').width} height={250}/>
      </Content>
    </ScrollView>
    );
  }
}



const styles = StyleSheet.create({

})
