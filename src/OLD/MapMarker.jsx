import React, {Component} from 'react';
import PropTypes from 'prop-types';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {mapMarkerStyle, mapMarkerStyleHover} from './MapMarkerStyles.js';
//import FileInput from './FileInputClass.jsx';

export default class MapMarker extends Component {
  static propTypes = {
    // GoogleMap pass $hover props to hovered components
    // to detect hover it uses internal mechanism, explained in x_distance_hover example
    $hover: PropTypes.bool,
    text: PropTypes.string
  };

  static defaultProps = {};

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) { super(props); }

  render() {
    const style = this.props.$hover ? mapMarkerStyleHover : mapMarkerStyle;
    const text = this.props.$hover ? "hover" : this.props.text;
    return (
       <div style={style}>
          {text}
       </div>
    );
  }
}
