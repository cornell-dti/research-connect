import React, { Component } from 'react';
import Filter from './Filter';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

class GPAFilter extends Component {
  render(){
    return (
      <Filter
        filterType="gpaSelect"
        label="GPA Select"
        updateFilterOption={this.props.update}
        choices={Utils.getGPA()}
        type = "select"
      />
    );
  }
}

GPAFilter.propTypes = {
  update: PropTypes.func, //lifts the state up
};

export default GPAFilter;
