import React from 'react';
import PropTypes from 'prop-types';
import Detail from './Detail';
import * as Utils from '../Utils';

function YearsAllowed(props) {
  return (
    <Detail
      filterType="yearsAllowed"
      detailName="yearsAllowed"
      label="Years Desired:"
      updateDetail={props.update}
      choices={Utils.getYears()}
      type="checkbox"
    />
  );
}

YearsAllowed.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default YearsAllowed;
