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
{/*      <div>
        <FileInput as="text" id="gpx-file-input" onChange={this.handleFile}>
            <button>Select File</button>
        </FileInput>
      </div>*/}<div>
        <GMap 
           style={{height:"100px", width:"100px"}} 

           center={[45.5231,-122.6765]}
        />
      </div>
     </div>
    )
  }

  componentDidUpdate() {
    
  }
}
