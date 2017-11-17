import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import GPXParser from './loadgpx.js';
import GMap from './GMap.jsx';
import AqiComponent from './AqiComponent.jsx';
import FirePerimeterComponent from './FirePerimeterComponent.jsx';
import toGeoJSON from './lib/togeojson.js';


class GpxFileComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFileSelected : false,
      boundingBox : null
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

  drawGpx = (xml) => {
    if (xml !== null) {
      //Setup parser
      var parser = new GPXParser(xml, this.props.map);

      //prepare for draw, change state
      var fileBoundingBox = parser.centerAndZoom(xml);
      this.setState({ isFileSelected: true, boundingBox: fileBoundingBox});
      var geodraw = toGeoJSON.gpx(xml);
      geodraw.features[0].properties.name = "track";
      geodraw.features[0].properties.color = "red";

      console.log(geodraw);
      //this.props.map.data.addListener('addfeature', this.setFeatureColor.bind(this));
      
      this.props.map.data.addGeoJson(geodraw, {idPropertyName: "name"});
      var track = this.props.map.data.getFeatureById("track");
      this.setFeatureColor(track);
      console.log(track);

    }//if xml loaded
  }//drawGpx
  setFeatureColor = function (feature) {
    this.props.map.data.overrideStyle(feature, {strokeColor:feature.getProperty('color')});
  }
  handleChange = function(e, results) {
    console.log('OnChange Fired, results = ');
    console.log(results);
    results.forEach(result => {
      const [e, file] = result;
      console.log(`Successfully loaded ${file.name}!`);
    });
    //Plot gpx path
    this.loadGPXFileIntoGoogleMap(results);
  }//handleChange

  useTestData = function(e) {
    console.log('using test data from server');
    this.loadGPXUrlIntoGoogleMap("http://phillipdaw.com:3000/NorCalShastaOption.gpx");
  }

  componentDidMount() {
  }//componentDidMount

  render() {
    var toDisplay;
    var selectFile;
    if (this.state.isFileSelected == true) {
        selectFile = null;
	toDisplay = ( <div><AqiComponent boundingBox = {this.state.boundingBox}
			google = {this.props.google}
			map = {this.props.map}/> 
		      <FirePerimeterComponent boundingBox = {this.state.boundingBox}
			google = {this.props.google}
			map = {this.props.map} /></div>
			);
    }
    else {
      selectFile = (
        <form>
          <FileReaderInput as="text" id="gpx-file-input"
	      onChange={this.handleChange.bind(this)}>
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
