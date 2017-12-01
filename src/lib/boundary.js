//import React, { Component } from 'react';

class Boundary {

  constructor (map, google) {
    //super();
    this.boundaryLine = null;
    this.legendDiv = document.createElement('div');
    this.legendDiv.innerHTML = "<h3>Legend</h3>";
    this.map = map;
    this.google = google;
  }//constructor

  clearBoundary = () => {
    //Cut previous boundary line
    if (this.boundaryLine)
      this.boundaryLine.setMap(null);
  }

  drawBoundary = (boundingBox) => {
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
      this.boundaryLine = new this.google.maps.Polyline( {
          path: pathCoordinates,
          strokeOpacity: 0,
          icons: [{ icon: lineSymbol, offset: '0', repeat: '20px' }],
          map: this.map,
          zIndex: 300
      });
  }//drawBoundary


}//class legend

export default Boundary;
