import React, { Component } from 'react';
import '../styles/App.css';
import {TopBar} from './TopBar.js';
import {Main} from './Main.js';
import {TOKEN_KEY} from '../Constants'

class App extends Component {
    // es7 写法。constructor简写。前提是只需要state。login状态管理应当在最顶层的app管理
    state = {
        isLoggedin: Boolean(localStorage.getItem(TOKEN_KEY))
    }
    handleLogin = () => {
        /*login时候顺手修改状态。这个是要一层层传到login.js中发挥作用的*/
        this.setState({isLoggedin: true});
    }
    handleLogout = () => {
        /*logout时候顺手修改状态。这个是要一层层传到TopBar.js中发挥作用的*/
        localStorage.removeItem(TOKEN_KEY);
        this.setState({isLoggedin: false});
    }
    render() {
        return (
            <div className="App">
                <TopBar isLoggedin={this.state.isLoggedin} handleLogout={this.handleLogout}/>
                <Main isLoggedin={this.state.isLoggedin} handleLogin={this.handleLogin}/>
            </div>
        );
    }
}

export default App;
