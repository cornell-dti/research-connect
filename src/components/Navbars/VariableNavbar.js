import React, { Component } from 'react';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import PropTypes from 'prop-types';
import ProfessorNavbar from './ProfessorNavbar/ProfessorNavbar';
import Navbar from './StudentNavbar/StudentNavbar';
import GuestNavbar from './GuestNavbar';
import * as Utils from '../Utils';

class VariableNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goHome() {
    window.location.href = '/';
  }

  render() {
    return (
      <div>
        {this.props.role && this.props.role === 'undergrad'
          && <Navbar current={this.props.current} />}
        {this.props.role && this.props.role !== 'undergrad'
          && <ProfessorNavbar current={this.props.current} />}
        {!this.props.role && <GuestNavbar current={this.props.current} />}
      </div>
    );
  }
}

VariableNavbar.propTypes = {
  role: PropTypes.string,
  current: PropTypes.oneOf(Utils.getNavbarOptions()),
};

export default VariableNavbar;
