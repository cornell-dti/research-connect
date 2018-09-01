import React, {Component} from 'react';
import './Footer.scss';
import CDTIlogo from '../images/cdti.png';
import {Link} from 'react-router-dom';
import { GoogleLogin  } from 'react-google-login';


class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="footer-all">
                <p>Made by</p>
                <a href="http://cornelldti.org/" target="_blank"><img className="CDTIlogo" src={CDTIlogo}
                                                                      alt="CDTI logo"/></a>

                <p><a href="https://goo.gl/forms/MWFfYIRplo3jaVJo2" target="_blank">Report a bug</a></p>
                {/*putting this in the footer so window.gapi is not null so we can use window.gapi to log out */}
                <div style={{display: "none"}}>
                <GoogleLogin
                    clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
                    buttonText="p"
                    className="signup button"/>
                </div>
            </div>
    )
        ;
    }
}
export default Navbar;
