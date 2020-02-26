import React, { Component, ChangeEvent } from 'react';
import './OpportunitySelect.scss';

type Props = { opportunities: string[]; updateOpportunity: (value: string) => void };

class OpportunitySelect extends Component<Props> {
  changeOpportunity = (e: ChangeEvent<HTMLOptionElement | HTMLSelectElement>) => {
    const newVal = e.target.value;
    this.props.updateOpportunity(newVal);
  }

  render() {
    const options = this.props.opportunities.map((opp) => <option value={opp}>{ opp }</option>);

    return (
      <div className="opportunity-select">
        <select onChange={this.changeOpportunity}>
          { options }
        </select>
      </div>
    );
  }
}

export default OpportunitySelect;
