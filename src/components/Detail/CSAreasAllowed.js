import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Detail from './Detail';
import * as Utils from '../Utils';

class CSAreasAllowed extends Component {
  render() {
    return (
      <Detail
        filterType="areas"
        detailName="areas"
        label="CS Areas"
        updateDetail={this.props.update}
        choices={Utils.getCSAreas()}
        type="checkbox"
      />
    );
  }
}

CSAreasAllowed.propTypes = {
  update: PropTypes.func, // lifts the state up
};

export default CSAreasAllowed;
