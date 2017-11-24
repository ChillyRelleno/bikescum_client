import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toGeoJSON from './lib/togeojson.js';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';
import Geobuf from 'geobuf';
import Pbf from 'pbf';
import config from './config.js'

class AqiComponent extends React.Component {

  static propTypes = {
    boundingBox: PropTypes.any,
    padding: PropTypes.number,
    apiKey: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    url: PropTypes.string
  };

  static defaultProps = {
    boundingBox: null,
    padding: 0.5,
    apiKey: "8B8927D2-B8C3-4371-8E5D-902C4A129469",
    date: new Date(),
    url: "http://phillipdaw.com:" + config.serverPort + "/testAqi.kml"
  };

  constructor(props) {
    super(props);
    //this.state = {boundingBox: this.props.boundingBox};
    this.boundingBox = this.props.boundingBox;
    this.getAqiData();
  }//constructor

  componentWillReceiveProps =(nextProps) => {
     if (nextProps.boundingBox !== this.props.boundingBox) {
	this.boundingBox = nextProps.boundingBox;
	this.getAqiData();
      }//if
  }//componentWillReceiveProps()

 geobufToGeojson = function(geobuf) {
   return Geobuf.decode( new Pbf(geobuf) );
 }

  getAqiData() {
    var southwest = this.boundingBox.getSouthWest();
    var northeast = this.boundingBox.getNorthEast();

    //Ad some padding
    var west = southwest.lng() - this.props.padding;
    var south = southwest.lat() - this.props.padding;
    var east = northeast.lng() + this.props.padding;
    var north = northeast.lat() + this.props.padding;
    var aqiapi = "http://www.airnowapi.org/aq/kml/Combined/?DATE=" + 
			this.props.date.getFullYear() + "-" + 
			(this.props.date.getMonth()+1) + "-" + 
			this.props.date.getDate() + "T06&BBOX=" +
			west + "," + south + "," + east + "," + north +
                  "&SRS=EPSG:4326&API_KEY=" + this.props.apiKey;

    console.log(aqiapi);

    //use test kml for development to avoid query limits
    var testurl = "http://phillipdaw.com:" + config.serverPort + 
			"/filter/aqi/" + west + "/" +
			south + "/" + east + "/" + north
    //PreFiltered by bounds data at'http://phillipdaw.com:' + config.serverPort + '/testAqi.kml';
    fetch(testurl)
        .then(response => response.arrayBuffer())
	.then(arrbuf => this.geobufToGeojson(arrbuf) )
        .then(geojson => this.useAqiData(geojson));
  }//getAqiData
  
  useAqiData(geojson) {
    this.props.map.data.addGeoJson(geojson, {idPropertyName: "name"});
    return geojson;
  }//useAqiData

  render() {
    return null;
  }//render


//-------- Component Events --------//
  //componentWillMount() {}
  //componentDidMount() {}
  //componentWillReceiveProps() {}
  //shouldComponentUpdate() {}
  //componentWillUpdate =() => {}
  //componentDidUpdate() {}
  //componentWillUnmount() {}
  //componentDidCatch() {}


}//AqiComponent

export default AqiComponent;
