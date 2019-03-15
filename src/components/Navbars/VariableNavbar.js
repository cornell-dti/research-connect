import React, {Component} from 'react';
import ProfessorNavbar from './ProfessorNavbar/ProfessorNavbar';
import Navbar from './StudentNavbar/StudentNavbar';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import PropTypes from 'prop-types';
import * as Utils from '../../components/Utils';

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
          {this.props.role && this.props.role === 'undergrad' &&
          <Navbar current={this.props.current}/>}
          {this.props.role && this.props.role !== 'undergrad' &&
          <ProfessorNavbar current={this.props.current}/>}
          {!this.props.role && (
              <div className='go-home' onClick={() => this.goHome()}>
                <FaLongArrowLeft style={{
                  verticalAlign: 'text-top',
                  position: 'relative',
                  top: '2px',
                }} className='black-arrow'/>
                Home
              </div>
          )}
        </div>
    );
  }
}

VariableNavbar.propTypes = {
  role: PropTypes.string,
  current: PropTypes.oneOf(Utils.getNavbarOptions()),
};

export default VariableNavbar;
