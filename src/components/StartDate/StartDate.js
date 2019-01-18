import React, { Component } from 'react';

import '../../routes/Opportunities/Opportunities.scss';

class StartDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.startDate,
      currentVal: 'Select',
    };
  }

  handleChange(e) {
    if (e.target.value.toString() == 'Select') {
      console.log('select');
      this.setState({
        startDate: {
          season: null,
          year: null,
        },
        currentVal: e.target.value.toString(),
      }, function () {
        this.props.updateDate(this.state.startDate);
      });
    } else {
      const tmp = e.target.value.toString().split(' ');
      console.log(tmp);
      this.setState({
        startDate: {
          season: tmp[0],
          year: tmp[1],
        },
        currentVal: e.target.value.toString(),
      }, function () {
        this.props.updateDate(this.state.startDate);
      });
    }
  }


  render() {
    let currentYear = new Date().getFullYear();
    const pastYear = (currentYear - 1).toString(10);
    const nextYear = (currentYear + 1).toString(10);
    currentYear = currentYear.toString(10);
    return (
      <div className="start-date-form">
        <select className="opp-filter-select" value={this.state.currentVal} onChange={this.handleChange.bind(this)}>
          <option value="Select">Select</option>
          <option value={(`Fall ${pastYear}`)}>
            Fall
            {' '}
            {' '}
            {pastYear}
          </option>
          <option value={(`Spring ${currentYear}`)}>
Spring
            {' '}
            {currentYear}
          </option>
          <option value={(`Summer ${currentYear}`)}>
Summer
            {' '}
            {currentYear}
          </option>
          <option value={(`Fall ${currentYear}`)}>
Fall
            {' '}
            {currentYear}
          </option>
          <option value={(`Spring ${nextYear}`)}>
Spring
            {' '}
            {nextYear}
          </option>
          {/* <option value="Fall 2018">Fall 2018</option> */}
          {/* <option value="Summer 2019">Summer 2019</option> */}

        </select>
      </div>
    );
  }
}

export default StartDate;
