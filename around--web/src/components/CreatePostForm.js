import React from 'react';
import {Form, Upload, Input, Icon} from 'antd';

const FormItem = Form.Item;

class NormalCreatePostForm extends React.Component {
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    beforeUpload = () => {return false;}; // 关掉upload部分的自动上传功能。beforeUpload返回false那么就不会自动上传


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        };

        return (
            <Form layout="vertical">
                {/*输入框*/}
                <FormItem
                    {...formItemLayout}
                    label="Message">
                    {getFieldDecorator('message', {
                        rules: [{required: true, message: 'Please input a message.'}]
                    })(
                        <Input/>
                    )}
                </FormItem>
                {/*拖拽上传*/}
                <FormItem
                    {...formItemLayout}
                    label="Image"
                >
                    <div className="dropbox">
                        {getFieldDecorator('image', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            rules: [{required: true, message: 'Please select an image.'}]
                        })(
                            <Upload.Dragger name="files" beforeUpload={this.beforeUpload}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox"/>
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        )}
                    </div>
                </FormItem>
            </Form>

        );
    }

}

// high order component 加上了自动校验的功能
export const CreatePostForm = Form.create()(NormalCreatePostForm);