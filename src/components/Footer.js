import React, {Component} from 'react';
import '../Footer.css';
import CDTIlogo from '../images/cdti.png';
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
          <p>Made by</p>
          <a href="http://cornelldti.org/" target="_blank"><img className="CDTIlogo" src={CDTIlogo}
                                                                alt="CDTI logo"/></a>

          <p><a href="https://goo.gl/forms/MWFfYIRplo3jaVJo2" target="_blank">Report a bug</a></p>

      </div>
    );
  }
}
export default Navbar;
