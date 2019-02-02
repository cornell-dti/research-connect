import React, { Component } from 'react';
import './YearSelect.scss';

class YearSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // when the year is changed, update the state so we can send it to the parent through the updateYear function
  handleChange(e) {
    let filter = e.target.name;
    let year = e.target.value;
    console.log(year);
    if(e.target.checked){
      this.props.addYear(filter, year);
    }
    else{
      this.props.removeYear(filter, year);
    }
  }

  render() {
    return (
      <div className="year-select-wrapper">
        <input
          ref={(node) => {
            this.freshman = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="yearSelect"
          value="freshman"
        />
Freshman

        <br />
        <input
          ref={(node) => {
            this.sophomore = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="yearSelect"
          value="sophomore"
        />
Sophomore

        <br />
        <input
          ref={(node) => {
            this.junior = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="yearSelect"
          value="junior"
        />
Junior

        <br />
        <input
          ref={(node) => {
            this.senior = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="yearSelect"
          value="senior"
        />
Senior

      </div>
    );
  }
}

export default YearSelect;
