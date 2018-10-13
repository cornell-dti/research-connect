import React, {Component} from 'react';
import './ApplicationBox.scss';
import '../../../index.css';
import * as Utils from '../../Utils.js'

class ApplicationBox extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	clickRow(rowObj) {
		window.location.href = '/application/' + this.props.data.id;
	}

	render() {
		return (
			<div className="prof-application-box" onClick={this.clickRow.bind(this)} style={{ display: this.props.show ? "" : "none" }}>
				<div className="row">
					<div className="column column-60 left-column">
						<div className="name">{ Utils.capitalizeFirstLetter(this.props.data.lastName) }, { Utils.capitalizeFirstLetter(this.props.data.firstName) }</div>
						<div className="email">{ this.props.data.undergradNetId }@cornell.edu</div>
						<div className="grad-year">{ Utils.gradYearToString(this.props.data.gradYear) }, { this.props.data.major }</div>
						<div className="gpa">GPA: { this.props.data.gpa }</div>
						<div className="courses">Relevant Coursework: { this.props.data.courses.join(', ') }</div>
					</div>

					<div className="column right-column">
						<div className="status">Status: { this.props.data.status }</div>
						<div className="date-applied">Date Applied: { Utils.convertDate(this.props.data.timeSubmitted) }</div>
						<div className="opportunity">Opportunity: { this.props.opportunity.title }</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ApplicationBox;
