import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toGeoJSON from './lib/togeojson.js';
import Geobuf from 'geobuf';
import Pbf from 'pbf';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';
import config from './config.js';

class FirePerimeterComponent extends React.Component {

  static propTypes = {
    boundingBox: PropTypes.any,
    padding: PropTypes.number,
    //apiKey: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    url: PropTypes.string,
    addToLegend: PropTypes.any
  };

  static defaultProps = {
    boundingBox: null,
    padding: 0.5,
    //apiKey: "8B8927D2-B8C3-4371-8E5D-902C4A129469",
    //date: new Date(2017,9,18)
    date: new Date(),
    url: 'http://phillipdaw.com:" + config.serverPort + "/testFirePerimeters.kml',
    addToLegend: null
  };

  constructor(props) {
    super(props);

    this.boundingBox = this.props.boundingBox;
    this.getPerimData();
    this.state = {geo : null};
  }//constructor

  componentWillReceiveProps =(nextProps) => {
     if (nextProps.boundingBox !== this.props.boundingBox) {
        this.boundingBox = nextProps.boundingBox;
        this.getPerimData();
        //this.setState({boundingBox: this.props.boundingBox})
        //  .then(function() {          this.getAqiData(); });
     }
  }//componentWillReceiveProps()

  geobufToGeojson = function(geobuf) { 
    return Geobuf.decode( new Pbf(geobuf) );
  }

  getPerimData() {
    //var southwest = this.boundingBox.getSouthWest()
    //var northeast = this.boundingBox.getNorthEast()
    //Ad some padding
    //var west = southwest.lng() - this.props.padding;
    //var south = southwest.lat() - this.props.padding;
    //var east = northeast.lng() + this.props.padding;
    //var north = northeast.lat() + this.props.padding;
    var west = this.boundingBox[0] - this.props.padding,
        south = this.boundingBox[1] - this.props.padding,
         east = this.boundingBox[2] + this.props.padding,
        north = this.boundingBox[3] + this.props.padding;

    var url = "http://phillipdaw.com:" + config.serverPort + "/filter/fire/" + 
		west + "/" + south + "/" + east + "/" + north;
		//southwest.lng().toFixed(4) + "/" + southwest.lat().toFixed(4) + 
		//"/" + northeast.lng().toFixed(4) + "/" + northeast.lat().toFixed(4);
    fetch(url)
	.then(response => response.arrayBuffer())
	.then(arrbuf => this.geobufToGeojson(arrbuf) )
        .then(geojson => this.usePerimData((geojson)));
	
  }//getAqiData
  
  usePerimData(geoDraw) {
    //console.log(geoDraw);
    this.props.addToLegend("Fire Perimeters", geoDraw.features[0].properties.color);
    this.props.map.data.addGeoJson(geoDraw, {idPropertyName: "name"});
    
    return geoDraw;
  }//useAqiData

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
