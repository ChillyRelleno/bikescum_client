import React, { Component } from 'react';
//import FileReaderInput from 'react-file-reader-input';
//import GPXParser from './loadgpx.js';
//import GMap from './GMap.jsx';
//import PositionComponent from './PositionComponent.jsx';
import geobufFun from './lib/geobufFun.js'
import config from './config.js';

class TrackerComponent extends React.Component {
  //user = "";
  //positionDataUrl = "http://phillipdaw.com:" + config.serverPort +
//	"/track";
  constructor(props) {
    super(props);
    //this.state = {isFileSelected : false,  gpx : null};

    this.user = props.match.params.user;
    this.positionDataUrl = this.positionDataUrl + "/" + user;
    this.getPositionData(positionDataUrl);
//    var fd=document.getElementById("fileSelectDialog");
  }//constructor

  render() {
    return (<div id="gotThere"/>);//null;
  }

  getPositionData (url) {
    fetch(url)
	.then(response => response.arrayBuffer())
        .then(arrbuf => geobufFun.geobufToGeojson(arrbuf) )
	.then(json => this.preparePositionData(json))
  }

  usePositionData (json) {
    console.log(json);
  }
//-------- Component Events --------//
  //componentWillMount() {}
  //componentDidMount() {}
  //componentWillReceiveProps() {}
  //shouldComponentUpdate() {}
  //componentWillUpdate() {}
  //componentDidUpdate() {}
  //componentWillUnmount() {}
  //componentDidCatch() {}


}//AqiComponent

export default TrackerComponent;
