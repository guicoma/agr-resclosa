import React, { Component } from 'react';
import {BarChart} from 'react-easy-chart';
import moment from "moment"
import { withRouter } from 'react-router-dom';
import { DatePicker, Table, Divider } from 'antd';

import './../styles/Dashboard.css';

const { RangePicker } = DatePicker;

const columns = [{
  title: 'Date',
  dataIndex: 'x',
  key: 'x',
}, {
  title: 'Volume accumulated',
  dataIndex: 'y',
  key: 'y',
}];

/*
for (let x = 1; x <= 30; x++) {
  data.push({x: x, y: Math.floor(Math.random() * 100)})
}
*/

function onChange(date, dateString) {
  console.log(date, dateString);
}


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      volume_data: [],
      flow_data: [],
      width: 700,
      height: 500
    }
  }

  componentDidMount() {
    fetch('./api/flow/read.php')
      .then((r) => r.json())
      .then((r) => {
        console.log('read-flow',r);
        this.setState({flow_data: r.records})
        return fetch('./api/volume/read.php');
      })
      .then((r) => r.json())
      .then((r) => {
        let temp = []
        r.records.forEach((item) => {
          temp.push({x: moment(item.datetime).format("YYYY-MM-DD HH"), y: parseFloat(item.volume_acc)})
        });
        console.log('read-volume',temp);
        this.setState({volume_data: temp});
      })
      .catch((e) => {
        console.error(e);
      });
  }

  render() {
    return (
      <div>
        <div className="dashboard">
          <div className="graph">
          <BarChart
            axisLabels={{x: 'My x Axis', y: 'My y Axis'}}
            axes
            height={450}
            width={960}
            datePattern="%Y-%m-%d %H"
            colorBars
            xType={'time'}
            data={this.state.volume_data}
          />
          </div>
          <RangePicker onChange={onChange} />
          <Divider />
          <Table rowKey={record => record.x} columns={columns} dataSource={this.state.volume_data} />
        </div>
      </div>
    );
  }
};

export default withRouter(Dashboard);