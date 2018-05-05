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
        <Link to="professorView"><img className="logo" src={logo}/></Link>
        <nav>
          <li><a href={window.location.href.toString().replace(/\/[^\/]*$/, '/newopp')}>Post New Opportunity</a></li>
            <li><a href={window.location.href.toString().replace(/\/[^\/]*$/, '/professorView')}>View Applications</a></li>
          <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
        </nav>
      </div>
    );
  }
}
export default ProfNavbar;
