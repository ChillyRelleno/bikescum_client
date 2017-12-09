import React, { Component } from 'react';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';
import { Marker } from 'google-maps-react';

class PositionComponent extends React.Component {

  constructor(props) {
    super(props);
//    this.state = {isFileSelected : false,  gpx : null};
  }//constructor

  render() {
    var pos = {lat: this.props.lat, lng: this.props.lng};
    return (<Marker name={this.props.time}
	      position={ pos } 
	      google={this.props.google}
		map={this.props.map}
		/> );
    //return null;
  }


//-------- Component Events --------//
  //componentWillMount() {}
  //componentDidMount() {}
  //componentWillReceiveProps() {}
  //shouldComponentUpdate() {}
  //componentWillUpdate() {}
  //componentDidUpdate() {}
  //componentWillUnmount() {}
  //componentDidCatch() {}


}//PositionComponent

export default PositionComponent;
