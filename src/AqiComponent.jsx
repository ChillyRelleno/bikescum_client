import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toGeoJSON from './lib/togeojson.js';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';
import Geobuf from 'geobuf';
import Pbf from 'pbf';

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
    //date: new Date(2017,9,18)
    date: new Date(),
    url: "http://phillipdaw.com:3000/testAqi.kml"
  };

  constructor(props) {
    super(props);

    //this.state = {boundingBox: this.props.boundingBox};
    this.boundingBox = this.props.boundingBox;
    this.getAqiData();
  }//constructor

  componentWillReceiveProps =(nextProps) => {
	this.boundingBox = nextProps.boundingBox;
	console.log(this.boundingBox);
	this.getAqiData();
	//this.setState({boundingBox: this.props.boundingBox})
	//  .then(function() {    	this.getAqiData(); });
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
    var aqiapi = "http://www.airnowapi.org/aq/kml/Combined/?DATE=" + this.props.date.getFullYear() + 
                  "-" + (this.props.date.getMonth()+1) + "-" + this.props.date.getDate() + "T06&BBOX=" +
                  west + "," + south + "," + east + "," + north +
                  "&SRS=EPSG:4326&API_KEY=" + this.props.apiKey;

    console.log(aqiapi);

    //use test kml for development to avoid query limits
    var testurl = "http://phillipdaw.com:3000/filter/aqi/" + west + "/" +
			south + "/" + east + "/" + north
    //PreFiltered by bounds data at'http://phillipdaw.com:3000/testAqi.kml';
    fetch(testurl)
        .then(response => response.arrayBuffer())
        //.then(response => response.json())
	.then(arrbuf => this.geobufToGeojson(arrbuf) )
	//.then(response => function() {console.log(response); return response})
        .then(geojson => this.useAqiData(geojson));//.bind(this));
  }//getAqiData
  
  useAqiData(geojson) {
    console.log("AQICOMPONENTJSX")
    console.log(geojson)
    //var geojson = {type: "FeatureCollection", features: geoDraw}
    this.props.map.data.addGeoJson(geojson, {idPropertyName: "name"});

    return geojson;
  }//useAqiData

  setFeatureStyle = function (feature) {
	//todo use feature styles from kml properties to highlight multiple intensities. Sample dataset has
	// only one intensity so I couldn't really test
    this.props.map.data.overrideStyle(feature, {strokeColor:"yellow", fillColor: "yellow", fillOpacity: 0.5});//feature.getProperty('color')});
    /*this.props.map.data.overrideStyle(feature, { strokeColor : "yellow",//feature.getProperty('color'), 
						fill: "yellow", //feature.getProperty('fill'),
						fillOpacity: 0.5,//feature.getProperty('fill-opacity'),
						strokeOpacity: feature.getProperty('stroke-opacity')
						});*/
  }

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
