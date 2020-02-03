import React, { Component } from 'react';
import Detail from './Detail';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

class CompensationAllowed extends Component {
  render(){
    return (
      <Detail
        filterType="compensation"
        detailName="compensation"
        label="Student Compensation (leave blank if just experience):"
        updateDetail={this.props.update}
        choices= {Utils.getCompensation()}
        type = "checkbox"
      />
    );
  }
}

CompensationAllowed.propTypes = {
  update: PropTypes.func, //lifts the state up
};

export default CompensationAllowed;