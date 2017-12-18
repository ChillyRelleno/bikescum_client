import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toGeoJSON from './lib/togeojson.js';
import Geobuf from 'geobuf';
import Pbf from 'pbf';
import config from './config.js'

class AqiComponent extends React.Component {

  static propTypes = {
    boundingBox: PropTypes.any,
    padding: PropTypes.number,
    apiKey: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    url: PropTypes.string,
    addToLegend: PropTypes.any
  };

  static defaultProps = {
    boundingBox: null,
    padding: 0.5,
    apiKey: "8B8927D2-B8C3-4371-8E5D-902C4A129469",
    date: new Date(),
    url: config.fireAqiServerUrl + ":" + config.fireAqiServerPort + "/testAqi.kml",
    addToLegend: null
  };

  constructor(props) {
    super(props);
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
    var testurl;
    if (this.boundingBox == "ALL") {
	testurl = config.fireAqiServerUrl + ":" + config.fireAqiServerPort +
		"/aqi/all"
    }
    else {
      var west = this.boundingBox[0] - this.props.padding, 
	south = this.boundingBox[1] - this.props.padding,
	 east = this.boundingBox[2] + this.props.padding,
        north = this.boundingBox[3] + this.props.padding;
      //var aqiapi = "http://www.airnowapi.org/aq/kml/Combined/?DATE=" + 
	//		this.props.date.getFullYear() + "-" + 
	//		(this.props.date.getMonth()+1) + "-" + 
	//		this.props.date.getDate() + "T06&BBOX=" +
	//		west + "," + south + "," + east + "," + north +
          //        "&SRS=EPSG:4326&API_KEY=" + this.props.apiKey;

      //console.log(aqiapi);

      var fireSeason = this.props.useFireSeasonData ? "fireSeason/" : "";
      //use test kml for development to avoid query limits
      testurl = config.fireAqiServerUrl + ":" + config.fireAqiServerPort + 
			"/filter/" + fireSeason + "aqi/" + west + "/" +
			south + "/" + east + "/" + north
    }
    //PreFiltered by bounds data at'http://phillipdaw.com:' + config.fireAqiServerPort + '/testAqi.kml';
    fetch(testurl)
        .then(response => response.arrayBuffer())
	.then(arrbuf => this.geobufToGeojson(arrbuf) )
        .then(geojson => this.useAqiData(geojson));
  }//getAqiData
  
  useAqiData(geojson) {
    this.props.map.data.addGeoJson(geojson, {idPropertyName: "name" });
    this.props.addToLegend("Air Quality",  geojson.properties.legend);

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
