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
        window.location.href = '/';
  }

  render() {
		return (
      <div className="header-all">
				<div className="logo-div">
					<a href='/opportunities'><img className="logo" src={logo}/></a>
					<p className="partnership">in partnership with</p>
					<a href="http://curb.cornell.edu/" target="_blank"><img className="CURBlogo" src={curblogo}/></a>
				</div>
        <nav>
          <li className={this.props.current=="opportunities"? "current-page":""}><a href='/opportunities'>Opportunities</a></li>
					<li className={this.props.current=="editprofile"? "current-page":""}><a href='/editprofile'>My Profile</a></li>

				  <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
        </nav>
      </div>
    );
  }
}
export default StudentNavbar;
