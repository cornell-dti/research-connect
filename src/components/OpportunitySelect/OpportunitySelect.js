import React, {Component} from 'react';
import './OpportunitySelect.scss';

class OpportunitySelect extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			opportunity: 'All'
		}
	}

  changeOpportunity = (e) => {
    const newVal = e.target.value;
    this.setState({ newVal }, () => this.props.updateOpportunity(newVal));
  }

	render() {
    const options = this.props.opportunities.map((opp) => <option value={ opp }>{ opp }</option>)

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
