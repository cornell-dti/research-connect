import React from 'react';
import PropTypes from 'prop-types';
import Filter from './Filter';
import * as Utils from '../Utils';

function CompensationFilter(props) {
  return (
    <Filter
      filterType="compensationSelect"
      label="Compensation"
      updateFilterOption={props.update}
      choices={Utils.getCompensation()}
      type="checkbox"
    />
  );
}

CompensationFilter.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default CompensationFilter;
