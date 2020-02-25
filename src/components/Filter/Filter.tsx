import React, { Component, ChangeEvent } from 'react';

export type UpdateFilterFunction = (detailName: string, option: string) => void;

type Props = {
  type: 'select' | 'checkbox';
  label: string;
  choices: { [key: string]: string };
  filterType: string;
  updateFilterOption: UpdateFilterFunction;
};

class Filter extends Component<Props> {
  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const option = e.target.value;
    this.props.updateFilterOption(this.props.filterType, option);
  };

  // helper method for generating select
  createCheckbox() {
    const { choices } = this.props;
    const options = Object.keys(choices).map((value, index) => (
      <React.Fragment>
        <input
          onChange={this.handleChange}
          type="checkbox"
          value={value}
          key={index}
        />
        {choices[value]}
        <br />
      </React.Fragment>
    ));

    return (
      <div className="checkbox-wrapper">
        { options }
      </div>
    );
  }

  createSelect() {
    const { choices } = this.props;
    const options = Object.keys(choices).map((value, index) => (
      <option key={index} value={value}>
        {choices[value]}
      </option>
    ));
    return (
      <select className="select-wrapper" onChange={this.handleChange}>
        {options}
      </select>
    );
  }


  render() {
    let filter;

    if (this.props.type === 'select') {
      filter = this.createSelect();
    } else if (this.props.type === 'checkbox') {
      filter = this.createCheckbox();
    }

    return (
      <div className="filter-child">
        <label>{this.props.label}</label>
        {filter}
      </div>
    );
  }
}

export default Filter;
