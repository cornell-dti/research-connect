import React, { Component } from 'react';
import '../Navbar.scss';
import { Link } from 'react-router-dom';
import logo from '../../../images/white-logo.png';
import { logoutGoogle } from '../../Utils';


class StudentNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logout() {
    logoutGoogle();
  }

  render() {
    return (
      <div className="header-wrapper">
        <div className="header-all">
          <div className="logo-div">
            <a href="/opportunities"><img className="logo" src={logo} /></a>
          </div>
          <nav>
            {/* <li className={this.props.current === 'studentDashboard' ? 'current-page' : ''}>
              <a href="/studentDashboard">Dashboard</a>
            </li> */}
            <li className={this.props.current === 'opportunities' ? 'current-page' : ''}>
              <a href="/opportunities">View Opportunities</a>
            </li>
            <li className={this.props.current === 'facultysearch' ? 'current-page' : ''}>
              <a href="/faculty">Email Faculty</a>
            </li>
            <li className={this.props.current === 'guide' ? 'current-page' : ''}>
              <a href="/guide">How to Find Research</a>
            </li>
            <li className={this.props.current === 'editprofile' ? 'current-page' : ''}>
              <a href="/editprofile">My Profile</a>
            </li>
            {/* <li className={this.props.current === "facultysearch" ? "current-page" : ""}><a
                            href='/faculty'>Faculty</a></li> */}
            {/* <li className={this.props.current=="editprofile"? "current-page":""}><a href='/editprofile'>My Profile</a></li> */}
            <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
          </nav>
        </div>
      </div>
    );
  }
}
export default StudentNavbar;
