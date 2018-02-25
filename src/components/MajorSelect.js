import React from 'react';

class MajorSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			majorSelect: this.props.majorSelect
		};
	}

	handleChange(e) {
		this.setState({majorSelect: {
			"cs" : this.cs.checked,
			"biology" : this.biology.checked,
		}}, function() {
			this.props.updateMajor(this.state.majorSelect);
		});
	}


	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input ref={(node) => {this.cs = node}}  onChange={this.handleChange.bind(this)} type="checkbox" name="cs" value="cs"/>CS
				<input ref={(input) => {this.biology = input}} onChange={this.handleChange.bind(this)} type="checkbox" name="biology" value="biology"/>Biology
			</form>
		);
	}
}

export default MajorSelect;