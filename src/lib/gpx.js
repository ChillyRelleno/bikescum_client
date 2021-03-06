import GeoBounds from 'geojson-bounds'

import Legend from './legend.js';
import Boundary from './boundary.js';
//import React, { Component } from 'react';

class GPX {

  constructor (map, google) {
    //super();
    this.boundaryLine = null;
    //this.legendDiv = document.createElement('div');
    //this.legendDiv.innerHTML = "<h3>Legend</h3>";
    this.map = map;
    this.google = google;
     //Set up event so features can color themselves
      this.map.data.addListener('addfeature', this.setFeatureStyle.bind(this),
	{passive: true});

      this.addListeners();
  }//constructor
  calcBounds = (feature) => {
    return GeoBounds.extent(feature);
  }
  drawGpx = (json, clear = true) => { //xml) => {
    if (json !== null) {
      //Clear map
      if (clear)      this.clearMap();
      if (this.infoWindow) this.infoWindow.close();
      //Setup parser
      var fileBoundingBox = GeoBounds.extent(json); //parser.centerAndZoom(xml);

      //Set up event so features can color themselves
      //this.map.data.addListener('addfeature', this.setFeatureStyle.bind(this));

      //this.addListeners();

      //prepare for draw, change state
      this.Boundary = new Boundary(this.map, this.google);
      this.Boundary.drawBoundary(fileBoundingBox);
      //this.setState({ isFileSelected: true, boundingBox: fileBoundingBox});
        console.log(json);
      json.features[0].properties.name = "Track";
      json.features[0].properties.color = "purple";

      //LEGEND setup
      this.legend = new Legend(this.map, this.google);//document.getElementById('legend');
      this.legend.clearLegend();
      this.legend.addToLegend(json.features[0].properties.name,
                        json.features[0].properties.color);
      //Add GPX
      this.map.data.addGeoJson(json, {idPropertyName: "name"});

      //CENTER MAP
      var latlngBounds = new this.google.maps.LatLngBounds();
      latlngBounds.extend(new this.google.maps.LatLng({
                                lng:fileBoundingBox[0], lat:fileBoundingBox[1] }));
      latlngBounds.extend(new this.google.maps.LatLng({
                                lng:fileBoundingBox[2], lat:fileBoundingBox[3]}));
      this.map.fitBounds(latlngBounds);//new this.google.maps.LatLngBounds());

      var legend = this.legend;
      return {fileBoundingBox, legend};
    }//if xml loaded
  }//drawGpx


  addListeners = () => {
   //MAP click
   this.map.addListener('click', (event) => {
     this.infoWindow.close();
   }, {passive: true});
   //MAP dblclick
   this.map.addListener('dblclick', (event) => { this.infoWindow.close(); }, {passive: true})
   this.map.data.addListener('dblclick', (event) =>{this.infoWindow.close();}, {passive: true})

   //Feature click
   this.map.data.addListener('click', this.featureClick, {passive: true});//feature click listener callback

   //feature mouseover
   this.map.data.addListener('mouseover', (event) => {
     this.map.data.overrideStyle(event.feature, { strokeWeight: 6 });
   }, {passive: true});//mouseover event

   //Feature mouseout
   this.map.data.addListener('mouseout', (event) => {
      this.map.data.overrideStyle(event.feature,
             { strokeWeight: 3 });
   }, {passive: true});//mouseout event
   
  }//addListeners

  toTwoDecimalPlaces = (number) => {
    return Math.round(number * 100)/100;
  }

  featureClick = (event) => {
    var message, svg;
    if (event.feature.getProperty('type') == "AQI") {
      var lvl = event.feature.getProperty('styleUrl').charAt(1)
      var color = event.feature.getProperty('color');
      message = " PM2.5 Air particulate warning level " + lvl;
      svg = '<svg width="40" height="15" viewBox="0 0 40 15">' +
            '<rect x="0" y="5" width="40" height="10" style="fill:'+color+'"/></svg>'
    }//if aqi
    else if (event.feature.getProperty('type') == "Fire") {
      var name = event.feature.getProperty('name');
      var color = event.feature.getProperty('color');
      var desc = event.feature.getProperty('description')
      message = " FIRE: " + name + "\r\n" + desc; 		console.log("D " +desc);
      svg = '<svg width="40" height="15" viewBox="0 0 40 15">' +
            '<rect x="0" y="5" width="40" height="10" style="fill:'+color+'"/></svg>'
    }//else if fire
    else if (event.feature.getProperty('type') == "pos") {//time') !== undefined) {
        var distance = event.feature.getProperty('sumDistance');//Math.round(event.feature.getProperty('sumDistance')*100)/100;
	if (distance > 1000) { distance = this.toTwoDecimalPlaces(distance/1000) + "km"; }
	else { distance = this.toTwoDecimalPlaces(distance) + "m"; }
	message = "<p>" + event.feature.getProperty('time') + "<br/>" + "Distance so far: " + distance + "</p>";
	svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">' +
	'<circle cx="9" cy="9" r="8" data-name="outer" fill="#7EC0EE" stroke="#000" stroke-width="1"/>'+
	'<circle cx="9" cy="9" r="3" data-name="inner" fill="#fff" stroke="#000" stroke-width="1.5" fill-opacity="0.55"/>'+
	'</svg>';
	
    }
    else {//GPX
      console.log(event.feature);
      var color = event.feature.getProperty('color');
      var name = event.feature.getProperty('name');
      message = " Route";
      svg = '<svg width="40" height="15" viewBox="0 0 40 15">' +
            '<rect x="0" y="5" width="40" height="10" style="fill:'+color+'"/></svg>'
    }//else it's gotta be GPX

    if (!this.infoWindow) {
      this.infoWindow = new this.google.maps.InfoWindow();
    }//if
    else this.infoWindow.close();
    this.infoWindow.setContent(
            "<div style='width:auto;text-align: center; padding:0px;'>" +
            svg + message + "</div>");
    this.infoWindow.setPosition(event.latLng);
    this.infoWindow.open(this.map);
  }//feature click listener callback


 clearMap = () => {
    //Clear map
    this.map.data.forEach((feature) => {    //function(feature) {
      this.map.data.remove(feature);
    });
    if (this.Boundary)  this.Boundary.clearBoundary();
  }

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
    else if (type=="pos") {
	style['zIndex'] = 300;
    }
    else style['zIndex'] = 50;
    this.map.data.overrideStyle(feature, style  );

  }

}//class legend

export default GPX;
