import React, { Component } from 'react';
import '../Navbar.scss';
import axios from 'axios';
import logo from '../../../images/white-logo.png';
import { logoutGoogle } from '../../Utils';
import * as Utils from '../../Utils';
import { NavBarOptions } from '../types';

type Props = { current?: NavBarOptions };
type State = { labId: string; loggedIn: boolean; onNewOppPage: boolean };

class ProfessorNavbar extends Component<Props, State> {
  state: State = {
    labId: '',
    loggedIn: false,
    onNewOppPage: false,
  };

  logout = () => logoutGoogle();

  componentDidMount() {
    if (window.location.pathname === '/newopp/') {
      this.setState({ onNewOppPage: true });
    }
    /** BEGIN check to see if they're logged in. as a professor
     * If they're not logged in, they can only view the "post opps" page
     */
    axios.get(`/api/labAdmins/lab/${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        this.setState({ loggedIn: true });
        // if the user doesn't have a role for whatever reason (logeed out or didn't finish registration)
        // console.log(response);
        // if it's an undergrad who requested this... (i could've made it an error response but I was in a rush!)
        if (response.data === 'undergrad') {
          this.setState({ labId: '' });
        } else if (!response || response.data === 'none' || !response.data) {
          alert('You have to have an account to view this page');
          window.location.href = '/';
        } else {
          this.setState({ labId: response.data });
        }
      })
      .catch((error) => {
        if (!(this.props.current === 'newopp')) {
          Utils.handleTokenError(error);
        }
      });
  }

  render() {
    const simplifyNavbar = !this.state.loggedIn && this.state.onNewOppPage;
    return (
      <div className="header-wrapper">
        <div className="header-all">
          <div className="logo-div">
            {!simplifyNavbar && (
              <a href="/professorDashboard">
                <img alt="Research Connect" className="logo" src={logo} />
              </a>
            )}
            {simplifyNavbar && <a href="/"><img alt="Research Connect" className="logo" src={logo} /></a>}
          </div>
          <nav>
            {!simplifyNavbar && (
            <li className={this.props.current === 'professorDashboard' ? 'current-page' : ''}>
              <a href="/professorDashboard">Dashboard</a>
            </li>
            )}
            {simplifyNavbar && (
            <li>
              <a href="/profLanding">Home</a>
            </li>
            )}
            <li className={this.props.current === 'newopp' ? 'current-page' : ''}>
              <a href="/newopp">Post</a>
            </li>
            {simplifyNavbar && (
            <li>
              <a href="/profLanding">Create an account</a>
            </li>
            )}
            {!simplifyNavbar && (
            <li className={this.props.current === 'professorView' ? 'current-page' : ''}>
              <a href="/professorView">Applications</a>
            </li>
            )}
            {!simplifyNavbar && (
            <li className={this.props.current === 'opportunities' ? 'current-page' : ''}>
              <a href={`/opportunities?labId=${this.state.labId}`}>Opportunities</a>
            </li>
            )}
            {// professor does not have edit profile
                          /* <li className={this.props.current === "editprofile" ? "current-page" : ""}>
                          <a href='/editprofile'>Profile</a>
                        </li> */}
            {!simplifyNavbar && (
            <li>
              <a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a>
            </li>
            )}
          </nav>
        </div>
      </div>
    );
  }
}
export default ProfessorNavbar;
