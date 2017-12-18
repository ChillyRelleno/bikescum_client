import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import PropTypes from 'prop-types';
import GpxFileComponent from './GpxFileComponent.jsx';
import styles from './GMap.css';
import config from './config.js';
import TrackerComponent from './TrackerComponent.jsx';
import AqiComponent from './AqiComponent.jsx';
import FirePerimeterComponent from './FirePerimeterComponent.jsx';
import Legend from './lib/legend.js';
import GPX from './lib/gpx.js';
//import PositionComponent from './PositionComponent.jsx';
//import ReactTimeout from 'react-timeout'

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
  mapReady = (map, position) => { 
    //this.props.setTimeout(()=>{ 
    this.setState({mapReady: true});// },1000);
    var div = document.getElementById('fileSelectDialog');
      map.controls[position].clear();
      map.controls[position].push(div);
    //LEGEND setup
    this.legend = new Legend(this.map, this.props.google);//document.getElementById('legend');
    this.legend.clearLegend();
    this.GPX = new GPX(this.map, this.props.google);
  }

  constructor(props) {
    super(props);
    this.center = props.center;    
    this.state = {mapReady: false, legend: new Array() };

  }//constructor

  addFileDialogToControls = (props, map) => {
    this.map = map;
    var position = this.props.google.maps.ControlPosition.BOTTOM_CENTER;
    if (map.controls[position].length == 0) { 
      this.mapReady(map, position);
    }//if
  }

  componentDidMount() { 
	document.title = "Ride On Fire!";
	//this.setState({mapReady: true});
 }
  //componentWillReceiveProps(next, old) {
  //	if (next.mapReady == "true")
  //		this.setState({mapReady: true});
  //}
  componentDidUpdate() { 

  }
  //This callback is needed to facilitate communication between children
  addToLegend = (name, color) => {
        this.legend.addToLegend(name, color);
  }//addToLegend
  //This callback is needed to facilitate communication between children
  addAqiToLegend = (name, legendLiteral) => {
    this.legend.addAqiToLegend(name, legendLiteral);
  }//addAqiToLegend
 
  render() {
    var floatStyle = {
        position: 'fixed', float: 'right'
        //position: 'absolute', top: '10px', left: '10px', zIndex: 99 
	};
    var mapStyle = { position: 'relative', height: '100%' , width: '100%', 
			padding: '0', margin: '0'};
    var mapContainerStyle = { position: 'relative', height: '100%', width: '100%',
			padding: '0', margin: '0'};
    var trackerJsx = null, allPerimeters=null;
    if (this.state.mapReady == true) {
	trackerJsx = (
            <Route path='/track/:user'
                render={(props) => <TrackerComponent {...props} google={this.props.google}
                                        map={this.map} />} />
	);
	allPerimeters = (
	  <Route path='/fireMap' render = { (props) =>
		<div>
		  <FirePerimeterComponent {...props} boundingBox="ALL"
			google = {this.props.google}
                        map = {this.map}
                        addToLegend={this.addToLegend}/>
                  <AqiComponent {...props} boundingBox="ALL"
                        google = {this.props.google}
                        map = {this.map}
                        addToLegend={this.addAqiToLegend}/>
		</div> }/>
	);
    }
    return (
        <div id="mapContainer" >
	  <Map google={this.props.google} zoom={8} style={mapStyle}
	      initialCenter={this.props.center} onReady={this.addFileDialogToControls}>
            <GpxFileComponent as="text" id="gpx-file-input" style={floatStyle} />
	    {trackerJsx}
	    {allPerimeters}
	  </Map>
        </div>  

    );
  };
//		component={TrackerComponent} />
//          <div id="legend" className="mapControls lowMargin"> </div>
//<Map ... onReady={this.addFileDialogToControls}>

  //WORKS as center in render: initialCenter={{  lat: 45.5231,  lng: -122.9765 }}

  componentWillUnmount() {

  }
}//class

GMap.propTypes = {
 title: PropTypes.string,
 map_id: PropTypes.string
};

//export default GMap;
export default GoogleApiWrapper({
  apiKey: (config.googleMapsApiKey)//("AIzaSyBIzV5zhdi5cuH6Qvd5w2k_ddsnKLuts_c")
})(GMap)


