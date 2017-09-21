import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';

//import d3 from 'd3';
//import reactD3Map from 'react-d3-map';
//import reactMaps from 'react-google-maps';
/*import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  KmlLayer,
} from "react-google-maps";*/


const AnyReactComponent = ({ text }) => <div>{text}</div>;
class GMap extends React.Component {
  //var title = "GPX AQI Fire Map";
  constructor(props) {
    super(props);
    this.center = props.center;    
  //    this.map_id = props.map_id;//"#mapd3";
  }//constructor



  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
////[59.838043, 30.337157]}

    return (
      <GoogleMapReact 
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        bootstrapURLKeys={{
          key:"AIzaSyBIzV5zhdi5cuH6Qvd5w2k_ddsnKLuts_c"
        }}
        style={{height:"400px"}}
        center={this.center}
        zoom={8}
      >
      <AnyReactComponent
          lat={59.955413}
          lng={30.337844}
          text={'Kreyser Avrora'}
        />
      </GoogleMapReact>
    );
  }

  componentWillUnmount() {

  }
}//class

GMap.propTypes = {
 title: React.PropTypes.string
 ,map_id: React.PropTypes.string
 // data: React.PropTypes.object
 //,domain: React.PropTypes.object
};

export default GMap;

