import React, { Component } from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom';
import logo from '../../images/white-logo.png';
import { logoutGoogle } from '../Utils';


class GuestNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div className="header-wrapper">
          <div className="header-all">
            <div className="logo-div">
              <a href="/"><img alt="Research Connect Logo" className="logo" src={logo} /></a>
            </div>
            <nav>
              <li className={this.props.current === 'opportunities' ? 'current-page' : ''}>
                <a href="/opportunities">Opportunities</a>
              </li>
              <li className={this.props.current === 'facultysearch' ? 'current-page' : ''}>
                <a href="/faculty">Email Faculty</a>
              </li>
              <li><a className="sign-out" href="/#forprofs">Sign Up</a></li>
            </nav>
          </div>
        </div>
    );
  }
}
export default GuestNavbar;
