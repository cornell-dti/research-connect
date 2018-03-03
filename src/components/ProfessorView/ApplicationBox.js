import React, {Component} from 'react';
import '../../ApplicationBox.css';
import '../../index.css';

class ApplicationBox extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	dateIsBetween(date, lowerBound, upperBound) {
		return (lowerBound <= date && date <= upperBound);
	}

	gradYearToString(gradYear) {
		let presentDate = new Date();
		if (this.dateIsBetween(presentDate, new Date(gradYear - 4, 7, 10), new Date(gradYear - 3, 4, 23))) return "Freshman";
		if (this.dateIsBetween(presentDate, new Date(gradYear - 3, 4, 24), new Date(gradYear - 2, 4, 23))) return "Sophomore";
		if (this.dateIsBetween(presentDate, new Date(gradYear - 2, 4, 24), new Date(gradYear - 1, 4, 23))) return "Junior";
		if (this.dateIsBetween(presentDate, new Date(gradYear - 1, 4, 24), new Date(gradYear, 4, 23))) return "Senior";
		return "Freshman";
	}

	convertDate(dateString) {
		var dateObj = new Date(dateString);
		var month = dateObj.getUTCMonth()+1;
		var day = dateObj.getUTCDay();
		var month0 = '';
		var day0 = '';
		if (month<10){
		  month0 = '0';
		}
		if (day0<10){
		  day0='0';
		}

		return(month0+ (month).toString()+"/"+day0+(day).toString());
	}

	render() {
		return (
			<div className="prof-application-box" style={{ display: this.props.show ? "" : "none" }}>
				<div className="row">
					<div className="column column-75">
						<div className="name">{ this.props.data.firstName }, { this.props.data.lastName }</div>
						<div className="email">{ this.props.data.undergradNetId }@cornell.edu</div>
						<div className="grad-year">{ this.gradYearToString(this.props.data.gradYear) }, { this.props.data.major }</div>
						<div className="gpa">GPA: { this.props.data.gpa }</div>
						<div className="courses">Relevant Coursework: { this.props.data.courses.join(', ') }</div>
					</div>

					<div className="column">
						<div className="status">Status: { this.props.data.status }</div>
						<div className="date-applied">Date Applied: { this.convertDate(this.props.data.timeSubmitted) }</div>
						<div className="opportunity">Opportunity: { this.props.data.opportunity }</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ApplicationBox;
