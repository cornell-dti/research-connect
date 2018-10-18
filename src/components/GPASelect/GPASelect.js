import React, {Component} from 'react';

import './GPASelect.scss';

class GPASelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gpaSelect: this.props.gpaSelect,
			currentVal: "Select"
		};
	}

	handleChange(e) {

		this.setState({gpaSelect: {
			"val": e.target.value.toString()
		},
		"currentVal": e.target.value.toString()}, function() {
			this.props.updateGPA(this.state.gpaSelect);
		});
	}

	createGpaOptions() {
		let options = [];
		for(let i=25; i<=43; i++){
			options.push( <option key={i} value={(i/10).toString()} >{(i/10).toString()}</option>);
		}
		return (
			<select className="opp-filter-select" value={this.state.currentVal} onChange={this.handleChange.bind(this)}>
				<option value="Select" >Select</option>
				{options}
			</select>
		);
	}


	render() {
		return (
			<div>
				{this.createGpaOptions()}
			</div>
		);
	}
}

export default GPASelect;
