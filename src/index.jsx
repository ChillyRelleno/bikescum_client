import React from 'react'
//import ReactDOM from 'react-dom'
import {render} from 'react-snapshot';
import { AppContainer } from 'react-hot-loader'
import App from './app'
import { BrowserRouter } from 'react-router-dom';

//<!--basename='/rideonfire'-->
//      <!--Unlikely thus untested-->
//      <!--Route path='/rideonfire'-->
//      <!--/Route-->

//ReactDOM.render(
render(
  <AppContainer>
    <BrowserRouter basename={'/rideonfire'}>
        <App>
	</App>
    </BrowserRouter>
  </AppContainer>,
  document.getElementById('app')
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default;
    //ReactDOM.render(
    render (
      <AppContainer>
        <BrowserRouter basename={'/rideonfire'}>
            <App></App>
        </BrowserRouter>
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
