import React from 'react';
import { Modal, Button, message } from 'antd';
import {CreatePostForm} from './CreatePostForm';
import {AUTH_HEADER, LOCATION_SHACKE, POS_KEY, root, TOKEN_KEY} from '../Constants';

/*
* create new post 的弹窗按钮和弹窗页面
* */
export class CreatePostButton extends React.Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {

        // 用refs获取到的Form Component之后调用validateFields
        this.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                this.setState({ // 没有err就显示按钮上面的小圈圈
                    confirmLoading: true,
                });
                const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
                const token = localStorage.getItem(TOKEN_KEY);
                const formData = new FormData(); // formdata 来管理上传文件.常用于含有图片视频这种上传内容的情况
                formData.set('lat', lat + LOCATION_SHACKE*Math.random()*2-LOCATION_SHACKE);
                formData.set('lon', lon + LOCATION_SHACKE*Math.random()*2-LOCATION_SHACKE); // location shake，让同一个位置post的在地图上相邻不同点
                formData.set('message', values.message);
                formData.set('image', values.image[0].originFileObj);
                fetch(`/api/post`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${AUTH_HEADER} ${token}`,
                    },
                    body: formData
                }).then((response) => {
                    if (response.ok) {
                        this.form.resetFields(); // 清空上传文件
                        this.setState({
                            confirmLoading: false,
                            visible: false,
                        });
                        /*这里在确认上传成功之后需要重新渲染gallery。也就是要调用Home.js中loadNearByPost()。
                        * .then()默认是返回一个立即resolve的promise。然而我们这里希望在重新请求发布内容的数据完成之后再message.success('Post created successfully')
                        * 所以我们这里return 一个传进来的loadNearByPosts函数。
                        * loadNearByPosts 本身return一个fetch，也就是一个Promise。这样就能保证下面的then接在loadNearByPosts执行完成之后*/
                        return this.props.load();
                    }
                    throw new Error(response.statusText);
                }).then(
                    () => {message.success('Post created successfully');}
                ).catch((e) => {
                    console.log(e);
                    this.setState({
                        confirmLoading: false,
                        visible: true,
                    });
                    message.error('Failed to create the post');
                });
            }
        });
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
    saveFormRef = (formInstance) => {
        this.form = formInstance; // 用ref 拿组件的实例。这样就可以接触到组件中的东西了. 这里拿到的是一个Form实例
    }
    render() {
        const { visible, confirmLoading, ModalText } = this.state;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Create New Post
                </Button>
                <Modal title="Create new post"
                       visible={visible}
                       onOk={this.handleOk}
                       okText="Create"
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                >
                    <CreatePostForm ref={this.saveFormRef}/>
                </Modal>
            </div>
        );
    }
}