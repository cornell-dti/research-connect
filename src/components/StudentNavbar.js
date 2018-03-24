import React, {Component} from 'react';
import '../Navbar.css';
import logo from '../images/wordlogo.png';
import { Link } from 'react-router-dom';

class StudentNavbar extends Component {

	constructor(props) {
		super(props);
		this.state = {
    };
  }
  render() {
		return (
      <div className="header-all">
      <Link to="/opportunities"><img className="logo" src={logo}/></Link>

      <nav>
        <li><a href="/opportunities">Opportunities</a></li>
        <li><a href="#">Sign Out</a></li>
        {/*<li><a href="#">Placeholder</a></li>*/}


      </nav>

      </div>
    );
  }
}
export default StudentNavbar;
