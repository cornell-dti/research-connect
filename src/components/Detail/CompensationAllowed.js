import React from 'react';
import PropTypes from 'prop-types';
import Detail from './Detail';
import * as Utils from '../Utils';

function CompensationAllowed(props) {
  return (
    <Detail
      filterType="compensation"
      detailName="compensation"
      label="Student Compensation (leave blank if just experience):"
      updateDetail={props.update}
      choices={Utils.getCompensation()}
      type="checkbox"
    />
  );
}

CompensationAllowed.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default CompensationAllowed;
