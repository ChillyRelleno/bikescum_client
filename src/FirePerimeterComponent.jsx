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
    var southwest = this.props.boundingBox.getSouthWest()
    var northeast = this.props.boundingBox.getNorthEast()
    var url = "http://phillipdaw.com:3000/filter/fire/" + southwest.lng().toFixed(4) + "/" +
          southwest.lat().toFixed(4) + "/" + northeast.lng().toFixed(4) + "/" + northeast.lat().toFixed(4)
    fetch(url)//'http://phillipdaw.com:3000/testFirePerimeters.kml')//url)
	.then(response => response.json())
        //.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(geojson => this.usePerimData((geojson)));//.bind(this));
	
  }//getAqiData
  
  usePerimData(geoDraw) {
    console.log(geoDraw);
    var geojson = {type: "FeatureCollection", features: geoDraw}
    this.props.map.data.addGeoJson(geojson, {idPropertyName: "name"});

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
