import React from 'react';
import FileReaderInput from 'react-file-reader-input';


class FileInputComponent extends React.Component {
  constructor(props) {
    super(props);

//    this.onChange = this.handleChange;
  }

  handleChange = (e, results) => {
    console.log('OnChange Fired, results = ');;
    console.log(results);
    results.forEach(result => {
      const [e, file] = result;
//      this.props.dispatch(/*uploadFile(*/e.target.result/*)*/);
      console.log(`Successfully uploaded ${file.name}!`);
    });
  }
  render() {
//    this.onChange = this.handleChange;
    return (
      <form>
        <label htmlFor="my-file-input">Upload a File:</label>
        <FileReaderInput as="binary" id="gpx-file-input"
            onChange={(evt, results) => this.handleChange(evt, results)}>
          <button type="button">Select a file!</button>
        </FileReaderInput>
      </form>
    );
  }
}
export default FileInputComponent;
{/* <FileInput as="text" id="gpx-file-input" onChange={this.handleFile}>
            <button>Select File</button>
        </FileInput>

onChange={(evt) => this.changeTitle(evt)}
*/}
