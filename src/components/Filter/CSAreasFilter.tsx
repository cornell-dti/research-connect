import React from 'react';
import PropTypes from 'prop-types';
import Filter, { UpdateFilterFunction } from './Filter';
import * as Utils from '../Utils';

function CSAreasFilter(props: { update: UpdateFilterFunction }) {
  return (
    <Filter
      filterType="csAreasSelect"
      label="CS Areas"
      updateFilterOption={props.update}
      choices={Utils.getCSAreas()}
      type="checkbox"
    />
  );
}

CSAreasFilter.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default CSAreasFilter;
