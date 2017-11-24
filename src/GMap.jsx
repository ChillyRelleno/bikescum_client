import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
//import MapMarker from './MapMarker.jsx';
import {K_SIZE} from './MapMarkerStyles.js';
import PropTypes from 'prop-types';
import GpxFileComponent from './GpxFileComponent.jsx';
import styles from './GMap.css'

class GMap extends React.Component {
  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    MapMarkerCoords: PropTypes.any,
    hasData: PropTypes.bool
  };

  static defaultProps = {
    center: {  lat: 45.5231,  lng: -122.9765 },
    zoom: 9,
    MapMarkerCoords: {lat: 45.5231, lng: -122.6765},
    hasData: false
  };


  constructor(props) {
    super(props);
    this.center = props.center;    
  }//constructor

  addFileDialogToControls = (props, map) => {
    var div = document.getElementById('fileSelectDialog')
    map.controls[this.props.google.maps.ControlPosition.BOTTOM_CENTER].push(div)
  }


  componentDidMount() {  }
  componentDidUpdate() { }
 
//          <div id="legend" style={legendStyle}> </div>

  render() {
    var floatStyle = {
        position: 'fixed', float: 'right'
        //position: 'absolute', top: '10px', left: '10px', zIndex: 99 
	};
    var mapStyle = { position: 'relative', height: '100%' , width: '100%', 
			padding: '0', margin: '0'};
    var mapContainerStyle = { position: 'relative', height: '100%', width: '100%',
			padding: '0', margin: '0'};

    return (
        <div id="mapContainer" >
	  <Map google={this.props.google} zoom={8} style={mapStyle}
	      initialCenter={this.props.center} onReady={this.addFileDialogToControls}>
            <GpxFileComponent as="text" id="gpx-file-input" style={floatStyle} />
	  </Map>
          <div id="legend" className="mapControls"> </div>
        </div>  

    );
  };
  //WORKS as center in render: initialCenter={{  lat: 45.5231,  lng: -122.9765 }}

  componentWillUnmount() {

  }
}//class

GMap.propTypes = {
 title: React.PropTypes.string,
 map_id: React.PropTypes.string
};

//export default GMap;
export default GoogleApiWrapper({
  apiKey: ("AIzaSyBIzV5zhdi5cuH6Qvd5w2k_ddsnKLuts_c")
})(GMap)


