import React, { Component } from 'react';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import moment from "moment"
import { withRouter } from 'react-router-dom';
import { Table, Button, Divider, Icon, message } from 'antd';
import { merge } from 'lodash';

import './../styles/Dashboard.css';

const ButtonGroup = Button.Group;

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

function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  return response.json();
}

class Dashboard extends Component {
  constructor(props) {
    super(props);

    let tempVolume = [], tempFlow = [], tempTable = [];
    /*
    for(let i = 0; i < 710; i++) {
      let datestamp = moment().add(-i,'hour').format('YYYY-MM-DD HH:mm');
      tempVolume.push({datetime: datestamp, volume_acc: i * Math.random()});
      tempFlow.push({datetime: datestamp, avg_flow: Math.random()});
    }
    tempTable = merge(tempVolume, tempFlow);
    */
    this.state = {
      loading: false,
      volume_data: tempVolume,
      flow_data: tempFlow,
      table_data: tempTable,
      width: 700,
      height: 500,
      year: 2018,
      month: 10
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
        flowData = flow.records;
        //console.log('read-flow',flowData);
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

        let auxFlow = flowData.slice();
        let auxVol  = volumeData.slice();
        
        tableData = merge(auxVol, auxFlow);
  /*
        console.log('DATA');
        console.log('flowData', flowData);
        console.log('volumeData', volumeData);
        console.log('tableData', tableData.filter((item) => { return ("avg_flow" in item)}));
  */
        this.setState({
          loading     : false,
          year        : year,
          month       : month,
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
    this.fetchData(this.state.year, this.state.month);
  }

  searchPrevYear = () => {
    this.setState({loading:true});
    this.fetchData(this.state.year-1,this.state.month);
  }

  searchNextYear = () => {
    this.setState({loading:true});
    this.fetchData(this.state.year+1, this.state.month);
  }

  searchPrevMonth = () => {
    this.setState({loading:true});
    this.fetchData(this.state.year, this.state.month-1);
  }

  searchNextMonth = () => {
    this.setState({loading:true});
    this.fetchData(this.state.year, this.state.month+1);
  }
  
  render() {
    return (
      <div>
        <h1>Resclosa - Moli de la Coromina</h1>
        <h4>Registre d'Aigues: A-0012541</h4>
        <div className="dashboard">
          <div>
            <Divider>Volumen acumulat (hm<sup>3</sup>) - {this.state.year}</Divider>
            <div className="graph">
              <LineChart width={700} height={420} data={this.state.volume_data}>
                <Line type="monotone" dataKey="volume_acc" stroke="#8884d8" dot={false} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis interval={63} dataKey="datetime" tickFormatter={(tick) => moment(tick).format('MMM')} />
                <YAxis />
              </LineChart>
            </div>
            <ButtonGroup>
              <Button onClick={this.searchPrevYear} disabled={this.state.loading}><Icon type="left" /></Button>
              <Button type="dashed" loading={this.state.loading}>{this.state.year}</Button>
              <Button onClick={this.searchNextYear} disabled={this.state.loading || (this.state.year === moment().year())}><Icon type="right" /></Button>
            </ButtonGroup>
          </div>
          <div>
            <Divider>Cabal mitjà horari (L/s) - {moment(this.state.month, "M").format("MMMM")}</Divider>
            <div className="graph">
              <BarChart width={700} height={420} data={this.state.flow_data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="datetime" interval={22} tickFormatter={(tick) => moment(tick).format('D')}/>
                <YAxis/>
                <Bar dataKey="avg_flow" fill="#8884d8" />
              </BarChart>
            </div>
            <ButtonGroup>
              <Button onClick={this.searchPrevMonth} disabled={this.state.loading}><Icon type="left" /></Button>
              <Button type="dashed" loading={this.state.loading}>{moment(this.state.month, "M").format("MMMM")}</Button>
              <Button onClick={this.searchNextMonth} disabled={this.state.loading || (this.state.month === moment().month() && this.state.year === moment().year())}><Icon type="right" /></Button>
            </ButtonGroup>
          </div>
        </div>
        <Divider />
        <Table rowKey={record => record.datetime} columns={columns} dataSource={this.state.table_data} />
      </div>
    );
  }
};

export default withRouter(Dashboard);