import React, { Component } from 'react';
import Detail from './Detail';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

class YearsAllowed extends Component {
  render(){
    return (
      <Detail
        filterType="yearsAllowed"
        detailName="yearsAllowed"
        label="Years Desired:"
        updateDetail={this.props.update}
        choices= {Utils.getYears()}
        type = "checkbox"
      />
    );
  }
}

YearsAllowed.propTypes = {
  update: PropTypes.func, //lifts the state up
};

export default YearsAllowed;
