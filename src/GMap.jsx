import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker.jsx';
import shouldPureComponentUpdate from 'react-pure-render/function';
import PureComponent from 'react-pure-render/component';
import {K_SIZE} from './MapMarkerStyles.js';
import PropTypes from 'prop-types';
import FileInput from './FileInputClass.jsx';

//import FileReaderInput from 'react-file-reader-input';


//const AnyReactComponent = ({ text }) => <div>{text}</div>;
class GMap extends PureComponent { //React.Component {
  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
    MapMarkerCoords: PropTypes.any,
    hasData: PropTypes.bool
  };

  static defaultProps = {
    center: [59.938043, 30.337157],
    zoom: 9,
    MapMarkerCoords: {lat: 45.5231, lng: -122.6765},
    hasData: false
  };

//  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
    this.center = props.center;    
  //    this.map_id = props.map_id;//"#mapd3";
  }//constructor


 /* componentDidMount() {  }
  componentDidUpdate() {
  }*/


 /* handleFile = (e, results) => {
    results.forEach(result => {
      const [e, file] = result;
      this.props.dispatch(uploadFile(e.target.result));
      console.log(`Successfully uploaded ${file.name}!`);
    });
    props.hasData = true;
  }
*/

  render() {
   //if (this.props.hasData != false) {
    return (
      <GoogleMapReact 
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        bootstrapURLKeys={{
          key:"AIzaSyBIzV5zhdi5cuH6Qvd5w2k_ddsnKLuts_c"
        }}
        style={{height:"100px"}}
        center={this.props.center}
        zoom={8}
        hoverDistance={K_SIZE/2}
//        distanceToMouse={this._distanceToMouse}
      >
      <MapMarker
          lat={45.5231}
          lng={-122.9765}
          text={'Hipsters'}
        />
        <FileInput as="text" id="gpx-file-input" onChange={this.handleFile}>
       {/*     <button>Select File</button>*/}
        </FileInput>

      </GoogleMapReact>
    );
    //}
   //else { 
{/*   return (
      <FileReaderInput as="text" id="gpx-file-input" onChange={this.handleFile}>
        <button>Select File</button>
      </FileReaderInput>
    );
   //}//else
  }*/}
};
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

