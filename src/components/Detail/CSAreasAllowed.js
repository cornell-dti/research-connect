import React from 'react';
import PropTypes from 'prop-types';
import Detail from './Detail';
import * as Utils from '../Utils';

function CSAreasAllowed(props) {
  return (
    <Detail
      filterType="areas"
      detailName="areas"
      label="CS Areas"
      updateDetail={props.update}
      choices={Utils.getCSAreas()}
      type="checkbox"
    />
  );
}

CSAreasAllowed.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default CSAreasAllowed;
