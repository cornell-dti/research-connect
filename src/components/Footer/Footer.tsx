import React, { Component } from 'react';
import './Footer.scss';
import { GoogleLogin } from 'react-google-login';
import CDTIlogo from '../../images/cdti.png';

class Navbar extends Component {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  render() {
    const googleLogin = (
      // @ts-ignore
      <GoogleLogin
        clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
        buttonText="p"
        className="signup button"
      />
    );
    return (
      <div className="footer-all">
        <div className="footer-child">Made by</div>

        <div className="footer-child">
          <a href="http://cornelldti.org/" target="_blank" rel="noopener noreferrer">
            <img className="logo" src={CDTIlogo} alt="Cornell DTI logo" />
          </a>
        </div>

        <br />

        <div className="footer-child">
          <a
            className="footer-link"
            href="https://goo.gl/forms/MWFfYIRplo3jaVJo2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Us
          </a>
        </div>

        {/* putting this in the footer so window.gapi is not null so we can use window.gapi to log out */}
        <div style={{ display: 'none' }}>
          {googleLogin}
        </div>
      </div>
    );
  }
}

export default Navbar;
