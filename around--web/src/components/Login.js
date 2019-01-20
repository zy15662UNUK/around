import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import {root} from '../Constants.js';

import {Link} from 'react-router-dom';
import {TOKEN_KEY} from '../Constants'

const FormItem = Form.Item;
/*
* 注意这里link 是应用Main.js中设置好的url路径和对应的component*/
class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                // 接下来要发送请求了。由于这里用proxy转发了。所以不需要带上绝对路径。否则会有跨域的危险
                fetch(`/api/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password,
                    }),
                    // 由于这里使用fetch发送。为了让后端bodyParser能够识别，必须带上请求头中content-type后端才能解析
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error(response.statusText);
                }).then((data) => {
                    console.log(data); // data里面就是token
                    message.success('Login success');
                    localStorage.setItem(TOKEN_KEY, data);
                    console.log(this.props);
                    this.props.handleLogin();
                }).catch((e) => {
                    console.log(e);
                    message.error('Login failed');
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    Or <Link to="/register">register now!</Link>

                </FormItem>
            </Form>
        );
    }
}

export const Login = Form.create()(NormalLoginForm);