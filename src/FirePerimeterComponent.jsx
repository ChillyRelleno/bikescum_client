import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toGeoJSON from './lib/togeojson.js';
import Geobuf from 'geobuf';
import Pbf from 'pbf';
import config from './config.js';

class FirePerimeterComponent extends React.Component {

  static propTypes = {
    boundingBox: PropTypes.any,
    padding: PropTypes.number,
    date: PropTypes.instanceOf(Date),
    url: PropTypes.string,
    addToLegend: PropTypes.any
  };

  static defaultProps = {
    boundingBox: null,
    padding: 0.5,
    date: new Date(),
    url: config.fireAqiServerUrl +":" + config.fireAqiServerPort + "/testFirePerimeters.kml",
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
     }
  }//componentWillReceiveProps()

  geobufToGeojson = function(geobuf) { 
    return Geobuf.decode( new Pbf(geobuf) );
  }

  getPerimData() {
    var url;
    if (this.boundingBox == "ALL") {
	url =  config.fireAqiServerUrl+ ":" + config.fireAqiServerPort + "/fire/all"
    }
    else {
      var west = this.boundingBox[0] - this.props.padding,
         south = this.boundingBox[1] - this.props.padding,
         east = this.boundingBox[2] + this.props.padding,
         north = this.boundingBox[3] + this.props.padding;

      var fireSeason = this.props.useFireSeasonData ? "fireSeason/" : "";
      url = config.fireAqiServerUrl+ ":" + config.fireAqiServerPort + "/filter/" + fireSeason + 
	"fire/" + 
		west + "/" + south + "/" + east + "/" + north;
		//southwest.lng().toFixed(4) + "/" + southwest.lat().toFixed(4) + 
		//"/" + northeast.lng().toFixed(4) + "/" + northeast.lat().toFixed(4);
    }
    fetch(url)
	.then(response => response.arrayBuffer())
	.then(arrbuf => this.geobufToGeojson(arrbuf) )
        .then(geojson => this.usePerimData((geojson)));
	
  }//getAqiData
  
  usePerimData(geoDraw) {
    //console.log(geoDraw);
    if (geoDraw.features.length > 0) {
      this.props.addToLegend("Fire Perimeters", geoDraw.features[0].properties.color);
      this.props.map.data.addGeoJson(geoDraw, {idPropertyName: "name"});
    }
    
    return geoDraw;
  }//useAqiData

  render() {
    //if (this.state.geo !== null)
	//console.log(this.state.geo);
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
