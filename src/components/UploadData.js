import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Upload, Button, message } from 'antd';

const FormItem = Form.Item;

const Dragger = Upload.Dragger;

const props = {
  action: './../server/post.php',
  customRequest(args) {
    var reader = new FileReader();
    
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        let data = parseFile(e.currentTarget.result);
        sendData({values: data});
      };
    })(args.file);

    // Read in the image file as a data URL.
    reader.readAsText(args.file);
  },
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function parseFile(file){
  let values = file.split("\n");
  values = values.filter((line)=> {
    return (line !== undefined && line !== "" && line.length !== 0)});
  values = values.map((item)=>{
    let aux = item.split("\t");
    let obj = {
      datetime: new Date(aux[0]),
      value   : parseFloat(aux[1].replace(",","."))
    };
    return obj;
  })
  console.log('values',values);
  return values;
}

function sendData(dataobj) {
  var req = new XMLHttpRequest();
  req.open('POST', './server/post.php', true);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(dataobj));
  req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200)
      console.log(req.responseText);
  };
}

class UploadData extends Component {
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        debugger;
      }
    });
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Plain Text"
        >
          <span className="ant-form-text">China</span>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Dragger"
        >
          <div className="dropbox">
            {getFieldDecorator('dragger', {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
              </Dragger>,
            )}
          </div>
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    );
  }
}

const UploadDataForm = Form.create()(UploadData);

// ReactDOM.render(<UploadDataForm />, mountNode);

export default withRouter(UploadDataForm);