import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UploadLogin extends Component {
  state = { redirectToReferrer: false };

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        // let url = 'http://a0012541.agrenovables.com/auth';
        let url = './server/auth.php';

        let headers = new Headers();

        //headers.append('Content-Type', 'text/json');
        headers.append('Authorization', 'Basic ' + btoa(values.userName + ":" + values.password));

        fetch(url, {method:'GET',
                headers: headers
            }).then(response => {
              console.log('response',response);
              this.setState({ redirectToReferrer: true });
            });
        //.done();


      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={'/data'} />;

    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
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
    );
  }
}

const UploadLoginForm = Form.create()(UploadLogin);

// ReactDOM.render(<UploadLoginForm />, mountNode);

export default withRouter(UploadLoginForm);