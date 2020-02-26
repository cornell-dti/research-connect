import React from 'react';
import Detail, { UpdateDetailFunction } from './Detail';
import { csAreas } from '../constants';

function CSAreasAllowed(props: { readonly update: UpdateDetailFunction }) {
  return (
    <Detail
      detailName="areas"
      label="CS Areas"
      updateDetail={props.update}
      choices={csAreas}
      type="checkbox"
    />
  );
}

export default CSAreasAllowed;
