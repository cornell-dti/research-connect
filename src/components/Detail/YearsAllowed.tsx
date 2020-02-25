import React from 'react';
import Detail, { UpdateDetailFunction } from './Detail';
import * as Utils from '../Utils';

function YearsAllowed(props: { readonly update: UpdateDetailFunction }) {
  return (
    <Detail
      detailName="yearsAllowed"
      label="Years Desired:"
      updateDetail={props.update}
      choices={Utils.getYears()}
      type="checkbox"
    />
  );
}

export default YearsAllowed;
