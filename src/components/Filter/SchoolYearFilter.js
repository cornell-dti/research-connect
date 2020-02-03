import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Filter from './Filter';
import * as Utils from '../Utils';

class SchoolYearFilter extends Component {
  render() {
    return (
      <Filter
        filterType="yearSelect"
        label="School Year"
        updateFilterOption={this.props.update}
        choices={Utils.getYears()}
        type="checkbox"
      />
    );
  }
}

SchoolYearFilter.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default SchoolYearFilter;
