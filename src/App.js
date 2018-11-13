// src/App.js
import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Dashboard from './components/Dashboard';
import UploadLogin from './components/UploadLogin';
import UploadData from './components/UploadData';
import './App.css';

const { Header, Content } = Layout;

const fakeAuth = {
  isAuthenticated: true,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}



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
                <Menu.Item key="1"><Link to="/data">Upload</Link></Menu.Item>
              </Menu>
            </Header>
            <Layout>
              <Content>
                <Route exact path="/" component={Dashboard} />
                <Route path="/login" component={UploadLogin} />
                <PrivateRoute path='/data' component={UploadData} />
              </Content>
            </Layout>
          </Layout>
        </div>
        
      </Router>
    );
  }
}

export default App;