import React from 'react';
import {InfoWindow, Marker} from "react-google-maps"
import blueMarkerUrl from '../assets/images/blue-marker.png'; // 给video换图标
/*之所以弄一个单独的组件是想让每一个marker有一个自己的state来控制显示
* 否则之前在AroundMap中都是由一个state控制的，这样点一个所有的window都会出现*/
export class AroundMarker extends React.Component{
    state = {isOpen: false,}
    toggleOpen = () => {
        this.setState((prevState) => {
            return {isOpen: !prevState.isOpen};
        });
    }
    render () {
        let {lat, lon:lng} = this.props.post;
        lat = parseFloat(lat);
        lng = parseFloat(lng);
        const {user, message, url, type} = this.props.post;
        const icon = type !== 'video' ? undefined : {
            url: blueMarkerUrl,
            scaledSize: new window.google.maps.Size(26, 41),
        }

        return (
            <Marker position={{lat, lng}}
                    onClick={type === 'video'?this.toggleOpen: null}
                    onMouseOver={type === 'video'?null: this.toggleOpen}
                    onMouseOut={type === 'video'?null: this.toggleOpen}
                    icon={icon}
            >
                {this.state.isOpen? (
                    <InfoWindow>
                        <div>
                            {type === 'video'? <video src={url} controls className="video-block"/>: <img src={url} alt={message} className="around-marker-image"/>}

                            <p>{`${user}: ${message}`}</p>
                        </div>

                    </InfoWindow>): null}
                {/*常见的条件渲染表达式*/}
            </Marker>
        );
    }
}