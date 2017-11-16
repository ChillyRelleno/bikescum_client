import React from 'react';
import '../styles/index.scss';
import GMap from './GMap.jsx';
//import FileInput from './FileInputClass.jsx';


export default class App extends React.Component {
  constructor(props) {
    super();
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    
  }


//        <h1>It Works!</h1>
//        <p>This React project just works including <span className="redBg">module</span> local styles.</p>
//        <p>Enjoy!</p>
  
  render() {
    return (
     <div>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIzV5zhdi5cuH6Qvd5w2k_ddsnKLuts_c"
        async ></script>

        <GMap 
           style={{height:"400px", width:"400px"}} 

           center={[45.5231,-122.6765]}
        />
    </div>
    )
  }

  componentDidUpdate() {
    
  }
}

