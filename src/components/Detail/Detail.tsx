import React, { Component, ChangeEvent } from 'react';

export type UpdateDetailFunction = (detailName: string, option: string) => void;

type Props = {
  type: 'select' | 'checkbox';
  label: string;
  choices: { [key: string]: string };
  detailName: string;
  updateDetail: UpdateDetailFunction;
};

class Detail extends Component<Props> {
  handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const option = e.target.value;
    this.props.updateDetail(this.props.detailName, option);
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
    let detail;

    if (this.props.type === 'select') {
      detail = this.createSelect();
    } else if (this.props.type === 'checkbox') {
      detail = this.createCheckbox();
    }

    return (
      <div className="years-allowed">
        <label>{this.props.label}</label>
        {detail}
      </div>
    );
  }
}

export default Detail;
