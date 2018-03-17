import React, {Component} from 'react';
import '../Footer.css';
import { Link } from 'react-router-dom';

class Navbar extends Component {

	constructor(props) {
		super(props);
		this.state = {
    };
  }
  render() {
		return (
      <div className="footer-all">
      <p>Made by <a href="http://cornelldti.org/" target="_blank">Cornell Design and Tech Initiative</a></p>
      <p><a href="https://goo.gl/forms/MWFfYIRplo3jaVJo2" target="_blank">Report a bug</a></p>

      </div>
    );
  }
}
export default Navbar;
