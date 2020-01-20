import React, { Component } from 'react';
import '../Navbar.scss';
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
            <a href="/studentDashboard"><img className="logo" src={logo} alt="Research Connect Logo" /></a>
          </div>
          <nav>
            {/*<li className={this.props.current === 'opportunities' ? 'current-page' : ''}>*/}
            {/*  <a href="/opportunities">Opportunities</a>*/}
            {/*</li>*/}
            <li className={this.props.current === 'facultysearch' ? 'current-page' : ''}>
              <a href="/faculty">View Opportunities</a>
            </li>

            <li className={this.props.current === 'savedops' ? 'current-page' : ''}>
              <a href="/savedopportunity">Saved Opportunities</a>
            </li>

            <li className={this.props.current === 'savedfac' ? 'current-page' : ''}>
              <a href="/savedfaculty">Saved Faculty</a>
            </li>

            <li className={this.props.current === 'guide' ? 'current-page' : ''}>
              <a href="/guide">How to Find Research</a>
            </li>
            <li className={this.props.current === 'editprofile' ? 'current-page' : ''}>
              <a href="/editprofile">My Profile</a>
            </li>
            <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
          </nav>
        </div>
      </div>
    );
  }
}
export default StudentNavbar;
