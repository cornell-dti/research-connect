import React, { Component } from 'react';
import Filter from './Filter';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

class CSAreasFilter extends Component {
  render(){
    return (
      <Filter
        filterType="csAreasSelect"
        label="CS Areas"
        updateFilterOption={this.props.update}
        choices={Utils.getCSAreas()}
        type="checkbox"
      />
    );
  }
}

CSAreasFilter.propTypes = {
  update: PropTypes.func, //lifts the state up
};

export default CSAreasFilter;
