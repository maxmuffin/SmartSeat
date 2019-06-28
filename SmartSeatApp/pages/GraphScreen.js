import React from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart
} from "react-timeseries-charts";

import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Icon, Resizable} from 'native-base';
import { TimeSeries, TimeRange } from "pondjs";
import {Chart} from 'react-google-charts';

export default class GraphScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Health Data",
      headerTitleStyle:{
        color: '#f69b31',
        fontWeight: 'bold',
      }
    };
  };


  render() {
    const data = {
      name: "leads",
      columns: ["time", "count"],
      points: [
          [1484121499495, 2],
          [1484131499495, 9],
          [1484141999495, 14],
          [1484152499495, 27]
      ]
  }
  const series1 = new TimeSeries(data);
  return (
    <ChartContainer timeRange={series1.timerange()} width={800}>
      <ChartRow height="200">
          <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
          <Charts>
              <LineChart axis="axis1" series={series1}/>
              <LineChart axis="axis2" series={series2}/>
          </Charts>
          <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
      </ChartRow>
    </ChartContainer>

    );
  }
}



const styles = StyleSheet.create({

})
