import React from 'react';
import FacultyList from '../FacultyList/FacultyList';
import { Professor } from '../../../types';

export default (props: { data: Professor[]; filteredOptions: any; }) => (
  <FacultyList
    filteredOptions={props.filteredOptions}
    data={props.data}
  />
);
