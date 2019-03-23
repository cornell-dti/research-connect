import React, { Component } from 'react';
import Filter from './Filter';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

/*
This updates the parent state's "startDate" to a string with "<Season> <Year>"
but the API returns the opportunity's starting date as two separate strings 
accessed by "startSeason" and "startYear" so for the two to be equal, you
need to concat the strings and include a space. Or else it won't work.
*/

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
};

export default StartDateFilter;
