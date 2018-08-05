import React, {Component} from 'react';
import '../Navbar.css';
import logo from '../images/wordlogo.png';
import curblogo from '../images/CURB.png';
import {Link} from 'react-router-dom';
import {logoutGoogle} from "../components/Shared/Utils";


class ProfNavbar extends Component {

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
                    <a href='/'><img className="logo" src={logo}/></a>
                    <p className="partnership">in partnership with</p>
                    <a href="http://curb.cornell.edu/" target="_blank"><img className="CURBlogo" src={curblogo}/></a>
                </div>
                <nav>
                    <li className={this.props.current === "newopp" ? "current-page" : ""}><a href='/newopp'>Post New
                        Opportunity</a></li>
                    <li className={this.props.current === "professorView" ? "current-page" : ""}><a
                        href='/professorView'>View Applications</a></li>
                    <li><a href="mailto:acb352@cornell.edu">Contact Us</a></li>
                    <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
                </nav>
            </div>
        );
    }
}
export default ProfNavbar;
