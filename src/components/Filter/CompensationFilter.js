import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Filter from './Filter';
import * as Utils from '../Utils';

class CompensationFilter extends Component {
  render() {
    return (
      <Filter
        filterType="compensationSelect"
        label="Compensation"
        updateFilterOption={this.props.update}
        choices={Utils.getCompensation()}
        type="checkbox"
      />
    );
  }
}

CompensationFilter.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default CompensationFilter;
