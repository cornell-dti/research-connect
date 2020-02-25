import React, { Component } from 'react';
import ProfessorNavbar from './ProfessorNavbar/ProfessorNavbar';
import Navbar from './StudentNavbar/StudentNavbar';
import GuestNavbar from './GuestNavbar';
import { NavBarOptions } from './types';

type Props = { role: string; current: NavBarOptions };

class VariableNavbar extends Component<Props> {
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

export default VariableNavbar;
