import React, {Component} from 'react';
import axios from 'axios';
import '../ApplicationPage.css';
import * as Utils from '../components/Shared/Utils.js'

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
						}
					}
				}
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	getQuestions() {
		var questions = [];
		const responsePairs = this.state.applications.responses;
		for (var q in responsePairs) {
			questions.push(q);
		}
		return questions;
	}

	getResponses() {
		var responses = [];
		const responsePairs = this.state.application.responses;
		for (var q in responsePairs) {
			responses.push(responsePairs.q);
		}
		return responses;
	}

	render() {
		let questionsAndResponses = [];
		const responsePairs = this.state.application.responses;

		for (var question in responsePairs) {
			questionsAndResponses.push(
				<div>
					<div className='question'>{ question }</div>
					<div className='response'>{ responsePairs.question }</div>
				</div>
			);
		}

		return (
			<div>
				<div className="header"></div>
				<div className="application-page-container">
					<div className="row">
						<div className="column column-75">
								<div className="row application-page-info">
									<div className="column column-75">
										<div className="name">{ this.state.application.firstName }, { this.state.application.lastName }</div>
										<div className="email">{ this.state.application.undergradNetId }@cornell.edu</div>
										<div className="grad-year">{ Utils.gradYearToString(this.state.application.gradYear) }, { this.state.application.major }</div>
									</div>

									<div className="column">
										<div className="status">Status: { this.state.application.status }</div>
										<div className="date-applied">Date Applied: { Utils.convertDate(this.state.application.timeSubmitted) }</div>
										<div className="opportunity">Opportunity: { this.state.opportunity.title }</div>
									</div>
								</div>

								<div className="row application-page-responses">
									<div className="column">

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
