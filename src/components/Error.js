import React, { Component } from 'react';
import '../index.css';

class Error extends Component {
  render() {
    console.log("hi there");
    console.log(this.props.location.pathname);
    return (
      <div>
          404: Page not found.
      </div>
    )
  }
}

export default Error;
