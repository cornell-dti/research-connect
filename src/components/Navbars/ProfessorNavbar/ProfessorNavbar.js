import React, {Component} from 'react';
import '../Navbar.scss';
import logo from '../../../images/white-logo.png';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {logoutGoogle} from "../../Utils";
import * as Utils from "../../Utils";


class ProfessorNavbar extends Component {

    constructor(props) {
        super(props);
        this.state = {labId: ""};
    }

    logout() {
        logoutGoogle();
    }

    componentWillMount() {
        axios.get('/api/labAdmins/lab/' + sessionStorage.getItem('token_id'))
            .then((response) => {
                //if the user doesn't have a role for whatever reason (logeed out or didn't finish registration)
                console.log(response);
                //if it's an undergrad who requested this... (i could've made it an error response but I was in a rush!)
                if (response.data === "undergrad"){
                    this.setState({labId: ""});
                }
                else if (!response || response.data === "none" || !response.data) {
                    alert("You have to have an account to view this page");
                    window.location.href = '/';
                }
                else {
                    console.log(response.data);
                    this.setState({labId: response.data});
                }
            })
            .catch(function (error) {
                Utils.handleTokenError(error);
            });
    }

    render() {
        return (
            <div className="header-wrapper">
                <div className="header-all">
                    <div className="logo-div">
                        <a href='/'><img className="logo" src={logo}/></a>
                    </div>
                    <nav>
                        <li className={this.props.current === "newopp" ? "current-page" : ""}><a href='/newopp'>Post</a></li>
                        <li className={this.props.current === "professorView" ? "current-page" : ""}><a
                            href='/professorView'>Applications</a></li>
                        <li className={this.props.current === "opportunities" ? "current-page" : ""}><a
                            href={'/opportunities?labId=' + this.state.labId}>Opportunities</a></li>
                        <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
                    </nav>
                </div>
            </div>
        );
    }
}
export default ProfessorNavbar;
