import React, { Component } from 'react';
import './YearSelect.scss';

class YearSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // when the year is changed, update the state so we can send it to the parent through the updateYear function
  handleChange(e) {
    let year = e.target.name;
    console.log(year);
    if(e.target.checked){
      this.props.addYear(year);
    }
    else{
      this.props.removeYear(year);
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
          name="freshman"
        />
Freshman

        <br />
        <input
          ref={(node) => {
            this.sophomore = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="sophomore"
        />
Sophomore

        <br />
        <input
          ref={(node) => {
            this.junior = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="junior"
        />
Junior

        <br />
        <input
          ref={(node) => {
            this.senior = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="senior"
        />
Senior

      </div>
    );
  }
}

export default YearSelect;
