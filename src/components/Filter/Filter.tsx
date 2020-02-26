import React, { Component, ChangeEvent } from 'react';

type Props = {
  type: 'select' | 'checkbox';
  label: string;
  choices: { [key: string]: string };
  updateFilterOption: (option: string) => void;
};

class Filter extends Component<Props> {
  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const option = e.target.value;
    this.props.updateFilterOption(option);
  };

  // helper method for generating select
  createCheckbox() {
    const { choices } = this.props;
    const options = Object.keys(choices).map((value) => (
      <React.Fragment>
        <input onChange={this.handleChange} type="checkbox" value={value} key={value} />
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
    const options = Object.keys(choices).map((value) => (
      <option key={value} value={value}>{choices[value]}</option>
    ));
    return (
      <select className="select-wrapper" onChange={this.handleChange}>
        {options}
      </select>
    );
  }

  render() {
    let filter = null;

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
