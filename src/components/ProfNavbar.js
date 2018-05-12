import React, {Component} from 'react';
import '../Navbar.css';
import logo from '../images/wordlogo.png';
import { Link } from 'react-router-dom';

class ProfNavbar extends Component {

	constructor(props) {
		super(props);
		this.state = {};
  }

  logout() {
    sessionStorage.clear();
      let homeString = "/";
      if (window.location.toString().includes("app")){
          homeString += "app"
      }
      window.location.href = homeString;  }

  render() {
		return (
      <div className="header-all">
			<div className="logo-div">
				<a href='/'><img className="logo" src={logo}/></a>
				<p className="partnership">in partnership with</p>
				<a href="http://curb.cornell.edu/" target="_blank"><img className="CURBlogo" src={curblogo}/></a>
			</div>
        <nav>
          <li className={this.props.current=="newopp"? "current-page":""}><a href='/newopp'>Post New Opportunity</a></li>
            <li className={this.props.current=="professorView"? "current-page":""}><a href='/professorView'>View Applications</a></li>
          <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
        </nav>
      </div>
    );
  }
}
export default ProfNavbar;
