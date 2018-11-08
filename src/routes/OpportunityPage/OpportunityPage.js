import React, {Component} from 'react';
import axios from 'axios';
import './OpportunityPage.scss';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar'
import ProfessorNavbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar'
import Footer from '../../components/Footer/Footer';
import CheckBox from 'react-icons/lib/fa/check-square-o';
import CrossCircle from 'react-icons/lib/fa/minus-circle';
import * as Utils from '../../components/Utils.js'

//Utils.gradYearToString(2020) == "Sophomore"


class OpportunityPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			opportunity: {},
			questionAnswers: {},
			submitted: false,
			triedSubmitting: false,
			student: null,
			coverLetter: '',
			netId: 'unknown',
			role: '',
			detectedLoggedOut: false,
		};

		this.parseClasses = this.parseClasses.bind(this);
		this.parseMajors = this.parseMajors.bind(this);
		this.parseYears = this.parseYears.bind(this);
		this.parseGPA = this.parseGPA.bind(this);

	}
	getId() {
		// this.props.history.push({pathname: 'opportunity/' + this.props.opId});
		const url = (window.location.href);
		const length = url.length;
		const finURL = url.slice(0, length-1);
		return (finURL.slice((finURL.lastIndexOf("/")+1)));


	}

	isEmpty(obj) {
		for (let key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	}

	sendToHome(error){
        if (!this.state.detectedLoggedOut) {
            Utils.handleTokenError(error);
            window.location.href = "/test.com";
            console.log("done");
            this.setState({detectedLoggedOut: true});
        }
	}

	handleChange(key) {
		let answersCopy = JSON.parse(JSON.stringify(this.state.questionAnswers));
		answersCopy[key] = document.getElementsByName(key)[0].value;
		this.setState({
			questionAnswers: answersCopy
		});

	}

	coverChange(event) {
		this.setState({coverLetter: event.target.value});
		let answersCopy = JSON.parse(JSON.stringify(this.state.questionAnswers));
		answersCopy['coverLetter'] = event.target.value;
		this.setState({
			questionAnswers: answersCopy
		});
	}


	handleAppSubmit = (e) => {

		e.preventDefault();
		this.setState({triedSubmitting: true});

		// get our form data out of state
		const {opportunity, questionAnswers, submitted, triedSubmitting, student, coverLetter, netId} = this.state;
		// if (coverLetter) {
			let allQsAnswered = true;
			for (let key in questionAnswers) {
				if (questionAnswers[key] == '') {
					let allQsAnswered = false;
				}
			}
			if (allQsAnswered === true) {
				this.setState({submitted: true});
				console.log("submitting form");
				let opportunityId = opportunity._id;
				let responses = questionAnswers;
				axios.post('/api/applications', {opportunityId, netId, responses})
					.then((result) => {
						console.log(result);
					}).catch(function (error) {
						this.sendToHome(error);
					// Utils.handleTokenError(error);
				});

			}

		// }
	};
	//this runs before the "render and return ( ... ) " runs. We use it to get data from the backend about the opportunity
	componentWillMount() {
		console.log(this.props.match.params.id);
		axios.get('/api/opportunities/' + this.props.match.params.id + '?netId=' + sessionStorage.getItem('token_id'))
			.then((response) => {
				this.setState({opportunity: response.data});
				this.setState({student: response.data.student});
				if (!this.isEmpty(response.data)) {
					let obj = {};
					//get all the keys and put them in an array
					for (let k in response.data.questions) {
						//make sure it's an actual key and not a property that all objects have by default
						if (response.data.questions.hasOwnProperty(k)) {
							obj[k] = '';
						}
					}

					this.setState({questionAnswers: obj});
				}
			})
			.catch(function (error) {
				this.sendToHome(error);
			});
		axios.get('/api/undergrads/' + sessionStorage.getItem('token_id'))
			.then((response) => {
				if (!this.isEmpty(response.data)) {
					this.setState({netId: response.data[0].netId});
				}
			})
			.catch(function (error) {
				this.sendToHome(error);
				// Utils.handleTokenError(error);
			});
	}

	printQuestions() {
		if (!this.isEmpty(this.state.opportunity.questions)) {
			let keys = [];
			//get all the keys and put them in an array
			for (let k in this.state.opportunity.questions) {
				//make sure it's an actual key and not a property that all objects have by default
				if (this.state.opportunity.questions.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			//sort the keys by their number
			keys.sort((a, b) => {
				//remove the q from "q1" or "q5" based on number of question
				let aNum = a.replace("q", "");
				let bNum = b.replace("q", "");
				//if a's numb is less than b's num then return a value less than 0 indicating a comes before b.
				return aNum - bNum;
			});

			let questionMapping = keys.map((key) => {
					return <div id={key} key={key}>
						{this.state.opportunity.questions[key]}
						<br/>
						<textarea style={{"min-height": "16rem"}} name={key} key={key} onChange={this.handleChange.bind(this, key)}/>
						<br/>
					</div>
				}
			);

			return (
				<form onSubmit={this.handleAppSubmit.bind(this)}>
					{questionMapping}
					<div className="submit-button-div">
						<input className="button" type="submit" value="Submit"/>
					</div>
				</form>
			);
		} else {
			return (
				<form onSubmit={this.handleAppSubmit.bind(this)}>
					<input className="button" type="submit" value="Submit"/>
				</form>
			);
		}
	}

	convertDate(dateString) {
		let dateObj = new Date(dateString);
		let year = dateObj.getUTCFullYear().toString();
		year = year.substring(2,4);
		let month = dateObj.getUTCMonth() + 1;
		let day = dateObj.getUTCDay();
		let month0 = '';
		let day0 = '';
		if (month < 10) {
			month0 = '0';
		}
		if (day0 < 10) {
			day0 = '0';
		}

		return (month0 + (month).toString() + "/" + day0 + (day).toString() + "/" + year);
	}

	checkOpen() {
		let openDateObj = new Date(this.props.opens);
		let closesDateObj = new Date(this.props.closes);
		let nowTime = Date.now();
		if (closesDateObj.getTime() < nowTime) {
			return "Closed";
		} else if (openDateObj.getTime() > nowTime) {
			return "Not Open Yet";
		} else {
			return "Open";
		}
	}

	parseYears(yearsArray, isStudent) {

		let yearDivArray = [];
		if (yearsArray) {
			let trackYear = false;
			if (yearsArray.includes("freshman")) {
				if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === "Freshman") {
					yearDivArray.push(<div key="f"><CheckBox className="greenCheck"/><span key="fresh"> Freshman</span>
					</div>)
				}
				else {
					yearDivArray.push(<div key="f"><CrossCircle className="cross"/><span key="fresh"> Freshman</span>
					</div>)
				}
				trackYear = true;
			}
			if (yearsArray.includes("sophomore")) {
				if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === "Sophomore") {
					yearDivArray.push(<div key="so"><CheckBox className="greenCheck"/><span > Sophomore</span></div>)
				}
				else {
					yearDivArray.push(<div key="so"><CrossCircle className="cross"/><span > Sophomore</span></div>)
				}
				trackYear = true;
			}
			if (yearsArray.includes("junior")) {
				if (this.state.student  && Utils.gradYearToString(this.state.student.gradYear) === "Junior") {
					yearDivArray.push(<div key="j"><CheckBox className="greenCheck"/><span > Junior</span></div>)
				} else {
					yearDivArray.push(<div key="j"><CrossCircle className="cross"/><span > Junior</span></div>)

				}
				trackYear = true;
			}
			if (yearsArray.includes("senior")) {
				if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === "Senior") {
					yearDivArray.push(<div key="se"><CheckBox className="greenCheck"/><span > Senior</span></div>)
				} else {
					yearDivArray.push(<div key="se"><CrossCircle className="cross"/><span > Senior</span></div>)

				}
				trackYear = true;
			}
			if (trackYear) {
				return <ul>{yearDivArray}</ul>;
			}
			else {
				return <ul>
					<div key="n"><CheckBox className="greenCheck"/><span> No Preference</span></div>
				</ul>
			}
		}

	}

	parseMajors(arrayIn, isStudent) {
		let returnArray = [];
		if (arrayIn) {
			if (arrayIn.length === 0) {
				returnArray.push(<div key="none"><CheckBox key="no" className="greenCheck"/><span
					key="n"> No Preference</span></div>);
			}
			for (let i = 0; i < arrayIn.length; i++) {
				if (this.state.student != null && this.state.student.major.indexOf(arrayIn[i]) != -1) {
					returnArray.push(<div key={i}><CheckBox className="greenCheck"/><span > {arrayIn[i]}</span></div>);
				}
				else {
					returnArray.push(<div key={i}><CrossCircle className="cross"/><span > {arrayIn[i]}</span></div>);

				}
			}
			return <ul>{returnArray}</ul>;
		}
	}

	parseClasses(arrayIn, isStudent) {
		let returnArray = []
		if (arrayIn) {
			if (arrayIn.length === 0) {
				returnArray.push(<div key="none"><CheckBox key="no" className="greenCheck"/><span
					key="n"> No Preference</span></div>);
			}
			for (let i = 0; i < arrayIn.length; i++) {
				if (this.state.student != null && this.state.student.courses.indexOf(arrayIn[i]) != -1) {
					returnArray.push(<div key={i}><CheckBox className="greenCheck"/><span> {arrayIn[i]}</span></div>);
				}
				else {
					returnArray.push(<div key={i}><CrossCircle className="cross"/><span> {arrayIn[i]}</span></div>);
				}
			}
			return <ul>{returnArray}</ul>;
		}
	}

	parseGPA(gpa, isStudent) {
		//if minGPA is falsy or falls in range
		if (!this.state.minGPA || (this.state.student && this.state.opportunity && this.state.opportunity.minGPA <= this.state.student.gpa)) {
			return <p key={0}><CheckBox className="greenCheck"/><span> {this.state.opportunity.minGPA ? this.state.opportunity.minGPA : "No Preference"}</span></p>;
		}
		else {
			return <p key={1}><CrossCircle className="cross"/><span> {this.state.opportunity.minGPA}</span></p>;
		}

	}

	componentDidMount() {
		axios.get('/api/role/' + sessionStorage.getItem('token_id'))
			.then((response) => {
				//if they don't have a role or it's just not showing up for some reason, go to home page
				//remove this line if you want anybody to be able to view opportunity page
				if (!response || response.data === "none" || !response.data) {
					alert("You must be signed in to view this.");
					window.location.href = '/';
				}
				else {
					this.setState({role: response.data});
				}
			})
			.catch(function (error) {
				this.sendToHome(error);
				// Utils.handleTokenError(error);
			});
	}


	render() {
		const notProvidedMessage = "Not specified";
		const isLab = this.state.role !== "undergrad";
		return (
			<div>
				{this.state.role === "undergrad" ? <Navbar/> : <ProfessorNavbar/>}
				<div className={ 'opportunities-page-wrapper ' + (isLab ? 'opportunity-lab' : '') }>
					<div className="wallpaper"></div>
					<div className="row opportunity-row">
						<div className="column opp-details-column">
							<div className="row opp-title-card">
								<div className="column left-column">
									<div className="header">{this.state.opportunity.title}</div>
									<div>{this.state.opportunity.labName}</div>
								</div>
								<div className="column right-column">
									{ isLab &&
									<a className="button" href={"/EditOpp?Id=" + this.getId() + "/" }>Edit Opportunity</a>
									}
									{ !isLab &&
									<a className="button" href="#Application">Apply</a>
									/* { this.state.opportunity.ghostPost ? ": Rolling Admission" : this.convertDate(this.state.opportunity.closes) } */
									}
								</div>
							</div>
							<div className="row">
								<div className="opp-details-card">
									<div className="opp-details-section">
										<div className="header">Supervisor</div>
										<div>{this.state.opportunity.supervisor ? this.state.opportunity.supervisor : notProvidedMessage}</div>
									</div>
									<div className="opp-details-section">
										<div className="header">Qualifications</div>
										<div>{this.state.opportunity.qualifications ? this.state.opportunity.qualifications : notProvidedMessage}</div>
									</div>
									<div className="opp-details-section">
										<div className="header">Tasks</div>
										<div>{this.state.opportunity.undergradTasks ? this.state.opportunity.undergradTasks : notProvidedMessage}</div>
									</div>
									<div className="opp-details-section">
										<div className="header">Start Season</div>
										<div>
											{this.state.opportunity.startSeason ? this.state.opportunity.startSeason + " " : "(Season not specified) "}
											{this.state.opportunity.startYear ? this.state.opportunity.startYear : "(Year not specified)"}
										</div>
									</div>
									<div className="opp-details-section">
										<div className="header">Weekly Hours</div>
										<div>
											{ this.state.opportunity.minHours ? this.state.opportunity.minHours : "No minimum" }- 
											{ this.state.opportunity.maxHours ? this.state.opportunity.maxHours + " " : "No maximum" } hours a week.
										</div>
									</div>
									<div className="opp-details-section">
										<div className="header">Project Description</div>
										<div>
											{ this.state.opportunity.projectDescription ? this.state.opportunity.projectDescription : notProvidedMessage }
										</div>
									</div>
								</div>
							</div>
							{ 
							!isLab && 
							<div id="Application" className="row opp-application-box">
								<div className="column">
									<div className="header">Apply Here</div>
									{ this.state.opportunity.ghostPost ? 
										<div>
											Please email { this.state.opportunity.ghostEmail + " " }
											with your resume and why you're interested in order to apply. You do not need to take 
											any action here.
										</div> : 
										<div>
											<div className="error-div">
												{ 
													this.state.triedSubmitting && !this.state.submitted ?
													<p className="app-error-message">Please answer all questions in order to submit.</p> : '' 
												}
											</div>
											{ 
												!this.state.submitted ? this.printQuestions() :
												<p>You have applied to this position.</p> 
											}
										</div>
									}
								</div>
							</div>
							}
						</div>
						<div className="column">
							<div className="opp-qualifications">
								<div className="opp-qual-title">
									<div>Preferred Qualifications</div>
								</div>

								<hr/>

								<div className="opp-qual-section">
									<h6 className="header">Year</h6>
									{this.parseYears(this.state.opportunity.yearsAllowed)}
								</div>

								<hr/>

								<div className="opp-qual-section">
									<h6 className="header">Major</h6>
									{this.parseMajors(this.state.opportunity.majorsAllowed)}
								</div>

								<hr/>

								<div className="opp-qual-section">
									<h6 className="header">GPA</h6>
									{this.parseGPA(this.state.opportunity.minGPA)}
								</div>

								<hr/>

								<div className="opp-qual-section">
									<h6 className="header">Courses</h6>
									{this.parseClasses(this.state.opportunity.requiredClasses)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}


export default OpportunityPage;