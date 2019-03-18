import React, { Component } from 'react';
import Detail from './Detail';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

class CSAreasAllowed extends Component {
  render(){
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
  update: PropTypes.func, //lifts the state up
};

export default CSAreasAllowed;
