import React, { Component } from 'react';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import moment from "moment"
import { withRouter } from 'react-router-dom';
import { Table, Divider, message, DatePicker } from 'antd';
import { merge, unionBy, orderBy } from 'lodash';

import './../styles/Dashboard.css';

const { MonthPicker } = DatePicker;

const columns = [{
  title: 'Date',
  dataIndex: 'datetime',
  key: 'datetime',
}, {
  title: 'Cabal mitjà horari (L/s)',
  dataIndex: 'avg_flow',
  key: 'avg_flow',
}, {
  title: 'Volume accumulated (hm^3)',
  dataIndex: 'volume_acc',
  key: 'volume_acc',
}];

const hoursInYear  = moment.duration(1, 'years').asHours();
const hoursInMonth = moment.duration(1, 'months').asHours();

function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response.json();
}


class Dashboard extends Component {
  constructor(props) {
    super(props);

    let tempVolume  = [];
    let tempFlow    = [];
    let tempTable   = [];
    let initYear    = '2018';
    let initMonth   = '12';
    
    for (let i = 0; i < hoursInYear; i++) {
      let datestamp = moment(initYear+'-01-01 00:00:00').add(i,'hour').format('YYYY-MM-DD HH:mm:ss');
      tempVolume.push({datetime: datestamp, volume_acc: null});
    }
    for (let i = 0; i < hoursInMonth; i++) {
      let datestamp = moment(initYear+'-'+initMonth+'-01 00:00:00').add(i,'hour').format('YYYY-MM-DD HH:mm:ss');
      tempFlow.push({datetime: datestamp, volume_acc: null});
    }

    let auxFlow = tempFlow.map(a => Object.assign({}, a));
    let auxVol  = tempVolume.map(a => Object.assign({}, a));
        
    tempTable = merge(auxVol, auxFlow);
    
    this.state = {
      loading: false,
      volume_data: tempVolume,
      flow_data: tempFlow,
      table_data: tempTable,
      width: 700,
      height: 500,
      year_month: initYear+'/'+initMonth
    }
  }

  fetchData(year, month) {
    let flowData = [], volumeData = [], tableData = [], dateRange;
  
      dateRange = {
        year: year,
        month: month
      }
      //fetch('./api/flow/read.php')
      fetch('./api/flow/readRange.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateRange)
      })
      .then(handleErrors)
      .then((flow) => {
        //console.log('read-flow',flowData);
        let tempFlow = [];
        let textMonth = (month < 10)? '0'+month : month;
        for (let i = 0; i < hoursInMonth; i++) {
          let datestamp = moment(year+'-'+textMonth+'-01 00:00:00').add(i,'hour').format('YYYY-MM-DD HH:mm:ss');
          tempFlow.push({datetime: datestamp, volume_acc: null});
        }

        flowData = orderBy(unionBy(flow.records, tempFlow, 'datetime'), 'datetime');

        this.setState({flow_data: flowData});
        //return fetch('./api/volume/read.php');
        return fetch('./api/volume/readRange.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dateRange)
        });
      })
      .then(handleErrors)
      .then((volume) => {

        volumeData = volume.records;

        let auxFlow = flowData.map(a => Object.assign({}, a));
        let auxVol  = volumeData.map(a => Object.assign({}, a));
        
        tableData = merge(auxVol, auxFlow);
  
        console.log('DATA');
        console.log('flowData', flowData);
        console.log('volumeData', volumeData);
        console.log('tableData', tableData.filter((item) => { return ("avg_flow" in item)}));
  
        this.setState({
          loading     : false,
          year_month  : year+"/"+month,
          volume_data : volumeData,
          table_data  : tableData.filter((item) => { return ("avg_flow" in item)})
        });
  
      })
      .catch((e) => {
        console.error(e);
        message.error('Error while getting info');
        this.setState({loading : false});
      });
  }

  componentDidMount() {
    let dateAux = this.state.year_month.split("/"),
        year    = parseInt(dateAux[0]),
        month   = parseInt(dateAux[1]);

    this.fetchData(year, month);
  }

  onChangeDate = (date, dateString) => {
    if(date) {
      this.setState({loading:true});
      console.log(date, date.month(), date.year(), dateString);
      this.fetchData(date.year(), date.month()+1);
    }
  }
  
  
  render() {
    return (
      <div>
        <h1>Resclosa - Moli de la Coromina</h1>
        <h4>Registre d'Aigues: A-0012541</h4>
        <div>
          <MonthPicker size={"large"} onChange={this.onChangeDate} value={moment(this.state.year_month, 'YYYY/MM')} defaultValue={moment(this.state.year_month, 'YYYY/MM')} allowClear={false} placeholder="Select Month" />
        </div>
        <div className="dashboard">
          <div>
              <Divider>Volumen acumulat (hm<sup>3</sup>)</Divider>
            <div className="graph">
              <LineChart width={700} height={420} data={this.state.volume_data}>
                <Line type="monotone" dataKey="volume_acc" stroke="#8884d8" dot={false} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis interval={parseInt(this.state.volume_data.length/12)} dataKey="datetime" tickFormatter={(tick) => moment(tick).format('MMM')} />
                <YAxis />
              </LineChart>
            </div>
          </div>
          <div>
            <Divider>Cabal mitjà horari (L/s)</Divider>
            <div className="graph">
              <BarChart width={700} height={420} data={this.state.flow_data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis interval={parseInt(this.state.flow_data.length/31)} dataKey="datetime" tickFormatter={(tick) => moment(tick).format('D')}/>
                <YAxis/>
                <Bar dataKey="avg_flow" fill="#8884d8" />
              </BarChart>
            </div>
          </div>
        </div>
        <Divider />
        <Table rowKey={record => record.datetime} columns={columns} dataSource={this.state.table_data} />
      </div>
    );
  }
};

export default withRouter(Dashboard);