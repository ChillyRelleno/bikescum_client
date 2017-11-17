import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toGeoJSON from './lib/togeojson.js';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';

class FirePerimeterComponent extends React.Component {

  static propTypes = {
    boundingBox: PropTypes.any,
    padding: PropTypes.number,
    //apiKey: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    url: PropTypes.string
  };

  static defaultProps = {
    boundingBox: null,
    padding: 0.5,
    //apiKey: "8B8927D2-B8C3-4371-8E5D-902C4A129469",
    //date: new Date(2017,9,18)
    date: new Date(),
    url: 'http://phillipdaw.com:3000/testFirePerimeters.kml'
  };

  constructor(props) {
    super(props);

    this.getPerimData();
    this.state = {geo : null};
  }//constructor

  getPerimData() {
    fetch(this.props.url)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(xml => this.usePerimData(xml));//.bind(this));
	
  }//getAqiData
  
  usePerimData(response) {
    var geoDraw = toGeoJSON.kml(response);
    geoDraw.features[0].properties.name = "fire";
    geoDraw.features[0].properties.color = "red";
    //geoDraw.features[0].properties.fill-opacity = 0.5;
    //response.geojson = geoDraw;
    //this.setState({geo:geoDraw});
    this.props.map.data.addGeoJson(geoDraw, {idPropertyName: "name"});

    var fire = this.props.map.data.getFeatureById("fire");
    this.setFeatureStyle(fire);

    return response;
  }//useAqiData

  setFeatureStyle = function (feature) {
	//todo use feature styles from kml properties to highlight multiple intensities. Sample dataset has
	// only one intensity so I couldn't really test
    this.props.map.data.overrideStyle(feature, {strokeColor:"red", fillColor: "red", fillOpacity: 0.5, strokeOpacity: 0.25});//feature.getProperty('color')});
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


}//FirePerimeterComponent

export default FirePerimeterComponent;
