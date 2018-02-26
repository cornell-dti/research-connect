import React, {Component} from 'react';

import '../Opportunities.css';

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
		var options = [];
		for(var i=25; i<=43; i++){
			options.push( <option key={i} value={(i/10).toString()} >{(i/10).toString()}</option>);
		}
		return (
			<select value={this.state.currentVal} onChange={this.handleChange.bind(this)}>
				<option value="Select" >Select</option>
				{options}
			</select>
		);
	}


	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				{this.createGpaOptions()}
			</form>
		);
	}
}

export default GPASelect;
