import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import React, { Component } from 'react';
const GMAPIKEY = 'AIzaSyDrHsODQZr_cmpAAouZPySakfv4BY2bFdc';

// const mapStyles = {
//     position: 'relative',
//     width: '380px',
//     height: '590px'
// };

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
    };

    onMarkerClick = (props, marker, e) =>
    this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
    });

    onClose = props => {
        if (this.state.showingInfoWindow) {
        this.setState({
            showingInfoWindow: false,
            activeMarker: null
        });
        }
    };

    render() {
        return (
            <div style={{ position: 'absolute', height: '85%', width: '95%', }}>
            <Map google={this.props.google} zoom={14} style={{color: 'black'}}
                initialCenter={
                {
                    lat: this.props.lat,
                    lng: this.props.lng
                }
                }
            >
                <Marker
                    onClick={this.onMarkerClick}
                    name={'you are here'}
                />
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                <div>
                    <h4>{this.state.selectedPlace.name}</h4>
                </div>
                </InfoWindow>
            </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: GMAPIKEY
})(MapContainer);