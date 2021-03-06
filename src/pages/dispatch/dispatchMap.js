import React, {Component} from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper, Polyline} from 'google-maps-react';
import { greenPin, redPin, pinYellow, pinBlue, pinGreen, pinOrange, pinBadVersion, pinAthena }from '../../assets/images/index';

export class DispatchMap extends Component {

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      activeMarker: {},
      showingInfoWindow: false,
      driver: {
        name: null,
        license: null,
        ping: null,
        version: {
          v: null,
          id: null
        },
      }
    };
  }

  componentDidUpdate() {
    const { pickup, dropoff, google } = this.props;
    if (pickup.lat && dropoff.lat) {
      this.bounds = new google.maps.LatLngBounds();
      this.bounds.extend({lat: pickup.lat, lng: pickup.lng});
      this.bounds.extend({lat: dropoff.lat, lng: dropoff.lng});
      this.mapRef.current.map.fitBounds(this.bounds);
    }
  }

  onMarkerClick = (driver, marker) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
    })
  };

  render() {
    const {
      handleMapClick,
      pickup,
      dropoff,
      dragMarker,
      track,
      availableDrivers,
      google
    } = this.props;
    const {
      activeMarker,
      showingInfoWindow,
      driver
    } = this.state;
    return (
      <Map
        style={{width: '97%', height: '96%'}}
        google={google}
        zoom={12}
        initialCenter={{
          lat: 40.7127,
          lng: -74.0059
        }}
        ref={this.mapRef}
        onClick={(e, marker, coord) => handleMapClick(e, marker,coord)}
      >

        {pickup && (
          <Marker
            key="0"
            icon={{
              url: greenPin,
            }}
            position={{lat: pickup.lat, lng: pickup.lng}}
            draggable
            onDragend={(event, marker, coord) => dragMarker(event, marker, coord, 0)}
          />
        )}

        {dropoff && (
          <Marker
            key="1"
            icon={{
              url: redPin,
            }}
            position={{lat: dropoff.lat, lng: dropoff.lng}}
            draggable
            onDragend={(event, marker, coord) => dragMarker(event, marker, coord, 1)}
          />
        )}

        <Polyline
          path={track}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
        />

        {availableDrivers.map((marker) => (
          <Marker
            key={marker.id}
            onClick={this.onMarkerClick}
            name={marker.full_name}
            ping={marker.ping}
            license={marker.vehicle_extra.license}
            version={marker.version}
            title={marker.driver_name}
            position={{lat: marker.loc.lat, lng: marker.loc.lon}}
            icon={{
              url: `${marker.athena_id != null ? pinAthena : marker.mode === "Booked" ? pinBlue : marker.mode ==="Arrived" ? pinOrange : (marker.vehicle_extra && marker.vehicle_extra.license && marker.vehicle_extra.license.length === 4) ? pinYellow : (marker.vehicle_extra && marker.vehicle_extra.license && marker.vehicle_extra.license.length === 5) ? pinGreen : pinBadVersion}`,
            }}
          />
        ))}
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
        >
          <div>
            Name: <b>{driver.name}</b> <br />
            LastOnline: <b>{driver.ping}</b> <br />
            License: <b>{driver.license}</b> <br />
            App Version: <b>V {driver.version && driver.version.v} ( {driver.version && driver.version.id} )</b>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyC5YIg8-Yk_zqjzWpFyZrgYuzzjTCBJV7k')
})(DispatchMap)