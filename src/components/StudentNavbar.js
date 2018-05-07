import React, {Component} from 'react';
import '../Navbar.css';
import logo from '../images/wordlogo.png';
import curblogo from '../images/CURB.png';
import { Link } from 'react-router-dom';

class StudentNavbar extends Component {

	constructor(props) {
		super(props);
		this.state = {};
  }

  logout() {
        sessionStorage.clear();
        let homeString = "/";
        if (window.location.toString().includes("app")){
            homeString += "app"
        }
        window.location.href = homeString;
  }

  render() {
		return (
      <div className="header-all">
				<div className="logo-div">
        <Link to="opportunities"><img className="logo" src={logo}/></Link>
				<p className="partnership">in partnership with</p>
				<a href="http://curb.cornell.edu/"><img className="logo" src={curblogo}/></a>
				</div>
        <nav>
          <li><a href={window.location.href.toString().slice(-1) === "/" ? window.location.href.toString().substring(0, window.location.href.toString().length).replace(/\/[^\/]*$/, '/opportunities') : ""}>Opportunities</a></li>
          <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
        </nav>
      </div>
    );
  }
}
export default StudentNavbar;
