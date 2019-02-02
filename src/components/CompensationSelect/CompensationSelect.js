import React, { Component } from 'react';
import './CompensationSelect.scss';

class CompensationSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let comp = e.target.name;
    console.log(comp);
    if(e.target.checked){
      this.props.addComp(comp);
    }
    else{
      this.props.removeComp(comp);
    }
  }

  render() {
    return (
      <div className="compensation-select-wrapper">
        <input
          ref={(node) => {
            this.money = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="Money"
          value="Money"
        />
      Money

        <br />
        <input
          ref={(node) => {
            this.credit = node;
          }}
          onChange={this.handleChange}
          type="checkbox"
          name="Credit"
          value="Credit"
        />
      Credit

      </div>
    );
  }
}

export default CompensationSelect;
