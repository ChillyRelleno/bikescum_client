import React, {Fragment, Component } from 'react';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';
//import PositionComponent from './PositionComponent.jsx';
import geobufFun from './lib/geobufFun.js'
import config from './config.js';
import GPX from './lib/gpx.js';

class TrackerComponent extends React.Component {
  //user = "";

  constructor(props) {
    super(props);
    this.state = {track : null};

    //TODO edit gpx.js to make sure duplicate event listeners arent added
    if (!this.GPX)  this.GPX = new GPX(this.props.map, this.props.google);

    this.json = null;
    this.markers = null;
    this.svgUrl = "http://phillipdaw.com:" + config.serverPort + "/circle.svg";
    this.routeUrl = "http://phillipdaw.com:" + config.serverPort + "/route/gpx";

    var positionDataUrl = "http://phillipdaw.com:" + config.serverPort +
	"/track";
    var user = "";

    user = props.match.params.user;
    //console.log(this.user);
    var url = positionDataUrl + "/" + user;
    console.log(url);
    this.getPositionData(url);
  }//constructor

  getSvg (url) {
    fetch(url)
	.then(response => response.text())
	.then(svg => this.updateMarkerIcons(svg))//document.body.insertAdjacentHTML("afterbegin", svg));
        //.then(response => this.updateMarkerIcons(response.body))
    //this.updateMarkerIcons(url);
  }
  updateMarkerIcons(svg) {
    //var parser = new DOMParser();
    //var doc = parser.parseFromString(svg, "image/svg+xml");
    svg = 'data:image/svg+xml;utf-8, ' + svg;
    this.markers.forEach((feature) => {
	//marker.setIcon(svg);
        
        this.props.map.data.overrideStyle(feature, {icon: {url: svg}});

		//{path:this.props.google.maps.SymbolPath.CIRCLE,//doc,	scale: 20}
	//});// svg});//url});
    });
  }
  componentDidMount() {
    var fd=document.getElementById("fileSelectDialog");
    fd.style.display = "none";
  }


  render() {
    //var toDisplay = ( <div> {this.state.track} </div> )
    //var toDisplay = this.state.track
    //console.log(toDisplay);
//    if (toDisplay !== null)
//	return  (<React.Fragment> {toDisplay} </React.Fragment>);
     return null;
  }

  usePositionData (json) {
    this.json = json;
    this.markers =  this.props.map.data.addGeoJson(json);  
    this.getSvg(this.svgUrl);
    this.getRouteData(this.routeUrl);
    //console.log(this.markers);
    //NEED TO EDIT GPX.JS SO THAT IT CAN BE INCLUDED IN TWO FILES WITHOUT
    //console.log(json);
  }
  getPositionData (url) {
    fetch(url)
	.then(response => response.arrayBuffer())
        .then(arrbuf => geobufFun.geobufToGeojson(arrbuf) )
	.then(json => this.usePositionData(json))
  }
  getRouteData (url) {
    fetch (url)
	.then(response => response.arrayBuffer())
        .then(arrbuf => geobufFun.geobufToGeojson(arrbuf) )
	.then(json => this.useRouteData(json))
  }
  useRouteData(json) {
	console.log(json);
	//this.props.data.addGeoJson(json);
	this.GPX.drawGpx(json, false);
  }

//-------- Component Events --------//
  //componentWillMount() {}
  //componentWillReceiveProps() {}
  //shouldComponentUpdate() {}
  //componentWillUpdate() {}
  //componentDidUpdate() {}
  //componentWillUnmount() {}
  //componentDidCatch() {}


}//AqiComponent

export default TrackerComponent;
