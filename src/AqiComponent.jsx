import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toGeoJSON from './lib/togeojson.js';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';

class AqiComponent extends React.Component {

  static propTypes = {
    boundingBox: PropTypes.any,
    padding: PropTypes.number,
    apiKey: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    geo: PropTypes.any
  };

  static defaultProps = {
    boundingBox: null,
    padding: 0.5,
    apiKey: "8B8927D2-B8C3-4371-8E5D-902C4A129469",
    //date: new Date(2017,9,18)
    date: new Date(),
    geo: null
  };

  constructor(props) {
    super(props);

    this.getAqiData();
    this.state = {geo : null};
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
                  "-" + (this.props.date.getMonth()+1) + "-" + this.props.date.getDate() + "T06&BBOX=" +
                  west + "," + south + "," + east + "," + north +
                  "&SRS=EPSG:4326&API_KEY=" + this.props.apiKey;

    console.log(aqiapi);

    fetch('http://phillipdaw.com:3000/testAqi.kml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(xml => this.useAqiData(xml));//.bind(this));
	
  }//getAqiData
  
  useAqiData(response) {
    var geoDraw = toGeoJSON.kml(response);
    geoDraw.features[0].properties.name = "aqi";
    geoDraw.features[0].properties.color = "yellow";
    //geoDraw.features[0].properties.fill-opacity = 0.5;
    response.geojson = geoDraw;
    this.setState({geo:geoDraw});
    this.props.map.data.addGeoJson(geoDraw, {idPropertyName: "name"});

    var aqi = this.props.map.data.getFeatureById("aqi");
    this.setFeatureStyle(aqi);

    return response;
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
    if (this.state.geo !== null)
	console.log(this.state.geo);
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
