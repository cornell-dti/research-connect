import React, { Component } from 'react';
import './App.scss';

class NameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: ' ',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(event) {
    alert(`A name was submitted: ${this.state.firstname} ${this.state.lastname}`);

    // TODO: form validation
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          First Name:
          {' '}
          <input type="text" value={this.state.firstname} name="firstname" onChange={this.handleChange} />
          <br />
          Last Name:
          {' '}
          <input type="text" value={this.state.lastname} name="lastname" onChange={this.handleChange} />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default () => (
  <div>
    <NameForm />
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
