import React from 'react';
import ReactDOM from 'react-dom';
//import d3 from 'd3';
//import reactD3Map from 'react-d3-map';
import reactMaps from 'react-google-maps';

class GMap extends React.Component {
  //var title = "GPX AQI Fire Map";
  constructor(props) {
    super(props);
//    this.map_id = props.map_id;//"#mapd3";
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div>
        <center><h1>{this.props.title}</h1></center>
        <div id={this.props.map_id} style={{width:"100%"}, {height:"400px"}}></div>
      </div>
    )
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
