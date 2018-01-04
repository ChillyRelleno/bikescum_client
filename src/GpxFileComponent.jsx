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
import GPX from './lib/gpx.js';
import { Link } from 'react-router-dom';
const util = require('util')


class GpxFileComponent extends React.Component {
  //boundaryLine = null;
  constructor(props) {
    super(props);
    this.state = {
      isFileSelected : false,
      boundingBox : null,
      legend: new Array(),
      useFireSeasonData: false,
      chaseMode: true
    };
    this.parseXml = this.chooseXmlParser();
    //this.state.useFireSeasonData = false;
    //this.GPX = new GPX(this.props.map, this.props.google);
    
  }//constructor
  

  addFileDialogToControls = () => {
    var position = this.props.google.maps.ControlPosition.BOTTOM_CENTER;
    if (!this.GPX)  this.GPX = new GPX(this.props.map, this.props.google);
    
//    if (this.props.map.controls[this.props.google.maps.ControlPosition.BOTTOM_CENTER].length == 0) {
      var div = document.getElementById('fileSelectDialog')
      div.index = 1;
      this.props.map.controls[position].pop();//clear();
      this.props.map.controls[position].push(div)
//    }//if
  }


  draw = (data) => {
    if (!this.GPX)  this.GPX = new GPX(this.props.map, this.props.google);
//var fileDialog = document.getElementById('fileSelectDialog')
//this.props.map.controls[this.props.google.maps.ControlPosition.BOTTOM_CENTER].clear();

    var data = this.GPX.drawGpx(data);

    var fileBoundingBox = data.fileBoundingBox;
    this.legend = data.legend;
    this.setState({ isFileSelected: true, boundingBox: fileBoundingBox});
    this.addFileDialogToControls();
  }

  loadGPXUrlIntoGoogleMap = ( url) => {
    fetch(url)
      .then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(xml => this.draw(xml));
  }

  loadGeobufTrackIntoGoogleMap = (url) => {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrbuf => geobufFun.geobufToGeojson(arrbuf) )
        .then(geojson => this.draw(geojson));
  }//loadGeobufTrack


  loadGPXFileIntoGoogleMap = (file) => {
    var data = file[0][0].target.result;
    var xml = this.parseXml(data);//$.parseXML(data);
    var json = toGeoJSON.gpx(xml);
    this.draw(json);
  }//loadGPXFileIntoGoogleMap

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
    this.loadGeobufTrackIntoGoogleMap(config.fireAqiServerUrl + ":"  + config.fireAqiServerPort +
	"/getTestRoute");
  }

  componentWillReceiveProps(nextProps) {
//     if (!this.GPX)  this.GPX = new GPX(nextProps.map, nextProps.google);//this.props.map, this.props.google);

  //  this.GPX.addFileDialogToControls();
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
  handleChaseModeChange = (isChecked) => {
    this.setState({chaseMode: isChecked});
  }
  render() {
    var toDisplay;
    var selectFile, fileDialog;
    var floatStyle = { position: 'fixed', float: 'right' };
/*    if (this.props.location.pathname.indexOf("track") != -1) {
      fileDialog = (<form style={floatStyle} id="fileSelectDialog" className="mapControls">
                        <Checkbox label="Chase Mode (Auto-zoom)"
                                handleCheckboxChange={this.handleChaseModeChange}
                                style={{padding:"0px"}}
                                checked = {this.state.chaseMode}
                        />
                      </form>
        );

    }
    else {*/
      fileDialog = (<form style={floatStyle} id="fileSelectDialog" className="mapControls">
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
			<Link to='/track/phil'></Link>
                      </form>
	);
    

    if (this.state.isFileSelected == true) {
        selectFile = null;
	toDisplay = ( <div>
		      {fileDialog}
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
