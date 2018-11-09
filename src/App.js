// src/App.js
import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Dashboard from './components/Dashboard';
import UploadLogin from './components/UploadLogin';
import UploadData from './components/UploadData';
import './App.css';

const { Header, Content } = Layout;

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Layout>
            <Header className="header">
              <div className="logo" />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px', float: 'right' }}
              >
                <Menu.Item key="1"><Link to="/upload">Upload</Link></Menu.Item>
              </Menu>
            </Header>
            <Layout>
              <Content>
                <Route exact path="/" component={Dashboard} />
                <Route path="/upload" component={UploadLogin} />
                <Route path="/data" component={UploadData} />
              </Content>
            </Layout>
          </Layout>
        </div>
        
      </Router>
    );
  }
}

export default App;