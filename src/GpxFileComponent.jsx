import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import GPXParser from './loadgpx.js';
import GMap from './GMap.jsx';
import AqiComponent from './AqiComponent.jsx';

class GpxFileComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isFileSelected : false,
		  gpx : null,
		  boundingBox : null};

    //Choose how to parse based on browser
    if (window.DOMParser) {
        this.parseXml = function(xmlStr) {
            return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
        };
    } else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
        this.parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        this.parseXml = function() { return null; }
    }
  }//constructor

  loadGPXFileIntoGoogleMap = (map, file) => {
    var data = file[0][0].target.result;
    var xml = this.parseXml(data);//$.parseXML(data);
    if (xml !== null) {
      var parser = new GPXParser(xml, map);
      parser.setTrackColour("#ff0000");     // Set the track line colour
      parser.setTrackWidth(5);          // Set the track line width
      parser.setMinTrackPointDelta(0.001);      // Set the minimum distance between track points
      var fileBoundingBox = parser.centerAndZoom(xml);
      this.setState({gpx: parser, isFileSelected: true, boundingBox: fileBoundingBox});
      parser.addTrackpointsToMap();         // Add the trackpoints
      parser.addRoutepointsToMap();         // Add the routepoints
      parser.addWaypointsToMap();           // Add the waypoints

    }//if xml loaded
  }//loadGPXFileIntoGoogleMap

  //drawGPX = (file) => {
  //  var parser = this.loadGPXFileIntoGoogleMap(this.props.map, file);    
  //}//drawGPX

  handleChange = function(e, results) {
    console.log('OnChange Fired, results = ');
    console.log(results);
    results.forEach(result => {
      const [e, file] = result;
      console.log(`Successfully loaded ${file.name}!`);
    });
    //Plot gpx path
    var parser = this.loadGPXFileIntoGoogleMap(this.props.map, results);
    //this.drawGPX(results);//.bind(this);

    //Calculate bounds (or get from gpx lib)
    // --- stored in this.state.boundingbox ---
    //get AQI data within bounds

    //get fire boundary data 

    //cull fire boundary data within gpx bounds

  }

  componentDidMount() {
  }

  render() {
    var toDisplay;
    var selectFile;
    if (this.state.isFileSelected == true) {
        selectFile = null;
	toDisplay = ( <AqiComponent boundingBox = {this.state.boundingBox}/> );
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
  }
}
export default GpxFileComponent;
 /*
          <label htmlFor="my-file-input">Upload a File:</label>

            onChange={(evt, results) => this.handleChange(evt, results).bind(this)}>
*/
