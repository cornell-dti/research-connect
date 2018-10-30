import React, {Component} from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';
import './ApplicationPage.scss';
import EmailDialog from '../../components/EmailDialog/EmailDialog.js';
import Footer from '../../components/Footer/Footer';
import * as Utils from '../../components/Utils.js'
import ExternalLink from 'react-icons/lib/fa/external-link';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import { css } from 'react-emotion';
import { ClipLoader } from 'react-spinners';


class ApplicationPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			application: [],
			opportunity: [],
			resumeId: "",
			loading: true
		};
	}

	componentWillMount() {
		axios.get('/api/applications?id=' + sessionStorage.getItem('token_id') + '&netId=' + 'prk57')
			.then((response) => {
				console.log("response.data!");
				console.log(response.data);

				// this is really bad
				for (let opp in response.data) {
					for (let app in response.data[opp].applications) {
						let curApp = response.data[opp].applications[app];
						let curOpp = response.data[opp].opportunity;
						if (curApp !== undefined) {
							if (curApp.id === this.props.match.params.id) {
								this.setState({application: curApp, opportunity: curOpp});
								console.log(this.state.opportunity);
								console.log(this.state.application);
								axios.get('/api/undergrads/la/' + this.state.application.undergradNetId + '?tokenId=' + sessionStorage.getItem('token_id'))
									.then((response) => {
										this.setState({"resumeId": response.data.resumeId});
										let transcriptIdText = response.data.transcriptId != null ? "" : response.data.transcriptId;
										this.setState({"transcriptId": transcriptIdText})
									}).catch(function (error) {
									Utils.handleTokenError(error);
								});
							}
						}
					}
				}
			}).catch(function (error) {
				Utils.handleTokenError(error);
			});
	}

	componentDidMount() {
		// this.setState({ loading: false });
		// temporary
		this.state.loading = false;
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

	renderTranscript() {
		console.log("transcriptid: " + this.state.transcriptId);
		if (!this.state.transcriptId) {
			return null;
		}
		else {
			return (
				<div>
					<div className="app-qual-section">
						<div className="resume-link">
							<a href={this.state.transcriptId} target="_blank"><h6 className="no-margin">View Transcript
								<ExternalLink
									className="red-link"/>
							</h6></a>
						</div>

					</div>
					< hr/>
				</div>
			)
		}
	}

	returnToApps() {
		window.location.href = '/professorView';
	}

	render() {
		const override = css`
	    display: block;
	    margin: 0 auto;
	    border-color: red;
		`;

		if (this.state.loading) {
			return (
				<div className='sweet-loading'>
	        <ClipLoader
	          className={override}
	          sizeUnit={"px"}
	          size={150}
	          color={'#ff0000'}
	          loading={this.state.loading} />
	      </div> 
			);
		}

		let questionsAndResponses = [];
		const responses = this.state.application.responses;
		const questions = this.state.opportunity.questions;
		let c = 0;
		for (let question in responses) {
			questionsAndResponses.push(
				<div className="question-and-response" key={ c++ }>
					<div className='question header'>{ questions[question] ? questions[question] : "Cover Letter"}</div>
					<div className='response'>{ responses[question] }</div>
				</div>
			);
		}

		return (
			<div>
				<Navbar/>
				<div className="application-page-container">
					<div className="return-to-apps" onClick={ this.returnToApps.bind(this) }>
						<FaLongArrowLeft className="black-arrow"/>Return to applications
					</div>
					<div className="row button-bar">
						<div className="column column-33 left-button">
							<EmailDialog buttonText="Mark as Accepted" 
								opp={ this.state.opportunity }
								app={ this.state.application } />
						</div>
						<div className="column column-33 center-button">
							<EmailDialog buttonText="Edit & Send Interview Email" 
								opp={ this.state.opportunity }
								app={ this.state.application } />
						</div>
						<div className="column column-33 right-button">
							<EmailDialog buttonText="Mark as Rejected"
								opp={ this.state.opportunity }
								app={ this.state.application } />
						</div>
					</div>
					<div className="row">
						<div className="column">
							<div className="row application-page-info">
								<div className="column">
									<div className="row app-page-info-top-row">
										<div className="column app-info-left">
											<div className="name header">
												{ Utils.capitalizeFirstLetter(this.state.application.lastName) }, { Utils.capitalizeFirstLetter(this.state.application.firstName) }</div>
											<div className="email">
												{ this.state.application.undergradNetId }@cornell.edu
											</div>
										</div>
										<div className="column app-info-right">
											<div className="date-applied">
												Date Applied: { Utils.convertDate(this.state.application.timeSubmitted) }
											</div>
										</div>
									</div>
									<div className="row">
										<div className="column column-33 app-info-left">
											<div className="grad-year">
												{ Utils.gradYearToString(this.state.application.gradYear) }
											</div>
											<div className="major">
												{ this.state.application.major }
											</div>
										</div>
										<div className="column app-info-right">
											<div className="status">
												Status: { Utils.capitalizeFirstLetter(this.state.application.status) }
											</div>
											<div className="opportunity">
												Opportunity: { this.state.opportunity.title }
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="row application-page-responses">
								<div className="column">
									<div className="responses-header header">Application Responses</div>
									{ questionsAndResponses }
								</div>
							</div>
						</div>
						<div className="column column-app-qual">
							<div className="app-qualifications">
								<div className="app-qual-title header">
									Qualifications
								</div>

								<hr/>

								<div className="app-qual-section">
									<div className="resume-link">
										<a href={"/doc/" + this.state.resumeId} target="_blank"><h6
											className="no-margin header">
											View Resume <ExternalLink className="red-link"/></h6></a>
									</div>
								</div>

								<hr />

								{this.renderTranscript()}

								<div className="app-qual-section">
									<h6 className="header">GPA</h6>
									{ this.state.application.gpa }
								</div>

								<hr/>

								<div className="app-qual-section">
									<h6 className="header">Relevant Courses</h6>
									{ this.toDivList(this.state.application.courses) }
								</div>

								<hr/>

								<div className="app-qual-section">
									<h6 className="header">Skills</h6>
									{ this.toDivList(this.state.application.skills) }
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer/>
			</div>
		);
	}
}

export default ApplicationPage;
