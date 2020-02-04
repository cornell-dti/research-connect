import React from 'react';
import PropTypes from 'prop-types';
import Filter from './Filter';
import * as Utils from '../Utils';

function SchoolYearFilter(props) {
  return (
    <Filter
      filterType="yearSelect"
      label="School Year"
      updateFilterOption={props.update}
      choices={Utils.getYears()}
      type="checkbox"
    />
  );
}

SchoolYearFilter.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default SchoolYearFilter;
