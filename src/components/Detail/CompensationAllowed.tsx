import React from 'react';
import Detail, { UpdateDetailFunction } from './Detail';
import * as Utils from '../Utils';

function CompensationAllowed(props: { readonly update: UpdateDetailFunction }) {
  return (
    <Detail
      detailName="compensation"
      label="Student Compensation (leave blank if just experience):"
      updateDetail={props.update}
      choices={Utils.getCompensation()}
      type="checkbox"
    />
  );
}

export default CompensationAllowed;
