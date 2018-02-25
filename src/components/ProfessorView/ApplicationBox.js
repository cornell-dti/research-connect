import React, {Component} from 'react';
import '../../ApplicationBox.css';
import '../../index.css';

class ApplicationBox extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="prof-application-box">
				<h3>{ this.props.data.undergradNetId }, { this.props.data.undergradNetId }</h3>
				<h3>{ this.props.data.undergradNetId }, { this.props.data.undergradNetId }</h3>
				<h4>GPA: { this.props.data.gpa }</h4>
				<h4>Relevant Coursework: { this.props.data.courses.join(', ') }</h4>
			</div>

		)
	}
}

export default ApplicationBox;
