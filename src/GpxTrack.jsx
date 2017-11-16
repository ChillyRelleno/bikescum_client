import React, {Component} from 'react';

class GpxTrack extends React.Component {
  constructor(props) {
    super(props);
    this.props.track.addTrackpointsToMap();         // Add the trackpoints
      this.props.track.addRoutepointsToMap();         // Add the routepoints
      this.props.track.addWaypointsToMap();           // Add the waypoints

  }//constructor
  render() {
    return null;
  }//render
}//GpxTrack

export default GpxTrack;
