import React, {Component} from 'react';
import axios from 'axios';
import '../App.css';

class InstructorRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      newLab: false
    };

      this.loadOpportunitiesFromServer = this.loadOpportunitiesFromServer.bind(this);
    };

displayLabs() {
  var arrayOfLabs = [];

  for (var i = 0; i < this.state.data.length; i++) {
      arrayOfLabs.push(<option key={this.state.data[i].name} value={this.state.data[i].name}>{this.state.data[i].name}</option>);

  }
  return ( <select> <option key="empty" value="">Select Lab</option> {arrayOfLabs} </select>);
}

turnOnNewLab() {
  this.setState({newLab: true});
}

loadOpportunitiesFromServer() {

  axios.get('http://localhost:3001/getLabs')
    .then(res => {
      console.log("RESULT IS",res.data);
      this.setState({ data: res.data });
    })
}

componentDidMount() {
  this.loadOpportunitiesFromServer();

}

render() {

    return (
        <div>

                {this.displayLabs()}
                <input type="button" value="Add a new lab" onClick={this.turnOnNewLab.bind(this)}/>
                {this.state.newLab ?
                <form>
                <label>
                  *Lab Name:
                  <input type="text" name="labName" id="labName"/>
                </label>
                <br/>
                <label>
                  *Lab URL:
                  <input type="text" name="labURL" id="labURL" />
                </label>
                <br/>
                <label>
                  Lab Description:
                  <input type="text" name="labDescription" id="labDescription"/>
                </label>
                <br/>
                <p> *Required fields</p>
                <input type="submit" value="Submit" />
                </form>
                : '' }
        </div>
    );
}
}
export default InstructorRegister;
