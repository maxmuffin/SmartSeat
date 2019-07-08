import React from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, RefreshControl} from 'react-native';
import { Container, Header, Content, Item, Input, Text, Button, Body, Title, Left, Right, Icon, Resizable} from 'native-base';
import PureChart from 'react-native-pure-chart';
import IpAddress from './auth/constant';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit';

export default class GraphScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        dailyData:[{'x':"00:00:00",'y':0}],
        weekData:[{'x':"00:00:00",'y':0}],
        correctCount: 1,
        wrongCount:1,
        noSitCount:1,
        refreshing: false,
      }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getData().then(() => {
      this.setState({refreshing: false});
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Health Data",
      headerTitleStyle:{
        color: '#858585',
        fontWeight: 'bold',
      }
    };
  };

  async componentDidMount() {
  await this.getData();
  }

  async getData(){
     fetch(IpAddress+'/get_graph_values', {method: "GET"})
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
        var arr = [];
        var arrCorr = [];
        var arrWrong = [];
        var arrNotSit = [];
        var obj ='';
        var y ='';
        var objDay = '';
        var objWeek = '';
        var correct = 0;
        var wrong = 0;
        var noSit =  0;
        var objCorrect = '';
        var objWrong = '';
        var objNotSitted = '';

        Object.keys(responseData.day_measurement).forEach(function(key) {
          y = parseInt(responseData.day_measurement[key], 10);
          obj = {"x":key,"y":y};
          arr.push(obj);
          if (y === 2) {
       		   correct += 1;
       		} else if (y === 1) {
             wrong += 1;
           } else if (y === 0) {
             noSit += 1;
           }
           console.log(y+" "+correct+" "+wrong+" "+noSit);
        });
        Object.keys(responseData.all_measurement.Correct).forEach(function(key) {
          objCorrect = {"x":key,"y": Math.floor(responseData.all_measurement.Correct[key]/30)+1};
          arrCorr.push(objCorrect);
        });
        Object.keys(responseData.all_measurement.Wrong).forEach(function(key) {
          objWrong = {"x":key,"y": Math.floor(responseData.all_measurement.Wrong[key]/30)+1};
          arrWrong.push(objWrong);
        });
        Object.keys(responseData.all_measurement.NotSitted).forEach(function(key) {
          objNotSitted = {"x":key,"y": Math.floor(responseData.all_measurement.NotSitted[key]/30)+1};
          arrNotSit.push(objNotSitted);
        });
        objDay = [{seriesName: 'day_measurement', data: arr, color: "#6cc3c0"}];
        objWeek = [{
          seriesName: 'Correct',
          data: arrCorr,
          color: '#7bd942'
        },
        {
          seriesName: 'Wrong',
          data: arrWrong,
          color: '#ea304c'
        },
        {
          seriesName: 'Not Sitted',
          data: arrNotSit,
          color: "#c7c7c7"
        }];
        this.setState({dailyData:objDay, weekData:objWeek, correctCount:correct, wrongCount:wrong, noSitCount:noSit});
        console.log(this.state);
        this.forceUpdate();
     })
    .catch((error) => {
      this.forceUpdate();
    });
  }


  render() {
    let pieChartData = [
    { name: 'min (Correct)', population: Math.floor(this.state.correctCount/30)+1, color: '#7bd942', legendFontColor: '#7bd942', legendFontSize: 13 },
    { name: 'min (Wrong)', population: Math.floor(this.state.wrongCount/30)+1, color: '#ea304c', legendFontColor: '#ea304c', legendFontSize: 13 },
    { name: 'min (Not sitted)', population: Math.floor(this.state.noSitCount/30)+1, color: '#c7c7c7', legendFontColor: '#c7c7c7', legendFontSize: 13 },
  ]


  /*let pieChart = [
  {
    value: parseInt(this.state.correctCount, 10),
    label: 'Correct',
    color: '#7bd942',
  }, {
    value: this.state.wrongCount,
    label: 'Wrong',
    color: '#ea304c'
  }, {
    value: this.state.noSitCount,
    label: 'No sitted',
    color: '#c7c7c7'
  }
]*/

  return (
    <Container contentContainerStyle={styles.Container}>
      <ScrollView style={{paddingTop:15, paddingBottom:10}} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
        <Content  contentContainerStyle={{flex:1, justifyContent: 'center', alignItems: 'center' , paddingBottom: 20, paddingLeft:5, paddingRight:5,
         }} resizeMode="contain" >
          <Text style={{fontSize: 18,  color: "#6cc3c0", paddingTop: 10, paddingBottom: 10}}> Today </Text>
          <PureChart data={this.state.dailyData} type='line' height={150} xAxisGridLineColor={'#e7e7e7'} yAxisGridLineColor={'#e7e7e7'}/>
          <Text style={{fontSize: 10,  color: "#858585", paddingBottom:5}}>Correct (2)    Wrong (1)    Not sitted (0)</Text>
          <PieChart
            data={pieChartData}
            width={Math.round(Dimensions.get('window').width)}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            paddingRight="15"
            absolute
          />
        <Text style={{paddingBottom:5, color: '#F0F0F0'}}>______________________________________</Text>
          <Text style={{fontSize: 18,  color: "#6cc3c0", paddingTop:20, paddingBottom:10}}> Daily Postures (minutes) </Text>
          <PureChart data={this.state.weekData} type='bar' height={150} numberOfXAxisGuideLine ={2} xAxisGridLineColor={'#e7e7e7'}   yAxisGridLineColor={'#e7e7e7'}/>
          <Text style={{fontSize: 10,  color: "#858585", paddingTop:8, paddingBottom:10}}> Legend:
            <Text style={{fontSize: 12, fontWeight: 'bold', color: "#7bd942"}}> Correct (2) </Text>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: "#ea304c"}}> Wrong (1) </Text>
            <Text style={{fontSize: 12, fontWeight: 'bold', color: "#c7c7c7"}}> No sitted (0) </Text>
          </Text>
          <Text style={{fontSize: 15,  color: "#dadada", paddingTop: 70, paddingBottom:5}}> Powered by SmartSeat® </Text>
        </Content>
      </ScrollView>
    </Container>
    );
  }
}

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  color: (opacity = 0) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2 // optional, default 3
}

const styles = StyleSheet.create({

})
