import React, { Component } from 'react';
import Filter from './Filter';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

class CompensationFilter extends Component {
  render(){
    return (
      <Filter
        filterType="compensationSelect"
        label="Compensation"
        updateFilterOption={this.props.update}
        choices={Utils.getCompensation()}
        type = "checkbox"
      />
    );
  }
}

CompensationFilter.propTypes = {
  update: PropTypes.func, //lifts the state up
}

export default CompensationFilter;
