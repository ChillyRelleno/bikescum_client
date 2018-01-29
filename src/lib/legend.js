//import React, { Component } from 'react';

class Legend {

  constructor (map, google) {
    //super();
    //this.rootDiv = root;
    this.legendDiv = document.createElement('div');
    this.legendDiv.className = "mapControls lowMargin";
    this.legendDiv.setAttribute("id", "legend");
    this.legendDiv.innerHTML = "<h3>Legend</h3>";
    this.map = map;
    this.google = google;
  }//constructor

  addToLegend = (name, color) => {
    var toAdd = [name, color];
    var div = document.createElement('div');
    var width = 40;
    div.innerHTML =
        '<svg width="' +width + '" height="15" viewBox="0 0 ' + width + ' 15">' +
        '<rect x="0" y="5" width="'+width+'" height="10" style="fill:'+color+'"/></svg>'
                        + name
    this.legendDiv.appendChild(div);

    var controls =
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].getArray().slice()
    controls.push(div)
  }//addtolegend

 addSvgToLegend = (name, svg) => {
   var div = document.createElement('div');
    var width = 40;
    div.innerHTML = svg + name;
        //'<svg width="' +width + '" height="15" viewBox="0 0 ' + width + ' 15">' +
        //'<rect x="0" y="5" width="'+width+'" height="10" style="fill:'+color+'"/></svg>'
        //                + name
    this.legendDiv.appendChild(div);

    var controls =
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].getArray().slice()
    controls.push(div)

 }

 addAqiToLegend = (name, legendEntry) => {
   legendEntry.sort()
   var width = 40;
   var count = legendEntry.length;
   var widthInc = width / count;
   if (Math.round(widthInc) !== widthInc) widthInc = widthInc.toFixed(4);

   var div = document.createElement('div');
   var str = '<svg width="' +width + '" height="15" viewBox="0 0 ' + width + ' 15">';

   var i = 0;
   for (i = 0; i<count; i++) {
     str = str + '<rect x="' + (i*widthInc) + '" y="5" width="'+widthInc +
       '" height="10" style="fill:'+legendEntry[i][1]+'"/>';
   }//for legend entries
   str = str + '</svg>' + name;
   div.innerHTML = str;
   this.legendDiv.appendChild(div);

   var controls =
       this.map.controls[google.maps.ControlPosition.TOP_RIGHT].getArray().slice()
   controls.push(div)

  }//addAqiToLegend

  clearLegend = () => {
    this.legendDiv.innerHTML = "<h3>Legend</h3>";
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].clear()
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.legendDiv);
  }//clearLegend


}//class legend

export default Legend;
