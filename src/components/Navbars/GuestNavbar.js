import React from 'react';
import './Navbar.scss';
import logo from '../../images/white-logo.png';

export default (props) => (
  <div className="header-wrapper">
    <div className="header-all">
      <div className="logo-div">
        <a href="/">
          <img alt="Research Connect Logo" className="logo" src={logo} />
        </a>
      </div>
      <nav>
        {/* <li className={this.props.current === 'opportunities' ? 'current-page' : ''}> */}
        {/*  <a href="/opportunities">View Opportunities</a> */}
        {/* </li> */}
        <li className={props.current === 'facultysearch' ? 'current-page' : ''}>
          <a href="/faculty">View Opportunities</a>
        </li>
        <li className={props.current === 'guide' ? 'current-page' : ''}>
          <a href="/guide">How to Find Research</a>
        </li>
        <li>
          <a className="sign-out" href="/#forprofs">
            Sign Up/Log In
          </a>
        </li>
      </nav>
    </div>
  </div>
);
