import React, {Component} from 'react';
import '../Navbar.css';
import logo from '../images/vectorlogo.png';
import { Link } from 'react-router-dom';

class Navbar extends Component {

	constructor(props) {
		super(props);
		this.state = {
    };
  }
  render() {
		return (
      <div className="header-all">
      <Link to="/"><img className="logo" src={logo}/></Link>

      <nav>
        <li><a href="#">Placeholder</a></li>
        <li><a href="#">Placeholder</a></li>
        <li><a href="#">Placeholder</a></li>


      </nav>

      </div>
    );
  }
}
export default Navbar;
