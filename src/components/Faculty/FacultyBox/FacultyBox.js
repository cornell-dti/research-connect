import React from 'react';
import FacultyList from '../FacultyList/FacultyList';

export default (props) => (
  <FacultyList
    countProfs={() => { }}
    filteredOptions={props.filteredOptions}
    data={props.data}
    numShowing={props.numShowing}
  />
);
