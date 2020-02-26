import React, { Component, ChangeEvent } from 'react';

type Props = {
  label: string;
  choices: { [key: string]: string };
  updateDetail: (option: string) => void;
};

class Detail extends Component<Props> {
  handleChange = (e: ChangeEvent<HTMLInputElement>) => this.props.updateDetail(e.target.value);

  createCheckbox() {
    const { choices } = this.props;
    return (
      <div className="checkbox-wrapper">
        {Object.keys(choices).map((value) => (
          <React.Fragment>
            <input onChange={this.handleChange} type="checkbox" value={value} key={value} />
            {choices[value]}
          </React.Fragment>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="years-allowed">
        <label>{this.props.label}</label>
        {this.createCheckbox()}
      </div>
    );
  }
}

export default Detail;
