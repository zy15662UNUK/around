import React from 'react';
import {Form, Input, Button, message} from 'antd';
import {root} from '../Constants.js';
import {Link} from 'react-router-dom';
const FormItem = Form.Item;
/*
* 注意这里link 是应用Main.js中设置好的url路径和对应的component*/
class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: []
    };

    handleSubmit = (e) => {
        e.preventDefault(); // 禁止原生的form submit功能
        // validate 所有的input。 传入的是callback。也就是校验完成后你想做的事
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                /*
                * 这里的fetch返回的就是一个promise。利用promise方便嵌套回调
                * .then()就是放入回调函数用的。在回调函数中最后要返回一个promise就可以了
                * 这里连接的.then()可以理解为让每个then中的回调函数依次执行
                * */
                fetch(`/api/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password
                    })
                }).then((response) => {
                    console.log(response)
                    if (response.ok) {
                        return response;
                    }
                    throw new Error(response.statusText); // 抛出异常，会被底下的catch接住
                }).then((response) => {
                    return response.text();
                }).then((response) => {
                    console.log(response);
                    message.success("successed");
                    // register现在已经确认成功了。自动跳转页面.router会给每个component中props加上一个
                    // history，就和browser的history一样。push就是跳转意思
                    this.props.history.push('/login');
                }).catch((e) => {
                    console.log(e);
                    message.error("failed");
                });
            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }


    render() {
        /*
        * 这句话等效于 const getFieldDecorator = this.props.form.getFieldDecorator;
        * */
        const {getFieldDecorator} = this.props.form;


        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16}
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };

        return (
            <Form onSubmit={this.handleSubmit} className="register">
                <FormItem
                    {...formItemLayout}
                    label="Username"
                >
                    {getFieldDecorator('username', {
                        rules: [{required: true, message: 'Please input your username!', whitespace: false}]
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Password"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your password!'
                        }, {
                            validator: this.validateToNextPassword
                        }]
                    })(
                        <Input type="password"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Confirm Password"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!'
                        }, {
                            validator: this.compareToFirstPassword
                        }]
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur}/>
                    )}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Register</Button>
                    <p>I already have an account, go back to <Link to="/login">login</Link></p>

                </FormItem>

            </Form>
        );
    }
}

/*
* Concretely, a higher-order component
* is a function that takes a component and returns a new component.
*
* Form.create 就是用RegistrationForm创建一个新的component。这样才会有自动校验的功能
* 等效于:
* const enhance = Form.create();
* export const Register = enhance(RegistrationForm);
* 在enhance里面创建一个新的class。里面包含我传给enhance的component，以及自动校验的功能
* */
export const Register = Form.create()(RegistrationForm);
