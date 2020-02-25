import React from 'react';
import Detail, { UpdateDetailFunction } from './Detail';
import * as Utils from '../Utils';

function CSAreasAllowed(props: { readonly update: UpdateDetailFunction }) {
  return (
    <Detail
      detailName="areas"
      label="CS Areas"
      updateDetail={props.update}
      choices={Utils.getCSAreas()}
      type="checkbox"
    />
  );
}

export default CSAreasAllowed;
