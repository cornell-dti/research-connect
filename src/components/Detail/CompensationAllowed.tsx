import React from 'react';
import Detail, { UpdateDetailFunction } from './Detail';
import { compensation } from '../constants';

function CompensationAllowed(props: { readonly update: UpdateDetailFunction }) {
  return (
    <Detail
      detailName="compensation"
      label="Student Compensation (leave blank if just experience):"
      updateDetail={props.update}
      choices={compensation}
      type="checkbox"
    />
  );
}

export default CompensationAllowed;
