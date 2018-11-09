import React, { Component } from 'react';
import BarChart from './BarChart';
import { withRouter } from 'react-router-dom';

import './../styles/Dashboard.css';

class Dashboard extends Component {
  
  state = {
    data: [12, 5, 6, 6, 9, 10],
    width: 700,
    height: 500
  }

  componentWillUnmount() {}

  componentDidMount() {}

  render() {
    return (
      <div>
        <div className="dashboard">
          <BarChart data={this.state.data} width={this.state.width} height={this.state.height} />
        </div>
      </div>
    );
  }
};

export default withRouter(Dashboard);