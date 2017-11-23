import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import GPXParser from './loadgpx.js';
import GMap from './GMap.jsx';
import AqiComponent from './AqiComponent.jsx';
import FirePerimeterComponent from './FirePerimeterComponent.jsx';
import toGeoJSON from './lib/togeojson.js';
import config from './config.js';

class GpxFileComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFileSelected : false,
      boundingBox : null,
      legend: new Array()
    };
    this.parseXml = this.chooseXmlParser();
    this.legend = document.getElementById('legend');
//this.props.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(this.legend);
    //console.log(props.map.controls)
    //props.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
    //props.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
    //props.map.controls[props.google.maps.ControlPosition.RIGHT_TOP].push(this.legend);

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


  drawGpx = (xml) => {
    if (xml !== null) {
      //Clear map
      this.props.map.data.forEach((feature) => {    //function(feature) {
	this.props.map.data.remove(feature);
      });

      //Setup parser
      var parser = new GPXParser(xml, this.props.map);

      //Set up event so features can color themselves
      this.props.map.data.addListener('addfeature', this.setFeatureStyle.bind(this));

      //prepare for draw, change state
      var fileBoundingBox = parser.centerAndZoom(xml);
      this.setState({ isFileSelected: true, boundingBox: fileBoundingBox});
      var geodraw = toGeoJSON.gpx(xml);
      geodraw.features[0].properties.name = "Track";
      geodraw.features[0].properties.color = "purple";

      this.clearLegend();      
//	if (this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT].length >0)
//	       this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT]
//			.splice(this.legend);
      this.addToLegend(geodraw.features[0].properties.name, 
			geodraw.features[0].properties.color);	

      //console.log(geodraw);
      //this.props.map.data.addListener('addfeature', this.setFeatureStyle.bind(this));
      
      this.props.map.data.addGeoJson(geodraw, {idPropertyName: "name"});
      //var track = this.props.map.data.getFeatureById("Track");
      //this.setFeatureColor(track);
      //console.log(track);

    }//if xml loaded
  }//drawGpx
  setFeatureStyle = function (featureFeature) {
    var feature = featureFeature.feature;
    var style ={strokeColor:feature.getProperty('color'),
                fillColor: feature.getProperty('color'),
                fillOpacity: feature.getProperty('opacity')};
    this.props.map.data.overrideStyle(feature, style
     );
  }
  handleFile = function(e, results) {
    console.log('OnChange Fired, results = ');
    console.log(results);
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
    //var legend = document.getElementById('legend');
    this.legend.innerHTML = "";

  }

  addToLegend = (name, color) => {
    //legend = document.getElementById('legend');
    var toAdd = [name, color];

    var div = document.createElement('div');
    div.innerHTML = 
         '<svg width="50" height="20" viewBox="0 0 50 20"><rect x="10" y="10" width="30" height="10" style="fill:'+color+'"/></svg>' 
			+ name
    this.legend.appendChild(div);

    //this.props.map.controls[google.maps.ControlPosition.RIGHT_TOP] = null;
  if (this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT] !== null)
    this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.legend);

    //var modLegend = this.state.legend.slice();
	//modLegend.push(toAdd);
   //this.setState(prevState => ({legend: [...prevState.legend, toAdd]}));
//{legend: this.state.legend.concat([toAdd])});
  }

  render() {
    var toDisplay;
    var selectFile;
	console.log(this.state.legend);

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
 		      <form style={floatStyle}>
     		        <FileReaderInput as="text" id="gpx-file-input"
            		  onChange={this.handleFile.bind(this)}>
            		  <button type="button">Select a file!</button>
          		</FileReaderInput>
          	        <button type="button" onClick={this.useTestData.bind(this)}>Use demo data</button>
                      </form>
</div>
			);
    }
    else {
      var floatStyle = {        position: 'fixed', float: 'right'
        //position: 'absolute', top: '10px', left: '10px', zIndex: 99
      };

      selectFile = (
        <form style={floatStyle}>
          <FileReaderInput as="text" id="gpx-file-input"
	      onChange={this.handleFile.bind(this)}>
            <button type="button">Select a file!</button>
          </FileReaderInput>
          <button type="button" onClick={this.useTestData.bind(this)}>Use demo data</button>
        </form>
       );
       toDisplay = selectFile;
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
