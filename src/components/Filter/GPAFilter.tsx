import React from 'react';
import Filter, { UpdateFilterFunction } from './Filter';
import * as Utils from '../Utils';

function GPAFilter(props: { update: UpdateFilterFunction }) {
  return (
    <Filter
      filterType="gpaSelect"
      label="GPA Select"
      updateFilterOption={props.update}
      choices={Utils.getGPA()}
      type="select"
    />
  );
}

export default GPAFilter;
