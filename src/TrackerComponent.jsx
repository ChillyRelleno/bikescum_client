import React, {Fragment, Component } from 'react';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';
//import PositionComponent from './PositionComponent.jsx';
import Checkbox from './Checkbox.jsx';
import geobufFun from './lib/geobufFun.js'
import config from './config.js';
import GPX from './lib/gpx.js';

class TrackerComponent extends React.Component {
  //user = "";

  constructor(props) {
    super(props);
    this.state = {track : null};
    this.chaseMode = false;
    //TODO edit gpx.js to make sure duplicate event listeners arent added
    if (!this.GPX)  this.GPX = new GPX(this.props.map, this.props.google);

    this.json = null;
    this.markers = null;
    this.svgUrl = config.trackerServerUrl + ":" + config.trackerServerPort + "/circle.svg";
    this.routeUrl = config.trackerServerUrl + ":" + config.trackerServerPort + "/route/gpx";

    var positionDataUrl = "http://phillipdaw.com:" + config.trackerServerPort +
	"/track";
    var user = "";

    user = props.match.params.user;
    //console.log(this.user);
    this.url = positionDataUrl + "/" + user;
    //console.log(url);
    this.noNewData = false;
    this.getPositionData(this.url);

  }//constructor

  getPositionLoop = (url) => {
    var interval = 30000;
    this.timer = setInterval( ()=> { 
	  console.log('updating');
	  this.getPositionData(url); 
	}, interval);
  }

  getSvg (url) {
   if (!this.svg) {
    fetch(url)
	.then(response => response.text())
	.then(svg => this.updateMarkerIcons(svg))//document.body.insertAdjacentHTML("afterbegin", svg));
        //.then(response => this.updateMarkerIcons(response.body))
	.then (svg => {
	    if (!this.chaseMode) {
 var bounds = this.GPX.calcBounds({type:"FeatureCollection", features:this.json.features})
    //console.log("bounds " + bounds)
    //CENTER MAP
      var latlngBounds = new this.props.google.maps.LatLngBounds();
      latlngBounds.extend(new this.props.google.maps.LatLng({
                                lng:bounds[0], lat:bounds[1] }));
      latlngBounds.extend(new this.props.google.maps.LatLng({
                                lng:bounds[2], lat:bounds[3]}));

		this.props.map.fitBounds(latlngBounds, 50)

	    }
	})
   }
   else { this.updateMarkerIcons(this.svg); }
    //TODO move somewhere that makes sense and gets called once
    this.addOptionsDialogToControls();
  }
  updateMarkerIcons = (svg) => {
    //var parser = new DOMParser();
    //var doc = parser.parseFromString(svg, "image/svg+xml");
    if (!this.svg) { this.svg = 'data:image/svg+xml;utf-8, ' + svg; }
    this.markers.forEach((feature) => {
	//marker.setIcon(svg);
        var tempSvg = this.svg.replace('opacity="1.00"', 'opacity="'+feature.getProperty('opacity')+'"')
	
        this.props.map.data.overrideStyle(feature, 
		{icon: {url: tempSvg}});
		//, fillOpacity: feature.getProperty('opacity')});

		//{path:this.props.google.maps.SymbolPath.CIRCLE,//doc,	scale: 20}
	//});// svg});//url});
    });
  }
  componentDidMount() {
    var fd=document.getElementById("fileSelectDialog");
    fd.style.display = "none";
    //changeForm(fd);

    this.getPositionLoop(this.url)
  }

  changeForm(form) {
    while (form.lastChild) {
      form.removeChild(form.lastChild);
    }
    //form.addChild(
  }

  handleChaseModeChange = (isChecked) => {
    //this.setState({chaseMode: isChecked});
    this.chaseMode = isChecked;
  }

  render() {
    var floatStyle = { position: 'fixed', float: 'right' };

    var optionsDialog = (<form style={floatStyle} id="optionsDialog" className="mapControls">
                        <b><Checkbox label="Chase Mode (Auto-zoom)"
                                handleCheckboxChange={this.handleChaseModeChange}
                                style={{padding:"0px"}}
                                checked = {this.chaseMode}
                        /></b>
                      </form>
        );
     return optionsDialog;
  }

  addOptionsDialogToControls = () => {
    var position = this.props.google.maps.ControlPosition.BOTTOM_CENTER;
    //if (!this.GPX)  this.GPX = new GPX(this.props.map, this.props.google);

      var div = document.getElementById('optionsDialog')
      div.index = 1;
      this.props.map.controls[position].pop();//clear();
      this.props.map.controls[position].push(div)
  }


  usePositionData = (json) => {
   if (this.noNewData == false) {
    this.json = json;
    this.GPX.clearMap();

    this.markers =  this.props.map.data.addGeoJson(json);  
    this.getSvg(this.svgUrl);
    this.getRouteData(this.routeUrl);
    var bounds = this.GPX.calcBounds({type:"FeatureCollection", features:json.features.slice(0,json.features.length-1)})
    //console.log("bounds " + bounds)
    //CENTER MAP
      var latlngBounds = new this.props.google.maps.LatLngBounds();
      latlngBounds.extend(new this.props.google.maps.LatLng({
                                lng:bounds[0], lat:bounds[1] }));
      latlngBounds.extend(new this.props.google.maps.LatLng({
                                lng:bounds[2], lat:bounds[3]}));
      if (this.markers) {
	if (this.chaseMode) {
	  this.props.map.fitBounds(latlngBounds, 50)
	  //this.props.map.setZoom(this.props.map.getZoom()*0.6)
      }}
   }//!noNewData
  }
  getPositionData = (url) => {
    this.noNewData = true;
    fetch(url)
	.then((response) => {
	     if (typeof(response) == 'undefined') { return Promise.reject(); }
	     else if (response.status == 204) {return Promise.reject();}
	     else if (typeof(response.message)!== 'undefined') {
		if (response.message.indexOf("Unexpected end of input")!==-1)
		{ return Promise.reject(); }
	     }//if message not undefined
	     this.noNewData = false;
	     return response;
	     } 
	)
	.then(response => response.arrayBuffer())
        .then(arrbuf => geobufFun.geobufToGeojson(arrbuf) )
	.then(json => this.usePositionData(json))
	.catch(err => {})//console.log(err))
  }
  getRouteData (url) {
    if (!this.route) {
    //try {
      fetch (url)
	.then(response => response.arrayBuffer())
        .then(arrbuf => geobufFun.geobufToGeojson(arrbuf) )
	.then(json => this.useRouteData(json))
	.catch(err => {this.route = "none";})
	//.catch(err => this.route = 0)
     //} catch (e) {this.route = 0;}
    }
  }
  useRouteData(json) {
	console.log(json);
	this.route = json;
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
