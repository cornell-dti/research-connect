import React from 'react';
import Filter, { UpdateFilterFunction } from './Filter';
import * as Utils from '../Utils';

function SchoolYearFilter(props: { update: UpdateFilterFunction }) {
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

export default SchoolYearFilter;
