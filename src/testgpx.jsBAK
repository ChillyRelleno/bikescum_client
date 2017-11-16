//define(['loadgpx'], function(loadgpx) {
import GPXParser from './loadgpx.js';
var testgpx = {};
//var gpx;
var boundingbox;
var aqiapi;
function loadGPXFileIntoGoogleMap(map, filename) {
//    var toreturn;
    $.ajax({url: filename,
        dataType: "xml",
        success: function(data) {
          var parser = new GPXParser(data, map);
          parser.setTrackColour("#ff0000");     // Set the track line colour
          parser.setTrackWidth(5);          // Set the track line width
          parser.setMinTrackPointDelta(0.001);      // Set the minimum distance between track points
          this.boundingbox = parser.centerAndZoom(data);
          parser.addTrackpointsToMap();         // Add the trackpoints
          parser.addRoutepointsToMap();         // Add the routepoints
          parser.addWaypointsToMap();           // Add the waypoints
          //this.toreturn = parser;
          var southwest = this.boundingbox.getSouthWest();
          var northeast = this.boundingbox.getNorthEast();

          var west = southwest.lng() - 0.5;
          var south = southwest.lat() - 0.5;
          var east = northeast.lng() + 0.5;
          var north = northeast.lat() + 0.5;

    var aqiapi = "http://www.airnowapi.org/aq/kml/Combined/?DATE=2017-09-18T06&BBOX=" + west + "," + south + "," + east + "," + north +"&SRS=EPSG:4326&API_KEY=8B8927D2-B8C3-4371-8E5D-902C4A129469";
    var fireLayer = new google.maps.KmlLayer({
      url: aqiapi,
      map: map
    });
//    fireLayer.setMap(map);
            $("#map").find("img").css("opacity","0.35");

google.maps.event.addListener(map, 'tilesloaded', function() {
            $("#map").find("img").css("opacity","0.35");
});
        }
    });
  //  return toreturn;
}

//$(document).ready(function() {
window.onload = function(){
    var mapOptions = {
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    var parser = loadGPXFileIntoGoogleMap(map, "http://phillipdaw.com:3000/NorCalShastaOption.gpx");

   /* var centerlat = (boundingbox.getNorthEast().lat() +
            boundingbox.getSouthWest().lat()) / 2;
    var centerlng = (boundingbox.getNorthEast().lng() +
            boundingbox.getSouthWest().lng()) / 2;*/

    var src = "https://rmgsc.cr.usgs.gov/outgoing/GeoMAC/ActiveFirePerimeters.kml";
    //var aqiapi = "http://www.airnowapi.org/aq/kml/Combined/?DATE=2017-09-18T06&BBOX=-125.124359,32.762811,-114.323578,49.788350&SRS=EPSG:4326&API_KEY=8B8927D2-B8C3-4371-8E5D-902C4A129469"


//"https://landfire.cr.usgs.gov/arcgis/rest/services/Landfire/US_140/MapServer/query?
/*"https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/1/
geometryType=esriGeometryEnvelope&geometry={xmin: -124, ymin: 46, xmax: -116, ymax: 42}";*/


/*    var kmlLayer = new google.maps.KmlLayer(src, {
      suppressInfoWindows: true,
      preserveViewport: true,
      map: map
    });
    kmlLayer.addListener('click', function(event) {
      var content = event.featureData.infoWindowHtml;
      var testimonial = document.getElementById('capture');
      testimonial.innerHTML = content;
    });*/


};
