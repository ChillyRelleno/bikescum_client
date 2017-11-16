import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
//import MapMarker from './MapMarker.jsx';
//import shouldPureComponentUpdate from 'react-pure-render/function';
//import PureComponent from 'react-pure-render/component';
import {K_SIZE} from './MapMarkerStyles.js';
import PropTypes from 'prop-types';
import FileInput from './FileInputClass.jsx';
//import google-maps from 'google-maps';
//import FileReaderInput from 'react-file-reader-input';


class GMap extends React.Component {
  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    MapMarkerCoords: PropTypes.any,
    hasData: PropTypes.bool
  };

  static defaultProps = {
    center: [59.938043, 30.337157],
    zoom: 9,
    MapMarkerCoords: {lat: 45.5231, lng: -122.6765},
    hasData: false
  };


  constructor(props) {
    super(props);
    this.center = props.center;    
  }//constructor


  componentDidMount() {  };
  componentDidUpdate() { };
 

  render() {
    var floatStyle = {
        position: 'absolute', top: '10px', left: '10px', zIndex: 99 
	};
    var mapStyle = { position: 'relative', height: '92%', width: '95%'};
    return (
        <div id="map">
	  <Map google = {this.props.google} zoom={8} style={mapStyle}>
            <FileInput as="text" id="gpx-file-input" style={floatStyle} />
	  </Map>
        </div>  

    );
  };

  componentWillUnmount() {

  }
}//class

GMap.propTypes = {
 title: React.PropTypes.string
 ,map_id: React.PropTypes.string
 // data: React.PropTypes.object
 //,domain: React.PropTypes.object
};

//export default GMap;
export default GoogleApiWrapper({
  apiKey: ("AIzaSyBIzV5zhdi5cuH6Qvd5w2k_ddsnKLuts_c")
})(GMap)

   /* <GoogleMapReact 
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        bootstrapURLKeys={{
          key:"AIzaSyBIzV5zhdi5cuH6Qvd5w2k_ddsnKLuts_c"
        }}
        style={{height:"100px"}}
        center={this.props.center}
        zoom={8}
        hoverDistance={K_SIZE/2}
//        distanceToMouse={this._distanceToMouse}
      >
      <MapMarker
          lat={45.5231}
          lng={-122.9765}
          text={'Hipsters'}
        />
        </FileInput>

      </GoogleMapReact>
*/

