import React from 'react';
import Detail, { UpdateDetailFunction } from './Detail';
import { years } from '../constants';

function YearsAllowed(props: { readonly update: UpdateDetailFunction }) {
  return (
    <Detail
      detailName="yearsAllowed"
      label="Years Desired:"
      updateDetail={props.update}
      choices={years}
      type="checkbox"
    />
  );
}

export default YearsAllowed;
