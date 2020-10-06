import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Form, Icon, Input, Button } from 'antd';
// import {PostData} from '../services/PostData.js';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UploadLogin extends Component {

  constructor(props){
    super(props);
    this.state = { redirectToReferrer: false };
    console.log('constructor');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        
        const data = new FormData();

        data.append("username", values.userName);
        data.append("password", values.password);
    
        fetch('./server/auth.php', {
          method: 'POST',
          body: data,
        }).then((r)=>{
          if(r.ok) {
            this.setState({ redirectToReferrer: true });
            this.props.history.push('/data');
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .catch((e)=>{
          console.error(e);
        });
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { redirectToReferrer } = this.state.redirectToReferrer;
    console.log(this.state);
      // Only show error after a field is touched.
      const userNameError = isFieldTouched('userName') && getFieldError('userName');
      const passwordError = isFieldTouched('password') && getFieldError('password');
      return (
        <div>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={userNameError ? 'error' : ''}
              help={userNameError || ''}
            >
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem
              validateStatus={passwordError ? 'error' : ''}
              help={passwordError || ''}
            >
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Log in
              </Button>
            </FormItem>
          </Form>
          { redirectToReferrer && (
            <Redirect to={{pathname: "/data"}} />)
          }
        </div>
        
      );
  }
}

const UploadLoginForm = Form.create()(UploadLogin);

// ReactDOM.render(<UploadLoginForm />, mountNode);

export default withRouter(UploadLoginForm);
