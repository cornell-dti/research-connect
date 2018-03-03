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
      role: "Select Position",
      notifications: "Select Notification Settings",
      firstName: "",
      lastName: "",
      netId: "",
      labId: null,
      labPage: null,
      name: null,
      labDescription: null,
      pi: ''
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
    this.setState({ role: event.target.value });
  }
  handleChangeNotifications(event){
    this.setState({ notifications: event.target.value });
  }
  handleChangeFirstName(event){
    this.setState({ firstName: event.target.value });
  }
  handleChangeLastName(event){
    this.setState({ lastName: event.target.value });
  }
  handleChangeNetId(event){
    this.setState({ netId: event.target.value });
  }

handleChangeNewLabName(event){
  this.setState({ name: event.target.value });
}

handleChangeLabURL(event){
  this.setState({ labPage: event.target.value });
}

handleChangeLabDescript(event){
  this.setState({labDescription: event.target.value});
}
handleChangePI(event){
  this.setState({pi: event.target.value});
}

render() {

  return (
    <div>
    <div className="header"></div>
    <div className=" instructor-reg-form" >
    <h3>Registration</h3>
    <form
          id='register'
          action='http://localhost:3001/createLabAdmin'
          method='post'
      >

    <input className="name" type="text" name="adminFirstName" id="adminFirstName" placeholder="First Name"
    value={this.state.firstName} onChange={this.handleChangeFirstName.bind(this)}/>
    <input className="name" type="text" name="adminLastName" id="adminLastName" placeholder="Last Name"
    value={this.state.lastName} onChange={this.handleChangeLastName.bind(this)}/>
    <input className="name" type="text" name="netId" id="netId" placeholder="NetID"
    value={this.state.netId} onChange={this.handleChangeNetId.bind(this)}/>

    <select className="main-form-input" value={this.state.role}  onChange={this.handleChangePosition.bind(this)} >
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
      <input type="button" className="button no-click button-small" value="Find Existing Lab"/>
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
      <input type="button" className="no-click button button-small" value="Add New Lab" />
      </div>

      <input type="text" name="labName" id="labName" placeholder="Lab Name" value={this.name}
      onChange={this.handleChangeNewLabName.bind(this)}/>

      <input type="text" name="labURL" id="labURL" placeholder="Lab URL" value={this.labPage}
      onChange={this.handleChangeLabURL.bind(this)}/>
      <input type="text" name="labPI" id="labPI" placeholder="Principal Investigator" value={this.pi}
      onChange={this.handleChangePI.bind(this)}/>

      <textarea name="labDescription" id="labDescription" value={this.labDescription}
      onChange={this.handleChangeLabDescript.bind(this)}
      placeholder="Optional Lab Description"></textarea>
      </div>
    }

    <br/>
    <input className="button button-small registration" type="submit" value="Register" />
    </form>

    </div>
    </div>
  );
}
}
export default InstructorRegister;
