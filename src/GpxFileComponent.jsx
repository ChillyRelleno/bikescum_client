import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import GPXParser from './loadgpx.js';
import GMap from './GMap.jsx';
import AqiComponent from './AqiComponent.jsx';
import FirePerimeterComponent from './FirePerimeterComponent.jsx';
import toGeoJSON from './lib/togeojson.js';
import config from './config.js';
import Geobuf from 'geobuf';
import Pbf from 'pbf';
import GeoBounds from 'geojson-bounds'


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

  geobufToGeojson = function(geobuf) {
    return Geobuf.decode( new Pbf(geobuf) );
  }

  loadGeobufTrackIntoGoogleMap = (url) => {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrbuf => this.geobufToGeojson(arrbuf) )
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
    //Doesn't work for some reason?
    //this.clearBoundary();
  }

  drawGpx = (json) => { //xml) => {
    if (json !== null) {
      //Clear map
      this.clearMap();

      //Setup parser
      //var parser = new GPXParser(xml, this.props.map);
      var fileBoundingBox = GeoBounds.extent(json); //parser.centerAndZoom(xml);
	
      //CENTER MAP


      //Set up event so features can color themselves
      this.props.map.data.addListener('addfeature', this.setFeatureStyle.bind(this));

	console.log(fileBoundingBox)
      //prepare for draw, change state
      this.drawBoundary(fileBoundingBox);

      this.setState({ isFileSelected: true, boundingBox: fileBoundingBox});
      json.features[0].properties.name = "Track";
      json.features[0].properties.color = "purple";

      this.drawBoundary(fileBoundingBox);

      this.legend = document.getElementById('legend');
      this.clearLegend();      
      this.addToLegend(json.features[0].properties.name, 
			json.features[0].properties.color);	

      this.props.map.data.addGeoJson(json, {idPropertyName: "name"});

      //this.props.map.setCenter(
	//new google.maps.LatLng((fileBoundingBox[1]+fileBoundingBox[3])/2,
	//	(fileBoundingBox[0] + fileBoundingBox[2])/2));

      var latlngBounds = new this.props.google.maps.LatLngBounds();
      latlngBounds.extend(new this.props.google.maps.LatLng({
				lng:fileBoundingBox[0], lat:fileBoundingBox[1] }));
      latlngBounds.extend(new this.props.google.maps.LatLng({
                                lng:fileBoundingBox[2], lat:fileBoundingBox[3]}));
console.log(latlngBounds)
      this.props.map.fitBounds(latlngBounds);//new this.props.google.maps.LatLngBounds());

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

    var west = boundingBox[0], south = boundingBox[1], east = boundingBox[2],
	north = boundingBox[3];
    var pad = 0.5;
    var pathCoordinates = [ {lat: north+pad, lng: east+pad},
                {lat: south-pad, lng: east+pad},
                {lat: south-pad, lng: west-pad},
                {lat: north+pad, lng: west-pad},
                {lat: north+pad, lng: east+pad} ];

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
    //this.loadGPXUrlIntoGoogleMap("http://phillipdaw.com:" + config.serverPort + 
	//"/NorCalShastaOption.gpx");
    this.loadGeobufTrackIntoGoogleMap("http://phillipdaw.com:" + config.serverPort +
	"/getTestRoute");
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
    var width = 40;
    div.innerHTML = 
        '<svg width="' +width + '" height="15" viewBox="0 0 ' + width + ' 15">' + 
	'<rect x="0" y="5" width="'+width+'" height="10" style="fill:'+color+'"/></svg>' 
			+ name
    this.legend.appendChild(div);

    var controls = 
	this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT].getArray().slice()
    controls.push(div)
  }

  addAqiToLegend = (name, legendLiteral) => {
    legendLiteral.sort()

    var width = 40;
    var count = legendLiteral.length;
    var widthInc = width / count;
    if (Math.round(widthInc) !== widthInc) widthInc = widthInc.toFixed(4);
    var div = document.createElement('div');
    var str = '<svg width="' +width + '" height="15" viewBox="0 0 ' + width + ' 15">';

    var i = 0;
    for (i = 0; i<count; i++) {
      str = str + '<rect x="' + (i*widthInc) + '" y="5" width="'+widthInc +
	'" height="10" style="fill:'+legendLiteral[i][1]+'"/>';

    }//for legend entries
     str = str + '</svg>' + name;
  console.log(str)
    div.innerHTML = str;
    this.legend.appendChild(div);

    var controls =
        this.props.map.controls[google.maps.ControlPosition.TOP_RIGHT].getArray().slice()
    controls.push(div)

  }//addAqiToLegend

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
			addToLegend={this.addAqiToLegend}/> 
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
