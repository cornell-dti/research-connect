import React from 'react';
import axios from 'axios';
import onClickOutside from "react-onclickoutside";

import '../App.css';
import '../InstructorRegister.css';
import Autosuggester from '../components/Autosuggest';


class InstructorRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      newLab: false,
      showDropdown: false,
      addButton: "Add New Lab"
    };

      this.loadOpportunitiesFromServer = this.loadOpportunitiesFromServer.bind(this);


    };

// displayLabs() {
//   var arrayOfLabs = [];
//
//   for (var i = 0; i < this.state.data.length; i++) {
//       arrayOfLabs.push(<option key={this.state.data[i].name} value={this.state.data[i].name}>{this.state.data[i].name}</option>);
//
//   }
//   return ( <select> <option key="empty" value="">Select Lab</option> {arrayOfLabs} </select>);
// }



toggleNewLab() {
  if (this.state.newLab){
      this.setState({addButton: "Add New Lab"});
  }
  else{
    this.setState({addButton: "Hide New Lab"});
  }
  this.setState({newLab: !this.state.newLab});

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
        <div className="row instructor-reg-form" >
        <div className="main-form column column-70">
            <Autosuggester showDropdown={this.state.showDropdown}
              data={this.state.data}
              />
              </div>
              <div className="column column-30 add-lab-form">
              <h6>{"Don't see your lab listed?"}</h6>
                <input type="button" className="button-small" value={this.state.addButton} onClick={this.toggleNewLab.bind(this)}/>
                {this.state.newLab ?
                <form
                      id='create'
                      action='http://localhost:3001/createLabAdmin'
                      method='post'
                      >

                <label>
                  <span className="asterisk">*</span>Lab Name:
                  <input type="text" name="labName" id="labName"/>
                </label>
                <br/>
                <label>
                  <span className="asterisk">*</span>Lab URL:
                  <input type="text" name="labURL" id="labURL" />
                </label>
                <br/>
                <label>
                  Lab Description:
                  <input type="text" name="labDescription" id="labDescription"/>
                </label>
                <br/>
                <p> <span className="asterisk">*</span>Required fields</p>
                <input className="button-small" type="submit" value="Submit" />
                </form>
                : '' }
                      </div>
        </div>
    );
}
}
export default InstructorRegister;
