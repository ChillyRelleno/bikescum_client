import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import GPXParser from './loadgpx.js';
import GMap from './GMap.jsx';
import AqiComponent from './AqiComponent.jsx';
import FirePerimeterComponent from './FirePerimeterComponent.jsx';
import toGeoJSON from './lib/togeojson.js';
import config from './config.js';

class GpxFileComponent extends React.Component {
  boundaryLine = null;
  constructor(props) {
    super(props);
    this.state = {
      isFileSelected : false,
      boundingBox : null,
      legend: new Array()
    };
    this.parseXml = this.chooseXmlParser();
  }//constructor

  loadGPXUrlIntoGoogleMap = ( url) => {
    fetch(url)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(xml => this.drawGpx(xml));
  }

  loadGPXFileIntoGoogleMap = (file) => {
    var data = file[0][0].target.result;
    var xml = this.parseXml(data);//$.parseXML(data);
    this.drawGpx(xml);
  }//loadGPXFileIntoGoogleMap

  clearMap = () => {
    //Clear map
    this.props.map.data.forEach((feature) => {    //function(feature) {
      this.props.map.data.remove(feature);
    });
    //Doesn't work for some reason?
    //this.clearBoundary();
  }

  drawGpx = (xml) => {
    if (xml !== null) {
      //Clear map
      this.clearMap();
      //this.props.map.data.forEach((feature) => {    //function(feature) {
	//this.props.map.data.remove(feature);
      //});

      //Setup parser
      var parser = new GPXParser(xml, this.props.map);

      //Set up event so features can color themselves
      this.props.map.data.addListener('addfeature', this.setFeatureStyle.bind(this));

      //prepare for draw, change state
      var fileBoundingBox = parser.centerAndZoom(xml);
      this.drawBoundary(fileBoundingBox);

      this.setState({ isFileSelected: true, boundingBox: fileBoundingBox});
      var geodraw = toGeoJSON.gpx(xml);
      geodraw.features[0].properties.name = "Track";
      geodraw.features[0].properties.color = "purple";

      this.drawBoundary(fileBoundingBox);

      this.legend = document.getElementById('legend');
      this.clearLegend();      
      this.addToLegend(geodraw.features[0].properties.name, 
			geodraw.features[0].properties.color);	

      this.props.map.data.addGeoJson(geodraw, {idPropertyName: "name"});

      var fileDialog = document.getElementById('fileSelectDialog')
      this.props.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].clear();
      this.props.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(fileDialog)

    }//if xml loaded
  }//drawGpx

  clearBoundary = () => {
    //Cut previous boundary line
    if (this.boundaryLine)
      this.boundaryLine.setMap(null);
  }

  drawBoundary = (boundingBox) => {
    //Now called in clearMap()---Cut previous boundary line
    this.clearBoundary();

    var northeast = boundingBox.getNorthEast();
    var southwest = boundingBox.getSouthWest();

    var pad = 0.5;
    var pathCoordinates = [ {lat: northeast.lat()+pad, lng: northeast.lng()+pad}, 
		{lat: southwest.lat()-pad, lng: northeast.lng()+pad},
                {lat: southwest.lat()-pad, lng: southwest.lng()-pad}, 
		{lat: northeast.lat()+pad, lng: southwest.lng()-pad},
                {lat: northeast.lat()+pad, lng: northeast.lng()+pad} ];
    var lineSymbol = {
	path: 'M 0,-1 0,1',
        strokeOpacity: 1,
	strokeColor: "green",
        scale: 4,
	strokeWeight: 1
      };
      this.boundaryLine = new this.props.google.maps.Polyline( {
	  path: pathCoordinates,
	  strokeOpacity: 0,
	  icons: [{ icon: lineSymbol, offset: '0', repeat: '20px' }],
	  map: this.props.map
      });
  }//drawBoundary

  setFeatureStyle = function (featureFeature) {
    var feature = featureFeature.feature;
    var style ={strokeColor:feature.getProperty('color'),
                fillColor: feature.getProperty('color'),
                fillOpacity: feature.getProperty('opacity')};
    this.props.map.data.overrideStyle(feature, style
     );
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
    this.loadGPXUrlIntoGoogleMap("http://phillipdaw.com:" + config.serverPort + 
	"/NorCalShastaOption.gpx");
  }

  componentDidMount() {
  }//componentDidMount


  clearLegend = () => {
    this.legend.innerHTML = "<h3>Legend</h3>";
    this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT].clear()
    this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.legend);
  }

  addToLegend = (name, color) => {
    var toAdd = [name, color];
    var div = document.createElement('div');
    div.innerHTML = 
        '<svg width="50" height="20" viewBox="0 0 50 20">' + 
	'<rect x="10" y="10" width="30" height="10" style="fill:'+color+'"/></svg>' 
			+ name
    this.legend.appendChild(div);

    var controls = 
	this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT].getArray().slice()
    controls.push(div)
  }

  render() {
    var toDisplay;
    var selectFile;
    var floatStyle = { position: 'fixed', float: 'right' };
    var fileDialog = (<form style={floatStyle} id="fileSelectDialog" className="mapControls">
                        <FileReaderInput as="text" id="gpx-file-input"
                          onChange={this.handleFile.bind(this)}>
                          <button type="button">Select a file!</button>
                        </FileReaderInput>
                        <button type="button" onClick={this.useTestData.bind(this)}>
				Use demo data</button>
                      </form>
	);


    if (this.state.isFileSelected == true) {
        selectFile = null;
	toDisplay = ( <div>
		      <AqiComponent boundingBox = {this.state.boundingBox}
			google = {this.props.google}
			map = {this.props.map}
			addToLegend={this.addToLegend}/> 
		      <FirePerimeterComponent boundingBox = {this.state.boundingBox}
			google = {this.props.google}
			map = {this.props.map} 
			addToLegend={this.addToLegend}/>
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
