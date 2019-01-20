import React from 'react';
import {Register} from './Register.js';
import {Login} from './Login.js';
import {Home} from './Home.js';
import { Switch, Route, Redirect } from 'react-router-dom'
//使用switch设置路由的路径
export class Main extends React.Component {
    getHome = () => {
        /*根据apps传下来的isLoggedin判断登陆状态。决定是否要路由到home 页面*/
        return this.props.isLoggedin ? <Home/> : <Redirect to='/login' />;
        /*redirect功能就是保持路由的一致性。这里如果直接返回一个<Login>会导致路由依旧停留在home*/
    }

    getLogin = () => {
        /*根据apps传下来的isLoggedin判断登陆状态。决定是否要路由到Login 页面还是已经登录了直接到home*/
        return this.props.isLoggedin ? <Redirect to='/home' /> : <Login handleLogin={this.props.handleLogin}/>;
    }
    render () {
        return (
            <div className="main">
                <Switch>
                    <Route exact path="/" render={this.getLogin}/>
                    <Route path="/login" render={this.getLogin}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/home" render={this.getHome}/>
                    <Route component={Login}/>
                </Switch>
            </div>
        );
    }
}