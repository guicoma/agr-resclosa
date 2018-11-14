import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Upload, Button, message } from 'antd';

const FormItem = Form.Item;

const Dragger = Upload.Dragger;


let postData = {
  accumulated : [],
  avg_flow    : []
};

function parseFile(file){
  let values = file.split("\n");
  values = values.filter((line)=> {
    return (line !== undefined && line !== "" && line.length !== 0)});
  values = values.map((item)=>{
    let aux   = item.split("\t");
    let floataux = aux[1].replace(",",".");
    let obj = {
      datetime: aux[0].replace(new RegExp("/", 'g'),"-"),
      value   : parseFloat(floataux)
    };
    return obj;
  })
  console.log('values',values);
  return values;
}

function sendFlowData(dataobj) {

  return fetch('./api/flow/upload.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataobj)
  }).then((r)=>{
    console.log(r);
  })
  .catch((e)=>{
    console.error(e);
  });
}

function sendVolumeData(dataobj) {
 return fetch('./api/volume/upload.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataobj)
  }).then((r)=>{
    console.log(r);
  })
  .catch((e)=>{
    console.error(e);
  });
}

class UploadData extends Component {

  state = {
    fileList: [],
    uploading: false,
  }

  
  handleSubmit = (e) => {
    e.preventDefault();
    let self = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        self.setState({
          uploading: true,
        });

        const { fileList } = this.state;
        fileList.forEach((file) => {          
          let reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = (function() {
            return function(e) {
              let parsed = parseFile(e.currentTarget.result);
              if(file.name.includes("VA")){
                postData.accumulated = postData.accumulated.concat(parsed);
              }
              if(file.name.includes("QMH")){
                postData.avg_flow = postData.avg_flow.concat(parsed);
              }
            };
          })(file);

          // Read in the image file as a data URL.
          reader.readAsText(file);
        });

        let promises = [];

        if(postData.accumulated.length > 0)
          promises.push(sendVolumeData(postData));

        if(postData.avg_flow.length > 0)
          promises.push(sendFlowData(postData));

        Promise.all(promises).then((r) => {
          console.log('all done', r);
          self.setState({
            fileList: [],
            uploading: false,
          });
          message.success('upload successfully.');
        }).catch((e) => {
          console.log('all error', e);
          self.setState({
            uploading: false,
          });
          message.error('upload failed.');
        });
    
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

    const props = {
      action: './api/flow/upload.php',
      multiple: true,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      }
    }

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