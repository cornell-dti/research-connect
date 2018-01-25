import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import OpportunityBox from './components/OpportunityBox';

class YearSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Freshman: false,
      Sophomore: false,
      Junior: false,
      Senior: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.checked});
  }

  handleSubmit(event) {
    var fresh = this.state.Freshman.toString();
    var soph = this.state.Sophomore.toString();
    var junior = this.state.Junior.toString();
    var senior = this.state.Senior.toString();
    alert('Freshman: ' + fresh + ' Sophomore: ' + soph + ' Junior: ' + junior + ' Senior: ' + senior);

    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <input onChange={this.handleChange} type="checkbox" name="Freshman" value="Freshman" />Freshman
      <input onChange={this.handleChange} type="checkbox" name="Sophomore" value="Sophomore" />Sophomore
      <input onChange={this.handleChange} type="checkbox" name="Junior" value="Junior" />Junior
      <input onChange={this.handleChange} type="checkbox" name="Senior" value="Senior" />Senior

        <input type="submit" value="Submit" />
      </form>
    );
  }
}


class NameForm extends React.Component {
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
        <YearSelect />
        <NameForm />

        <OpportunityBox
          url='http://localhost:3001/getOpportunitiesListing' />
          {/*TODO change the url to get the address bar */}
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
