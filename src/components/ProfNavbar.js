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
    window.location.href = "/";
  }

  render() {
		return (
      <div className="header-all">
        <Link to="/professorView"><img className="logo" src={logo}/></Link>
        <nav>
          <li className={this.props.current=="newopp"? "current-page":""}><a href={this.props.current=="newopp"? "#":"/newopp"}>Post New Opportunity</a></li>
            <li className={this.props.current=="professorView"? "current-page":""}><a href={this.props.current=="professorView"? "#":"/professorView"}>View Applications</a></li>
          <li><a className="sign-out" onClick={this.logout.bind(this)}>Sign Out</a></li>
        </nav>
      </div>
    );
  }
}
export default ProfNavbar;
