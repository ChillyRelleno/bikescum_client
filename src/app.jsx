import React from 'react';
import '../styles/index.scss';
import GMap from './GMap.jsx';

export default class App extends React.Component {

  constructor(props) {
    super();
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    
  }
//      <!--script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIzV5zhdi5cuH6Qvd5w2k_ddsnKLuts_c"
//        async ></script-->

  render() {
    return (
     <div>

        <GMap 
           style={{height:"400px", width:"400px", margin:"0", padding:"0"}} 

           center={{  lat: 45.5231,  lng: -122.9765 }}
        />
    </div>
    )
  }

  componentDidUpdate() {
    
  }
}

