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
        color: '#858585',
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
        {x: '10:00', y: 2},
        {x: '11:00', y: 2},
        {x: '11:02', y: 0},
        {x: '11:03', y: 1},
        {x: '11:05', y: 1},
        {x: '10:00', y: 1},
        {x: '11:00', y: 2},
        {x: '11:02', y: 0},
        {x: '11:03', y: 2},
        {x: '11:05', y: 1},
        {x: '10:00', y: 1},
        {x: '11:00', y: 2},
        {x: '11:02', y: 0},
        {x: '11:03', y: 1},
        {x: '11:05', y: 1},

      ],
      color: '#0099ff'
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
      color: '#c7c7c7'
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
      color: '#7bd942'
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
      color: '#ea304c'
    }
  ]


  var correctCount = 0;
  var wrongCount = 0;
  var noSitCount = 0;

  for (i = 0; i < sampleData[0].data.length; i += 1) {
       if (sampleData[0].data[i].y === 2) {
  		correctCount += 1;
  		}
       if (sampleData[0].data[i].y === 1) {
  		wrongCount += 1;
  		}
       if (sampleData[0].data[i].y === 0) {
  		noSitCount += 1;
  		}
  	}

  let sampleData3 = [
  {
    value: correctCount,
    label: 'Correct',
    color: '#7bd942',
  }, {
    value: wrongCount,
    label: 'Wrong',
    color: '#ea304c'
  }, {
    value: noSitCount,
    label: 'No sitted',
    color: '#c7c7c7'
  }

]

  return (
    /*<ScrollView contentContainerStyle={styles.Container}>
      <Content  contentContainerStyle={{flex:1, justifyContent: 'space-between', alignItems:'center', width: Dimensions.get('window').width,
      height: Dimensions.get('window').height }} resizeMode="contain">
      <Text style={{fontWeight: 'bold', color: '#787878'}}>Today</Text>
      <PureChart data={sampleData} type='line' width= {Dimensions.get('window').width} height={250} numberOfYAxisGuideLine ={1}/>
      <Text style={{fontWeight: 'bold'}}>Daily Postures</Text>
      <PureChart data={sampleData1} type='bar' width= {Dimensions.get('window').width} height={250}/>
      </Content>
    </ScrollView>*/
    <Container contentContainerStyle={styles.Container}>
      <ScrollView style={{paddingTop:15, paddingBottom:10}}>
      <Content  contentContainerStyle={{flex:1, justifyContent: 'center', alignItems: 'center' , paddingBottom: 20, paddingLeft:5, paddingRight:5,
       }} resizeMode="contain" >
      <Text style={{fontSize: 15,  color: "#6cc3c0", paddingBottom: 5}}> Today </Text>
      <PureChart data={sampleData} type='line' xAxisGridLineColor={'#e7e7e7'} yAxisGridLineColor={'#e7e7e7'}/>
      <Text style={{paddingBottom:5}}></Text>
      <PureChart data={sampleData3} type='pie' />
      <Text style={{fontSize: 10,  color: "#858585", paddingTop:8, paddingBottom:10}}> Legenda:
        <Text style={{fontSize: 10, fontWeight: 'bold', color: "#7bd942"}}> Correct </Text>
        <Text style={{fontSize: 10, fontWeight: 'bold', color: "#ea304c"}}> Wrong </Text>
        <Text style={{fontSize: 10, fontWeight: 'bold', color: "#c7c7c7"}}> No sitted </Text>
      </Text>
      <Text style={{fontSize: 15,  color: "#6cc3c0", paddingTop:20, paddingBottom:5}}> Daily Postures </Text>
      <PureChart data={sampleData1} type='bar' numberOfXAxisGuideLine ={1} xAxisGridLineColor={'#e7e7e7'}   yAxisGridLineColor={'#e7e7e7'}/>

      <Text style={{fontSize: 15,  color: "#dadada", paddingTop: 70, paddingBottom:5}}> Powered by SmartSeat® </Text>

      </Content>
      </ScrollView>

    </Container>

    );
  }
}



const styles = StyleSheet.create({

})
