import React from 'react';
import { Tabs, Button, Spin, Row, Col, Radio} from 'antd';
import {GEO_OPTIONS, POS_KEY, root, AUTH_HEADER, TOKEN_KEY} from '../Constants'
import {Gallery} from './Gallery';
import {CreatePostButton} from './CreatePostButton';
import {AroundMap} from './AroundMap';

const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
export class Home extends React.Component {
    /*需要检查加载地理位置信息和posts的状态。那么刚好就用state来记录状态*/
    state = {
        isLoadingGeolocation: false,
        error: '',
        isLoadingPosts: false,
        posts: [],
        topic: "around"
    }
    /*加载完dom后开始请求geo location*/
    componentDidMount() {
        this.setState({isLoadingGeolocation: true, error: ''});// 要清空上次的error
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS
            );
        } else {
            /* geolocation IS NOT available */
            this.setState({error: 'Geolocation is not supported'});
        }
    }
    /*请求geolocation 成功后的回调函数将获取的地址存入localStorage，请求并加载附近的post*/
    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        this.setState({isLoadingGeolocation: false});
        const {latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude})); // 将获取的地址存入localStorage
        this.loadNearbyPost();
    }
    /*请求geolocation 失败后的回调函数*。屏幕显示错误信息*/
    onFailedLoadGeoLocation = () => {
        console.log("Failed to load geoLocation");
        this.setState({isLoadingGeolocation: false, error: 'Failed to load Geolocation'});
    }
    /*请求并加载附近的post*/
    loadNearbyPost = (center, radius) => {
        const range = radius?radius:2000;
        const {lat, lon} = center? center: JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({isLoadingPosts: true, error: ''});
        /*这里return fetch实际上是return这个fetch完全执行完之后的一个promise。
        * 用于createPostButton中的 重载gallery之后执行message*/
        return fetch(`/api/search?lat=${lat}&lon=${lon}&range=${range}`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            } // 在请求头中带上token信息。后端使用的是jwt token
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to load post');
        }).then((data) => {
            this.setState({isLoadingPosts: false, posts: data ? data: []});
            console.log(this.state.posts);
            console.log(data);

        }).catch((e) => {
            console.log(e.message);
        });
    }
    /*专门用来检查state中loading的状态并作出对应的反应*/
    getPanelContent = (type) => {
        const {error, isLoadingGeolocation, isLoadingPosts, posts} = this.state;
        if (error) {
            return <div>{error}</div>
        }else if (isLoadingGeolocation) {
            return <Spin tip="Loading geolocation..."/>;
        }else if (isLoadingPosts) {
            return <Spin tip="Loading posts..."/>;
        }else if (posts.length > 0) {
            // 成功获取到合适的posts就返回gallery组件
            return type === 'video'? this.getVideoPosts(): this.getImagePosts();
        }else {
            return 'No nearby posts'
        }
    }
    getImagePosts = () => {
        const images = this.state.posts.filter((post) => {
            return post.type === 'image';
        }).map((value) => {
            return {
                user: value.username,
                src: value.url,
                thumbnail: value.url,
                caption: value.message,
                thumbnailWidth: 400,
                thumbnailHeight: 300
            };
        });
        return <Gallery images={images}/>;
    }
    getVideoPosts = () => {
        return (
            <div>
                <Row gutter={32}>
                    {
                        this.state.posts.filter((post) => {
                        return post.type === 'video';
                    }).map((post) => {
                        return (
                            <Col span={8} key={post.url}>
                                <video src={post.url} controls className="video-block"/>
                                <p>{`${post.username}: ${post.message}`}</p>
                            </Col>
                        );
                        })
                    }
                </Row>

        </div>
        );
    }
    onTopicChange = (e) => {
        const topic = e.target.value;
        this.setState({topic});
        if (topic === "around") {
            this.loadNearbyPost();
        }else {
            this.loadFaces();
        }

    }
    loadFaces = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({isLoadingPosts: true, error: ''});
        fetch(`${root}/cluster?term=face`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        }).then((data) => {
            console.log(data);
            this.setState({ isLoadingPosts: false, posts: data? data: []});
        }).catch((e) => {
            console.log(e);
            this.setState({ isLoadingPosts: false, error: 'Loading face images failed'});
        });
    }
    render () {
        // 将弹窗作为组件使用
        const operations = <CreatePostButton load={this.loadNearbyPost}/>;
        return (
            <div>
                <RadioGroup onChange={this.onTopicChange} value={this.state.topic} className="topic-radio-group">
                    <Radio value="around">Posts around me</Radio>
                    <Radio value="face">Faces around the world</Radio>
                </RadioGroup>
                <Tabs tabBarExtraContent={operations} className="main-tabs">
                    <TabPane tab="Image Posts" key="1">
                        {this.getPanelContent('image')}
                    </TabPane>
                    <TabPane tab="Video Posts" key="2">{this.getPanelContent('video')}</TabPane>
                    <TabPane tab="Map" key="3">
                        <AroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `800px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts = {this.state.posts}
                            loadNearbyPost = {this.loadNearbyPost}
                            loadFaces = {this.loadFaces}
                            topic={this.state.topic}
                        />
                    </TabPane>
                </Tabs>
            </div>

    );
    }
}