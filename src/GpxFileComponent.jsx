import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import GPXParser from './loadgpx.js';
import GMap from './GMap.jsx';
import AqiComponent from './AqiComponent.jsx';
import toGeoJSON from './lib/togeojson.js';


class GpxFileComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFileSelected : false,
      gpx : null,
      boundingBox : null
    };
    this.parseXml = this.chooseXmlParser();
  }//constructor

  loadGPXFileIntoGoogleMap = (map, file) => {
    var data = file[0][0].target.result;
    var xml = this.parseXml(data);//$.parseXML(data);
    if (xml !== null) {
      //Setup parser
      var parser = new GPXParser(xml, map);

      //prepare for draw, change state
      var fileBoundingBox = parser.centerAndZoom(xml);
      this.setState({gpx: parser, isFileSelected: true, boundingBox: fileBoundingBox});
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
  }//loadGPXFileIntoGoogleMap
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
    var parser = this.loadGPXFileIntoGoogleMap(this.props.map, results);
  }//handleChange

  componentDidMount() {
  }//componentDidMount

  render() {
    var toDisplay;
    var selectFile;
    if (this.state.isFileSelected == true) {
        selectFile = null;
	toDisplay = ( <AqiComponent boundingBox = {this.state.boundingBox}
			google = {this.props.google}
			map = {this.props.map}/> );
    }
    else {
      selectFile = (
        <form>
          <FileReaderInput as="text" id="gpx-file-input"
	      onChange={this.handleChange.bind(this)}>
            <button type="button">Select a file!</button>
          </FileReaderInput>
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
