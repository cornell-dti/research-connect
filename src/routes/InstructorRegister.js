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
      position: "Select Position",
      notifications: "Select Notification Settings",
      adminName: "",
      labId: null,
      newLabURL: null,
      newLabName: null,
      newLabDescription: null
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
        this.setState({labId: null});
    }
    this.setState({newLab: !this.state.newLab});

  }

  handleUpdateLab(labName,id) {
    if(!this.state.newLab){
        this.setState({labId: id});
    }


  }


  loadOpportunitiesFromServer() {

    axios.get('http://localhost:3001/getLabs')
    .then(res => {

      this.setState({ data: res.data });
      console.log(res.data);
    })
  }

  componentDidMount() {
    this.loadOpportunitiesFromServer();

  }

  handleChangePosition(event){
    this.setState({ position: event.target.value });
  }
  handleChangeNotifications(event){
    this.setState({ notifications: event.target.value });
  }
  handleChangeName(event){
    this.setState({ adminName: event.target.value });
  }




handleChangeNewLabName(event){
  this.setState({ newLabName: event.target.value });
}

handleChangeLabURL(event){
  this.setState({ newLabURL: event.target.value });
}

handleChangeLabDescript(event){
  this.setState({newLabDescription: event.target.value});
}

render() {

  return (
    <div className="row instructor-reg-form" >
    <div className="main-form column column-60">

    <h3>Registration</h3>
    <form
          id='register'
          action='http://localhost:3001/createLabAdmin'
          method='post'
      >

    <input type="text" name="adminName" id="adminName" placeholder="Your Name"
    value={this.state.adminName} onChange={this.handleChangeName.bind(this)}/>

    <select className="main-form-input" value={this.state.position}  onChange={this.handleChangePosition.bind(this)} >
    <option value="Select Position">Select Your Position</option>
    <option value="Graduate Student">Graduate Student</option>
    <option value="Post-Doc">Post-Doc</option>
    <option value="Principal Investigator">Principal Investigator</option>
    </select>

    <select className="main-form-input" value={this.state.notifications}  onChange={this.handleChangeNotifications.bind(this)} >
    <option value="Select Notification Settings">Select Notification Settings</option>
    <option value="Every Time An Application is Submitted">Every Time An Application is Submitted</option>
    <option value="Weekly Update">Weekly Update</option>
    <option value="Monthly Update">Monthly Update</option>
    </select>

    {!this.state.newLab ? <div>
      <div className="existing-or-create">
      <input type="button" className="button-small" value="Find Existing Lab" onClick={this.toggleNewLab.bind(this)}/>
      <span className="or">OR </span>
      <input type="button" className="button-small-clear" value="Add New Lab" onClick={this.toggleNewLab.bind(this)}/>
      </div>

      <Autosuggester updateLab={this.handleUpdateLab.bind(this)} showDropdown={this.state.showDropdown}
      data={this.state.data}
      />

      </div>

      : <div>
      <div className="existing-or-create">
      <input type="button" className="button-small-clear"  value="Find Existing Lab" onClick={this.toggleNewLab.bind(this)}/>
      <span className="or">OR </span>
      <input type="button" className="button-small" value="Add New Lab" onClick={this.toggleNewLab.bind(this)}/>
      </div>

      <input type="text" name="labName" id="labName" placeholder="Lab Name" value={this.newLabName}
      onChange={this.handleChangeNewLabName.bind(this)}/>

      <input type="text" name="labURL" id="labURL" placeholder="Lab URL" value={this.newLabURL}
      onChange={this.handleChangeLabURL.bind(this)}/>

      <input type="text" name="labDescription" id="labDescription" value={this.newLabDescription}
      onChange={this.handleChangeLabDescript.bind(this)}
      placeholder="Optional Lab Description"/>
      </div>
    }

    <br/>
    <input className="button-small registration" type="submit" value="Register" />
    </form>
    </div>

    </div>
  );
}
}
export default InstructorRegister;
