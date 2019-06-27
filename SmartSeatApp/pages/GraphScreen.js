import React from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Icon } from 'native-base';
import { TimeSeries, TimeRange } from "pondjs";


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

      <ScrollView horizontal={true}>
        <ChartContainer timeRange={timeseries.timerange()} width={800}>
          <ChartRow height="200">
              <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
              <Charts>
                  <LineChart axis="axis1" series={timeseries}/>
              </Charts>
              <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
          </ChartRow>
        </ChartContainer>
      </ScrollView>
    );
  }
}

const data = {
    name: "traffic",
    columns: ["time", "in", "out"],
    points: [
        [1400425947000, 52],
        [1400425948000, 18],
        [1400425949000, 26],
        [1400425950000, 93]
    ]
};

const timeseries = new TimeSeries(data);
var timerange = timeseries.timerange();
const styles = StyleSheet.create({

})
