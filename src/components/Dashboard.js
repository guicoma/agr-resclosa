import React, { Component } from 'react';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import moment from "moment"
import { withRouter } from 'react-router-dom';
import { Table, Button, Divider, Icon } from 'antd';
import { merge } from 'lodash';

import './../styles/Dashboard.css';

const ButtonGroup = Button.Group;

const columns = [{
  title: 'Date',
  dataIndex: 'datetime',
  key: 'datetime',
}, {
  title: 'Cabal mitjà horari',
  dataIndex: 'avg_flow',
  key: 'avg_flow',
}, {
  title: 'Volume accumulated',
  dataIndex: 'volume_acc',
  key: 'volume_acc',
}];


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume_data: [],
      flow_data: [],
      table_data: [],
      width: 700,
      height: 500,
      year: moment().year(),
      month: moment().month()
    }
  }

  componentDidMount() {

    /*
    let data = [];
    let data2 = [];
    
    for (let x = 1; x <= 720; x++) {
      data.push({datetime: x, avg_flow: Math.floor(Math.random() * 100)})
      data2.push({datetime: x, volume_acc: Math.floor(Math.random() * 100)})
    }

    let tdata = merge(data,data2);

    this.setState({
      flow_data: data,
      volume_data: data2,
      table_data: tdata
    });

    console.log("DATA");
    console.log(tdata);
    */

    let flowData, volumeData, tableData;

    fetch('./api/flow/read.php')
      .then((r) => r.json())
      .then((r) => {
        flowData = r.records.map((item) => {
          return {
            datetime: moment(item.datetime).format("YYYY-MM-DD HH"),
            avg_flow: parseFloat(item.avg_flow)
          }
        });
        console.log('read-flow',flowData);
        return fetch('./api/volume/read.php');
      })
      .then((r) => r.json())
      .then((r) => {
        volumeData = r.records.map((item) => {
          return {
            datetime  : moment(item.datetime).format("YYYY-MM-DD HH"),
            volume_acc: parseFloat(item.volume_acc)
          }
        });
        
        tableData = merge(flowData, volumeData);

        console.log('DATA');
        console.log('flowData', flowData);
        console.log('volumeData', volumeData);
        console.log('tableData', tableData);

        this.setState({
          flow_data   : flowData,
          volume_data : volumeData,
          table_data  : tableData
        });

      })
      .catch((e) => {
        console.error(e);
      });
  }

  render() {
    return (
      <div>
        <div className="dashboard">
          <div>
            <Divider>Volumen acumulat (h^3) - {this.state.year}</Divider>
            <div className="graph">
              <LineChart width={700} height={420} data={this.state.volume_data}>
                <Line type="monotone" dataKey="volume_acc" stroke="#8884d8" dot={false} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="datetime" />
                <YAxis />
              </LineChart>
            </div>
            <ButtonGroup>
              <Button><Icon type="left" /></Button>
              <Button type="dashed" disabled>{this.state.year}</Button>
              <Button disabled={this.state.year === moment().year()}><Icon type="right" /></Button>
            </ButtonGroup>
          </div>
          <div>
            <Divider>Últims 30 dies de dades de Cabal mitjà horari (L/s) - {this.state.month}</Divider>
            <div className="graph">
              <BarChart width={700} height={420} data={this.state.flow_data}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="datetime"/>
                <YAxis/>
                <Bar dataKey="avg_flow" fill="#8884d8" />
              </BarChart>
            </div>
            <ButtonGroup>
              <Button><Icon type="left" /></Button>
              <Button type="dashed" disabled>{this.state.month}</Button>
              <Button disabled={this.state.month === moment().month()}><Icon type="right" /></Button>
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