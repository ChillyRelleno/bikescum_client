import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import GMap from './GMap.jsx';
import AqiComponent from './AqiComponent.jsx';
import FirePerimeterComponent from './FirePerimeterComponent.jsx';
import toGeoJSON from './lib/togeojson.js';
import config from './config.js';
import GeoBounds from 'geojson-bounds'
import Checkbox from './Checkbox.jsx';
//geobufFun == {geobufToGeojson, geojsonToGeobuf}
import geobufFun from './lib/geobufFun.js';
import Legend from './lib/legend.js';
import Boundary from './lib/boundary.js';
const util = require('util')


class GpxFileComponent extends React.Component {
  //boundaryLine = null;
  constructor(props) {
    super(props);
    this.state = {
      isFileSelected : false,
      boundingBox : null,
      legend: new Array()
    };
    this.parseXml = this.chooseXmlParser();
    this.state.useFireSeasonData = false;
  }//constructor

  loadGPXUrlIntoGoogleMap = ( url) => {
    fetch(url)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(xml => this.drawGpx(xml));
  }

  loadGeobufTrackIntoGoogleMap = (url) => {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrbuf => geobufFun.geobufToGeojson(arrbuf) )
        .then(geojson => this.drawGpx(geojson));

    //var json = geobufToGeojson(geobuf);
    //this.drawGpx(json);
  }//loadGeobufTrack


  loadGPXFileIntoGoogleMap = (file) => {
    var data = file[0][0].target.result;
    var xml = this.parseXml(data);//$.parseXML(data);
    var json = toGeoJSON.gpx(xml);
    this.drawGpx(json);
  }//loadGPXFileIntoGoogleMap

  clearMap = () => {
    //Clear map
    this.props.map.data.forEach((feature) => {    //function(feature) {
      this.props.map.data.remove(feature);
    });
    if (this.Boundary)  this.Boundary.clearBoundary();
  }

  featureClick = (event) => {
    var message, svg;
    if (event.feature.getProperty('type') == "AQI") {
      var lvl = event.feature.getProperty('styleUrl').charAt(1)
      var color = event.feature.getProperty('color');
      message = " Air particulate warning level " + lvl;
      svg = '<svg width="40" height="15" viewBox="0 0 40 15">' +
            '<rect x="0" y="5" width="40" height="10" style="fill:'+color+'"/></svg>'
    }//if aqi
    else if (event.feature.getProperty('type') == "Fire") {
      var name = event.feature.getProperty('name');
      var color = event.feature.getProperty('color');
      message = " FIRE: " + name;
      svg = '<svg width="40" height="15" viewBox="0 0 40 15">' +
            '<rect x="0" y="5" width="40" height="10" style="fill:'+color+'"/></svg>'
    }//else if fire
    else {//GPX
      console.log(event.feature);
      var color = event.feature.getProperty('color');
      var name = event.feature.getProperty('name');
      message = " Route";
      svg = '<svg width="40" height="15" viewBox="0 0 40 15">' +
            '<rect x="0" y="5" width="40" height="10" style="fill:'+color+'"/></svg>'
    }//else it's gotta be GPX

    if (!this.infoWindow) {
      this.infoWindow = new this.props.google.maps.InfoWindow();
    }//if
    else this.infoWindow.close();
    this.infoWindow.setContent(
            "<div style='width:auto;text-align: center; padding:0px;'>" +
            svg + message + "</div>");
    this.infoWindow.setPosition(event.latLng);
    this.infoWindow.open(this.props.map);
  }//feature click listener callback


  addListeners = () => {
   //MAP click
   this.props.map.addListener('click', (event) => {
     this.infoWindow.close();
   });
   //MAP dblclick
   this.props.map.addListener('dblclick', (event) => { this.infoWindow.close(); })
   this.props.map.data.addListener('dblclick', (event) =>{this.infoWindow.close();})

   //Feature click
   this.props.map.data.addListener('click', this.featureClick);//feature click listener callback

   //feature mouseover
   this.props.map.data.addListener('mouseover', (event) => {
     this.props.map.data.overrideStyle(event.feature, { strokeWeight: 6 });
   });//mouseover event

   //Feature mouseout
   this.props.map.data.addListener('mouseout', (event) => {
      this.props.map.data.overrideStyle(event.feature,
             { strokeWeight: 3 });
   });//mouseout event

  }//adListeners

  drawGpx = (json) => { //xml) => {
    if (json !== null) {
      //Clear map
      this.clearMap();
      if (this.infoWindow) this.infoWindow.close();
      //Setup parser
      var fileBoundingBox = GeoBounds.extent(json); //parser.centerAndZoom(xml);
	
      //Set up event so features can color themselves
      this.props.map.data.addListener('addfeature', this.setFeatureStyle.bind(this));

      this.addListeners();

      //prepare for draw, change state
      this.Boundary = new Boundary(this.props.map, this.props.google);
      this.Boundary.drawBoundary(fileBoundingBox);
      this.setState({ isFileSelected: true, boundingBox: fileBoundingBox});
	console.log(json);
      json.features[0].properties.name = "Track";
      json.features[0].properties.color = "purple";

      //LEGEND setup
      this.legend = new Legend(this.props.map, this.props.google);//document.getElementById('legend');
      this.legend.clearLegend();      
      this.legend.addToLegend(json.features[0].properties.name, 
			json.features[0].properties.color);	
      //Add GPX
      this.props.map.data.addGeoJson(json, {idPropertyName: "name"});

      //CENTER MAP
      var latlngBounds = new this.props.google.maps.LatLngBounds();
      latlngBounds.extend(new this.props.google.maps.LatLng({
				lng:fileBoundingBox[0], lat:fileBoundingBox[1] }));
      latlngBounds.extend(new this.props.google.maps.LatLng({
                                lng:fileBoundingBox[2], lat:fileBoundingBox[3]}));
      this.props.map.fitBounds(latlngBounds);//new this.props.google.maps.LatLngBounds());
      //Push file dialog onto controls, must clear first
      var fileDialog = document.getElementById('fileSelectDialog')
      this.props.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
      this.props.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(fileDialog)

    }//if xml loaded
  }//drawGpx

  setFeatureStyle = function (featureFeature) {
    var feature = featureFeature.feature;
    var style ={strokeColor:feature.getProperty('color'),
                fillColor: feature.getProperty('color'),
                fillOpacity: feature.getProperty('opacity')};
    var type = feature.getProperty('type');
    if (type == "Fire") style['zIndex'] = 99;
    else if (type == "AQI") {
	var zIndex = 0, increment = 10;
	zIndex += Number(String(feature.getProperty('styleUrl')).charAt(1)) * increment;
	style['zIndex'] = zIndex;
    }//AQI
    else style['zIndex'] = 50;
    this.props.map.data.overrideStyle(feature, style  );

  }
  handleFile = function(e, results) {
    results.forEach(result => {
      const [e, file] = result;
      console.log(`Successfully loaded ${file.name}!`);
    });
    //Plot gpx path
    this.loadGPXFileIntoGoogleMap(results);
  }//handleFile

  useTestData = function(e) {
    console.log('using test data from server');
    this.loadGeobufTrackIntoGoogleMap("http://phillipdaw.com:" + config.serverPort +
	"/getTestRoute");
  }

  componentDidMount() {
  }//componentDidMount

  //This callback is needed to facilitate communication between children
  addToLegend = (name, color) => {
	this.legend.addToLegend(name, color);
  }//addToLegend

  //This callback is needed to facilitate communication between children
  addAqiToLegend = (name, legendLiteral) => {
    this.legend.addAqiToLegend(name, legendLiteral);
  }//addAqiToLegend

  handleFireSeasonChange = (isChecked) => {
    this.setState({useFireSeasonData: isChecked});
  }//handlefireseasonchange

  render() {
    var toDisplay;
    var selectFile;
    var floatStyle = { position: 'fixed', float: 'right' };
    var fileDialog = (<form style={floatStyle} id="fileSelectDialog" className="mapControls">
                        <FileReaderInput as="text" id="gpx-file-input"
                          onChange={this.handleFile.bind(this)}>
                          <button type="button">Select GPX file</button>
                        </FileReaderInput>
                        <button type="button" onClick={this.useTestData.bind(this)}>
				Use demo GPX</button>
			<Checkbox label="Use Fire Season Data" 
				handleCheckboxChange={this.handleFireSeasonChange}
				style={{padding:"0px"}}
				checked = {this.state.useFireSeasonData}
			/>
                      </form>
	);


    if (this.state.isFileSelected == true) {
        selectFile = null;
	toDisplay = ( <div>
		      <AqiComponent boundingBox = {this.state.boundingBox}
			google = {this.props.google}
			map = {this.props.map}
			addToLegend={this.addAqiToLegend}
			useFireSeasonData = {this.state.useFireSeasonData}/> 
		      <FirePerimeterComponent boundingBox = {this.state.boundingBox}
			google = {this.props.google}
			map = {this.props.map} 
			addToLegend={this.addToLegend}
			useFireSeasonData = {this.state.useFireSeasonData}/>
		      {fileDialog}
		</div>
			);
    }
    else {
       toDisplay = fileDialog;
    }//else
      return toDisplay;
  }//render

  chooseXmlParser = function() {
    //Choose how to parse based on browser
    if (window.DOMParser) {
        return function(xmlStr) {
            return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
        return function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        return function() { return null; }
    }
  }//chooseXmlParser


}//component
export default GpxFileComponent;
