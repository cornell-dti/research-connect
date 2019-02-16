import React, { Component } from 'react';
import Filter from './Filter';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

class StartDateFilter extends Component {
  render(){
    return (
      <Filter
        filterType="startDate"
        label="Start Date"
        updateFilterOption={this.props.update}
        choices= {Utils.getStartYears()}
        type = "select"
      />
    );
  }
}

StartDateFilter.propTypes = {
  update: PropTypes.func, //lifts the state up
}

export default StartDateFilter;
