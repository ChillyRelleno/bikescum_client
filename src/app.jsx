import React from 'react';
import '../styles/index.scss';
import GMap from './GMap.jsx';
export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>It Works!</h1>
        <p>This React project just works including <span className="redBg">module</span> local styles.</p>
        <p>Enjoy!</p>
        <GMap />
      </div>
    )
  }
}
