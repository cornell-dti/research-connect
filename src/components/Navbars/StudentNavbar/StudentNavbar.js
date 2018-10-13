import React, {Component} from 'react';
import '../Navbar.scss';
import logo from '../../../images/wordlogo.png';
import cislogo from '../../../images/cis_logo.png';
import {Link} from 'react-router-dom';
import {logoutGoogle} from "../../Utils";


class StudentNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    logout(){
        logoutGoogle();
    }

    render() {
        return (
            <div className="header-all">
                <div className="logo-div">
                    <a href='/opportunities'><img className="logo" src={logo}/></a>
                    <p className="partnership">in partnership with</p>
                    <a href="https://www.cis.cornell.edu/" target="_blank"><img className="CURBlogo" src={cislogo}/></a>
                </div>
                <nav>
                    <li className={this.props.current === "opportunities" ? "current-page" : ""}><a
                        href='/opportunities'>Opportunities</a></li>
                    <li className={this.props.current === "facultysearch" ? "current-page" : ""}><a
                        href='/facultysearch'>Faculty</a></li>
                    {/*<li className={this.props.current=="editprofile"? "current-page":""}><a href='/editprofile'>My Profile</a></li>*/}
                    <li><a href="mailto:acb352@cornell.edu">Contact Us</a></li>
                    <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
                </nav>
            </div>
        );
    }
}
export default StudentNavbar;
