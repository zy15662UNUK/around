import React from 'react'
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
import { AroundMarker } from './AroundMarker';
import {POS_KEY} from '../Constants'


class NormalAroundMap extends React.Component{
    reloadMarkers = () => {
    //    拖动图片的时候按照地图现在中心重新请求nearby posts
        const center = this.getCenter();
        const radius = this.getRadius();
        if (this.props.topic === 'around') {
            this.props.loadNearbyPost(center, radius);
        }else {
            this.props.loadFaces();
        }

    }
    // 获取this.map中的地图中心
    getCenter = () => {
        const center = this.map.getCenter();
        return { lat: center.lat(), lon: center.lng() };
    }
    getMapRef = (mapInstance) => {
        this.map = mapInstance; // google map instance 中有当前地图中心的性质。根据它重新获取
    }
    getRadius = () => {
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }


    render () {
        const { lat, lon:lng } = JSON.parse(localStorage.getItem(POS_KEY));
        return (
            <GoogleMap
                defaultZoom={11}
                defaultCenter={{ lat, lng }}
                onZoomChanged={this.reloadMarkers}
                onDragEnd={this.reloadMarkers}
                ref={this.getMapRef}
            >
                {this.props.posts.map((post) => <AroundMarker post={post} key={post.url}/>)}
            </GoogleMap>
        );
    }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));
//cannnot read property sphere。。这个问题是因为google map 链接cross origin导致的。googleMapURL必须严格使用教案上的