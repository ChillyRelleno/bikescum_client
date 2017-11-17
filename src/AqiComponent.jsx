import React, { Component } from 'react';
import PropTypes from 'prop-types';
import togeojson from './lib/togeojson.js';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';

class AqiComponent extends React.Component {

  static propTypes = {
    boundingBox: PropTypes.any,
    padding: PropTypes.number,
    apiKey: PropTypes.string,
    date: PropTypes.instanceOf(Date)
  };

  static defaultProps = {
    boundingBox: null,
    padding: 0.5,
    apiKey: "8B8927D2-B8C3-4371-8E5D-902C4A129469",
    date: new Date(2017,9,18)
    //date: Date.now();
  };

  constructor(props) {
    super(props);

    this.getAqiData();
    //this.state = {isFileSelected : false, gpx : null};
  }//constructor

  getAqiData() {
    var southwest = this.props.boundingBox.getSouthWest();
    var northeast = this.props.boundingBox.getNorthEast();

    //Ad some padding
    var west = southwest.lng() - this.props.padding;
    var south = southwest.lat() - this.props.padding;
    var east = northeast.lng() + this.props.padding;
    var north = northeast.lat() + this.props.padding;

    var aqiapi = "http://www.airnowapi.org/aq/kml/Combined/?DATE=" + this.props.date.getFullYear() + 
                  "-" + this.props.date.getMonth() + "-" + this.props.date.getDay() + "T06&BBOX=" +
                  west + "," + south + "," + east + "," + north +
                  "&SRS=EPSG:4326&API_KEY=" + this.props.apiKey;

    console.log(aqiapi);
  }//getAqiData

  render() {
    return null;
  }//render


//-------- Component Events --------//
  //componentWillMount() {}
  //componentDidMount() {}
  //componentWillReceiveProps() {}
  //shouldComponentUpdate() {}
  //componentWillUpdate() {}
  //componentDidUpdate() {}
  //componentWillUnmount() {}
  //componentDidCatch() {}


}//AqiComponent

export default AqiComponent;
