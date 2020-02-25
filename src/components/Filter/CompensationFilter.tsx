import React from 'react';
import Filter, { UpdateFilterFunction } from './Filter';
import * as Utils from '../Utils';

function CompensationFilter(props: { update: UpdateFilterFunction }) {
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

export default CompensationFilter;
