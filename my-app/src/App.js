import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import OpportunityBox from './OpportunityBox';


class NameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastname: ' '
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.firstname + ' ' + this.state.lastname);

    // TODO: form validation
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          First Name: <input type="text" value={this.state.firstname} name="firstname" onChange={this.handleChange} />
          <br />
          Last Name: <input type="text" value={this.state.lastname} name="lastname" onChange={this.handleChange} />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <OpportunityBox
          url='http://localhost:3001/getOpportunitiesListing' />
      </div>
      // <NameForm />
      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <h1 className="App-title">Welcome to React</h1>
      //   </header>
      //   <p className="App-intro">
      //     To get started, edit <code>src/App.js</code> and save to reload.
      //   </p>
      // </div>
    );
  }
}

export default App;
