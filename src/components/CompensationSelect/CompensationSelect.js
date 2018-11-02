import React, {Component} from 'react';
import './CompensationSelect.scss';

class CompensationSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			compensationSelect: this.props.compensationSelect
		};
	}

	//when the compensation is changed, update the state so we can send it to the parent through the updateCompensation function
	handleChange(e) {
		this.setState({
			compensationSelect: {
				"Money": this.money.checked,
				"Credit": this.credit.checked
			}
		}, function () {
			//call compensationSelect to update the parent's state with the current state of these checkboxes
			this.props.updateCompensation(this.state.compensationSelect);
		});
	}

	render() {
		return (
			<div className="compensation-select-wrapper">
				<input ref={(node) => {
					this.money = node
				}} onChange={this.handleChange.bind(this)} type="checkbox" name="Money" value="Money"/>Money
				<br/>
				<input ref={(node) => {
					this.credit = node
				}} onChange={this.handleChange.bind(this)} type="checkbox" name="Credit" value="Credit"/>Credit
			</div>
		);
	}
}

export default CompensationSelect;
