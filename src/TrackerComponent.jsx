import React, { Component } from 'react';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';
//import PositionComponent from './PositionComponent.jsx';
import geobufFun from './lib/geobufFun.js'
import config from './config.js';

class TrackerComponent extends React.Component {
  //user = "";

  constructor(props) {
    super(props);
    //this.state = {isFileSelected : false,  gpx : null};

    var positionDataUrl = "http://phillipdaw.com:" + config.serverPort +
	"/track";
    var user = "";

    user = props.match.params.user;
    //console.log(this.user);
    var url = positionDataUrl + "/" + user;
    console.log(url);
    this.getPositionData(url);
    //var fd=document.getElementById("fileSelectDialog");
    //fd.style.display = "none";
  }//constructor

  componentDidMount() {
    var fd=document.getElementById("fileSelectDialog");
    fd.style.display = "none";
  }


  render() {
    return (<div id="gotThere"/>);//null;
  }

  getPositionData (url) {
    fetch(url)
	.then(response => response.arrayBuffer())
        .then(arrbuf => geobufFun.geobufToGeojson(arrbuf) )
	.then(json => this.usePositionData(json))
  }

  usePositionData (json) {
    console.log(json);
  }
//-------- Component Events --------//
  //componentWillMount() {}
  //componentWillReceiveProps() {}
  //shouldComponentUpdate() {}
  //componentWillUpdate() {}
  //componentDidUpdate() {}
  //componentWillUnmount() {}
  //componentDidCatch() {}


}//AqiComponent

export default TrackerComponent;
