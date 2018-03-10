import React, {Component} from 'react';
import axios from 'axios';
import '../ApplicationPage.css';
import EmailDialog from '../components/Shared/EmailDialog.js';
import * as Utils from '../components/Shared/Utils.js'
import ExternalLink from 'react-icons/lib/fa/external-link';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';


class ApplicationPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			application: [],
			opportunity: []
		};
	}

	componentWillMount() {
		axios.post('/getApplications', {
			'id': '5a3c0f1df36d280c875969ed'
		})
		.then((response) => {
			for (var opp in response.data) {
				for (var app in response.data[opp].applications) {
					var curApp = response.data[opp].applications[app];
					var curOpp = response.data[opp].opportunity;
					if (curApp !== undefined) {
						if (curApp.id === this.props.match.params.id) {
							this.setState({ application: curApp, opportunity: curOpp });
							console.log(this.state.opportunity);
							console.log(this.state.application);
						}
					}
				}
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	toDivList(lst) {
		let i = 0;
		let res = [];
		for (i in lst) {
			res.push(
				<div key={ i }>
					{ lst[i] }
				</div>
			);
		}
		return res;
	}

	render() {
		let questionsAndResponses = [];
		const responses = this.state.application.responses;
		const questions = this.state.opportunity.questions;
		let c = 0;
		for (var question in responses) {
			questionsAndResponses.push(
				<div className="question-and-response" key={ c++ }>
					<div className='question'>{ questions[question] }</div>
					<div className='response'>{ responses[question] }</div>
				</div>
			);
		}

		return (
			<div>
				<div className="header"></div>
				<div className="application-page-container">
					<div className="button-bar-container">
						<div className="return-to-apps">
							<FaLongArrowLeft className="black-arrow" /><a href="/professorView">Return to View All Applications</a>
						</div>
						<div className="row button-bar">
							<div className="column column-33 left-button">
								<EmailDialog /><a className="button" href="#">Accept</a>
							</div>

							<div className="column column-33 center-button">
								<a className="button" href="#">Interview</a>
							</div>

							<div className="column column-33 right-button">
								<a className="button" href="#">Reject</a>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="column column-75">
							<div className="row application-page-info">
								<div className="column">
									<div className="row app-page-info-top-row">
										<div className="column app-info-left">
											<div className="name">{ this.state.application.firstName }, { this.state.application.lastName }</div>
											<div className="email">{ this.state.application.undergradNetId }@cornell.edu</div>
										</div>
										<div className="column app-info-right">
											<div className="date-applied">Date Applied: { Utils.convertDate(this.state.application.timeSubmitted) }</div>
										</div>
									</div>

									<div className="row">
										<div className="column app-info-left">
											<div className="grad-year">{ Utils.gradYearToString(this.state.application.gradYear) }</div>
											<div className="major">{ this.state.application.major }</div>
										</div>
										<div className="column app-info-right">
											<div className="status">Status: { this.state.application.status }</div>
											<div className="opportunity">Position Applied To: { this.state.opportunity.title }</div>
										</div>
									</div>
								</div>
							</div>

							<div className="row application-page-responses">
								<div className="column">
									<div className="responses-header">Application Responses</div>
									{ questionsAndResponses }
								</div>
							</div>
						</div>
						<div className="column column-25">
							<div className="app-qualifications">
								<div className="app-qual-title">
									<h5>Qualifications</h5>
								</div>

								<hr/>

								<div className="app-qual-section">
									<div className="resume-link">
										<h6 className="no-margin">View Resume <ExternalLink className="red-link" /></h6>
									</div>
								</div>

								<hr />

								<div className="app-qual-section">
									<div className="resume-link">
										<h6 className="no-margin">View Transcript <ExternalLink className="red-link" /></h6>
									</div>
								</div>

								<hr/>

								<div className="app-qual-section">
									<h6>GPA</h6>
									{ this.state.application.gpa }
								</div>

								<hr/>

								<div className="app-qual-section">
									<h6>Relevant Courses</h6>
									{ this.toDivList(this.state.application.courses) }
								</div>

								<hr/>

								<div className="app-qual-section">
									<h6>Skills</h6>
									{ this.toDivList(this.state.application.skills) }
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ApplicationPage;
