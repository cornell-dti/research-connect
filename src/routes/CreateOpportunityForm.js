import React from 'react';
import '../CreateOpportunityForm.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ProfNavbar from '../components/ProfNavbar'
import axios from 'axios';
import Footer from '../components/Footer';
import 'react-datepicker/dist/react-datepicker.css';
import ReactTooltip from 'react-tooltip';
import InfoIcon from 'react-icons/lib/md/info';
import Delete from 'react-icons/lib/ti/delete';
import Add from 'react-icons/lib/md/add-circle';


class CreateOppForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		    netId: sessionStorage.getItem('netId'),
		    creatorNetId: sessionStorage.getItem('token_id'),
				labPage: '',
				areas: [],
				title: '',
				projectDescription: '',
				undergradTasks: '',
				qualifications: '',
				startSeason: '',
				startYear: '',
				yearsAllowed: [],
				questions: {},
				requiredClasses: [],
				minGPA: '',
				minHours: '',
				maxHours: '',
				opens: moment(),
				closes: moment().add(365, 'days'),
				labName: '',
				supervisor: '',
				numQuestions: 0,
				titleIsValid: false,
				tasksAreValid: false,
				seasonIsValid: false,
				yearIsValid: false,
				triedSubmitting: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
		this.displayQuestions = this.displayQuestions.bind(this);


	}
	onSubmit = (e) => {
			this.setState({triedSubmitting: true});
			e.preventDefault();
			// get our form data out of state
			const { netId, creatorNetId, labPage, areas, title, projectDescription, undergradTasks, qualifications,
				startSeason, startYear, yearsAllowed, questions, requiredClasses, minGPA, minHours, maxHours, opens,
				closes, labName, supervisor, numQuestions, titleIsValid, tasksAreValid, seasonIsValid, yearIsValid } = this.state;
			if (titleIsValid && tasksAreValid && seasonIsValid && yearIsValid){
				console.log("submitting form");
				axios.post('/opportunities', {
					netId, creatorNetId, labPage, areas, title, projectDescription, undergradTasks, qualifications, startSeason, startYear, yearsAllowed, questions, requiredClasses, minGPA, minHours, maxHours, opens, closes, labName, supervisor, numQuestions
				})

						.then((result) => {
								//access the results here....
								document.location.href = "/professorView"
						});
					}
				else{
					window.scrollTo(0, 0);
				}
		}


	displayQuestions(){

		var questionBoxes = [];
		for(var i = 0; i < this.state.numQuestions; i++){
			var stateLabel= "q"+ (i).toString();
			questionBoxes.push(
				<div key={stateLabel}>
				<span> {(i+1).toString()+". "} </span>
				<input name={i} value={this.state.questions[stateLabel]} onChange={this.handleQuestionState.bind(this,i)} className="question" type="text"/>
				<Delete size={30} id={i} onClick={this.deleteQuestion.bind(this, stateLabel)} className="deleter-icon"/>
				</div>
			);

		}
		return <div className="question-boxes">
					{questionBoxes}
				</div>;

	}

	deleteQuestion(data, e) {

		var deleted = parseInt(data.slice(1));
		var newQnum = this.state.numQuestions - 1;
		let questionsCopy = JSON.parse(JSON.stringify(this.state.questions));
		var questionsEdit = {};

		for (var question in questionsCopy){
			var num = parseInt(question.slice(1));
			if (num < deleted){
				questionsEdit[question] = questionsCopy[question];
			} else if (num > deleted) {
				var newString = "q"+(num-1).toString();
				questionsEdit[newString] = questionsCopy[question];
			}
		}


		this.setState({numQuestions: newQnum});

		this.setState({
			questions: questionsEdit
		});
		// setTimeout(() => {
    //           this.makeBoxes()
    //       }, 40);

	}


		//TODO: use this https://stackoverflow.com/questions/30483645/get-file-object-from-file-input so you don't get redirected everytime and can submit all data at once

	addQuestion(event) {

		let questionsCopy = JSON.parse(JSON.stringify(this.state.questions));
   	questionsCopy["q"+(this.state.numQuestions).toString()] = '';
   	this.setState({
      questions: questionsCopy
    });
		this.setState({numQuestions: this.state.numQuestions + 1});

	}



	createGpaOptions() {
		let options = [];
        for(let i=25; i<=43; i++){
			options.push( <option key={i} value={(i/10).toString()} >{(i/10).toString()}</option>);
		}
		return (
			<select name="gpa" className="gpa-select column column-90" value={this.state.minGPA} onChange={this.handleChange}>
				<option key="" value="" >Select Minimum GPA</option>
				{options}
			</select>
		);
	}
	setYears(){

		let yearArray = [];
		if (this.freshman.checked){
			yearArray.push('freshman');
		}
		if (this.sophomore.checked){
			yearArray.push('sophomore');
		}
		if (this.junior.checked){
			yearArray.push('junior');
		}
		if (this.senior.checked){
			yearArray.push('senior');
		}
		this.setState({yearsAllowed: yearArray});
	}
	handleChange(event) {

		if (event.target.name === "labName") {
			this.setState({labName: event.target.value});
		} else if (event.target.name === "netID") {
			this.setState({creatorNetId: event.target.value});
		} else if (event.target.name === "title") {
			if (event.target.value.length > 0){
				this.setState({titleIsValid: true});
			} else{
				this.setState({titleIsValid: false});
			}
				this.setState({title: event.target.value});
		} else if (event.target.name === "areas") {
			var areaArray= event.target.value.split(",");
			this.setState({areas: areaArray});
		} else if (event.target.name === "pi") {
			this.setState({pi: event.target.value});
		} else if (event.target.name === "supervisor") {
			this.setState({supervisor: event.target.value});
		}	else if (event.target.name === "descript") {
			this.setState({projectDescription: event.target.value});
		} else if (event.target.name === "tasks") {
			if (event.target.value.length > 0){
				this.setState({tasksAreValid: true});
			} else{
				this.setState({tasksAreValid: false});
			}
			this.setState({undergradTasks: event.target.value});
		} else if (event.target.name === "qual") {
			this.setState({qualifications: event.target.value});
		} else if (event.target.name === "classes") {
			var classArray= event.target.value.split(",");
			this.setState({areas: areaArray});
			this.setState({requiredClasses: classArray});
		} else if (event.target.name === "startSeason") {
			if (event.target.value != "Select"){
				this.setState({seasonIsValid: true});
			} else{
				this.setState({seasonIsValid: false});
			}
			this.setState({startSeason: event.target.value});
		} else if (event.target.name === "startYear") {
			if (event.target.value != "Select"){
				this.setState({yearIsValid: true});
			} else{
				this.setState({yearIsValid: false});
			}
			this.setState({startYear: event.target.value});
		} else if (event.target.name === "gpa") {
			this.setState({minGPA: event.target.value});
		} else if (event.target.name === "min") {
		 this.setState({minHours: event.target.value});
	 } else if (event.target.name === "max") {
		 this.setState({maxHours: event.target.value});
	 }


	}
	handleQuestionState(i){
		 	var stateLabel= "q" + i.toString()
			let questionsCopy = JSON.parse(JSON.stringify(this.state.questions))
	 		questionsCopy[stateLabel] = document.getElementsByName(i)[0].value;
    	this.setState({
      questions: questionsCopy
     });

	}
	handleOpenDateChange(date){
	 this.setState({opens: date});
	}
	handleCloseDateChange(date){
	 this.setState({closes: date});
	}
    onSubmit = (e) => {
        e.preventDefault();
        // get our form data out of state
        const { netId, creatorNetId, labPage, areas, title, projectDescription, undergradTasks, qualifications, startSeason, startYear, yearsAllowed, questions, requiredClasses, minGPA, minHours, maxHours, opens, closes, labName, supervisor, numQuestions, result } = this.state;

        axios.post('/api/opportunities', { netId, creatorNetId, labPage, areas, title, projectDescription, undergradTasks, qualifications, startSeason, startYear, yearsAllowed, questions, requiredClasses, minGPA, minHours, maxHours, opens, closes, labName, supervisor, numQuestions })
            .then((result) => {
                //access the results here....
                this.setState({submit: "Submitted!"});
                function sleep (time) {
                    return new Promise((resolve) => setTimeout(resolve, time));
                }
                sleep(1200).then(() => {
                    document.location.href = "/professorView";
                });
            });
    };
	render() {
		return (
			<div >
			<ProfNavbar current={"newopp"}/>
			<div className="row">
	    <div className="new-opp-form" >
			<div className="form-title">
			<h3>Create New Position</h3>
			<span className="required-star-top">* Required Fields</span>
			</div>
			<form className="form-body "
						id='createOpp'
						action='opportunities'
						method='post'
						onSubmit={this.onSubmit}
				>

					<div className={!this.state.titleIsValid && this.state.triedSubmitting ?"row input-row wrong":"row input-row"}>

						<span className="required-star">*</span>

						<input className="column column-90" placeholder="Position Title" type="text" name="title" value={this.state.title} onChange={this.handleChange}/>
						<InfoIcon data-tip data-for="info-title" className="info-icon" size={20}/>
						<ReactTooltip place='right' id='info-title' aria-haspopup='true' role='example'>
							<div className="info-text">
							 <span>Examples:</span>
							 <ul className="info-text">
							 <li> Molecular Mechanisms of Tissue Morphogenesis</li>
							 <li>Translational Regulation in Yeast Meiosis</li>
							 </ul>
							 </div>
						</ReactTooltip>


						</div>

						<div className={!this.state.tasksAreValid && this.state.triedSubmitting ? "row input-row wrong": "row input-row"}>
						<span className="required-star">*</span>
						<textarea className="column column-90" placeholder="Undergraduate Tasks" name="tasks" type="text" value={this.state.undergradTasks} onChange={this.handleChange}/>

							<InfoIcon data-tip data-for="info-tasks" className="info-icon column column-5" size={20}/>
							<ReactTooltip place='right' id='info-tasks' aria-haspopup='true' role='example'>
							<div className="info-text">
							 <span>Examples:</span>
							 <ul className="info-text">
							 <li>Presenting findings</li>
							 <li>Transcribing interviews</li>
							 <li>Microscopy</li>
							 <li>Caring for lab rats</li>
							 <li>Data analytics in Excel</li>
							 </ul>
							 </div>

							</ReactTooltip>
							</div>

							<div className="row input-row start-time">
							<span className="required-star">*</span>

							<select className={!this.state.seasonIsValid  && this.state.triedSubmitting? "startSeason wrong-select":"startSeason"} name="startSeason"  value={this.state.startSeason} onChange={this.handleChange}>
								<option value="Select" >Select Start Semester</option>
								<option value="Spring" >Spring Semester</option>
								<option value="Summer" >Summer Semester</option>
								{/*<option value="Winter" >Winter</option>*/}
								<option value="Fall" >Fall Semester</option>
							</select>

							<select className={!this.state.yearIsValid  && this.state.triedSubmitting? "startYear wrong-select":"startYear"} name="startYear"  value={this.state.startYear} onChange={this.handleChange}>
								<option value="Select" >Select Start Year</option>
								<option value="2018" >2018</option>
								<option value="2019" >2019</option>
							</select>
								<InfoIcon data-tip data-for="info-start" className=" info-icon" size={20}/>
								<ReactTooltip place='right' id='info-start' aria-haspopup='true' role='example'>
								<p className="info-text">Indicates the semester the student will start working in the lab.</p>

								</ReactTooltip>
								</div>


						<div className="row input-row optional">
						<input className="column column-90" placeholder="Position Supervisor" name="supervisor" type="text" value={this.state.supervisor} onChange={this.handleChange}/>
							<InfoIcon data-tip data-for="info-super" className="info-icon" size={20}/>
							<ReactTooltip place='right' id='info-super' aria-haspopup='true' role='example'>
								 <p className="info-text"> Your name or the name of other person who would be their direct supervisor.</p>

							</ReactTooltip>
							</div>
							<div className="row input-row optional">
							<textarea className="column column-90" placeholder="Project Description and Goals" name="descript" type="text" value={this.state.projectDescription} onChange={this.handleChange}/>

								<InfoIcon data-tip data-for="info-descript" className="info-icon column column-5" size={20}/>
								<ReactTooltip place='right' id='info-descript' aria-haspopup='true' role='example'>
									<p className="info-text">Example:</p>
									 <p className="info-text">Apprentice will conduct a genetic screen to discover
									 novel genes required for tissue morphogenesis and will be trained in
									  general wet-lab work and microdissection. </p>

								</ReactTooltip>
								</div>



									<div className="row input-row optional">
									<textarea className="column column-90" placeholder="Preferred Qualifications (i.e. completion of a class, familiarity with a subject)" name="qual" type="text" value={this.state.qualifications} onChange={this.handleChange}/>

										<InfoIcon data-tip data-for="info-quals" className="column column-5 info-icon" size={20}/>
										<ReactTooltip place='right' id='info-quals' aria-haspopup='true' role='example'>
										<div className="info-text">
										 <span>Examples:</span>
										 <ul className="info-text">
										 <li>Familiarity with molecular biology</li>
										 <li>Experience with automated image analysis</li>
										 <li>Passion for biomedical tech</li>
										 <li>Above B+ in Intro Chem</li>
										 </ul>
										 </div>

										</ReactTooltip>
										</div>

						<div className="hours row input-row optional">
						<input className="min-hours" placeholder="Min Hours" type="text" name="min" value={this.state.minHours} onChange={this.handleChange}/>


						<input className="max-hours" placeholder="Max Hours" type="text" name="max" value={this.state.maxHours} onChange={this.handleChange}/>
						<InfoIcon data-tip data-for="info-hours" className="info-icon column column-5" size={20}/>
						<ReactTooltip place='right' id='info-hours' aria-haspopup='true' role='example'>

						 <p className="info-text">Estimate the minimum hours you would expect the student to work each week and the maximum hours you would ever require.</p>

						</ReactTooltip>
						</div>

						<div className="row input-row optional">
						<input className="column column-90" placeholder="Required/Preferred Classes (Separate with commas, i.e. BIO 1110, MATH 1910)" type="text" name="classes" value={this.state.requiredClasses} onChange={this.handleChange}/>

							<InfoIcon data-tip data-for="info-classes" className="column column-5 info-icon" size={20}/>
							<ReactTooltip place='right' id='info-classes' aria-haspopup='true' role='example'>
							<div className="info-text">
							 <span>Examples:</span>
							 <ul className="info-text">
							 <li>CS 1110</li>
							 <li>MATH 1910</li>
							 </ul>
							 </div>

							</ReactTooltip>
							</div>

							<div className="row input-row optional">
							{this.createGpaOptions()}
								<InfoIcon data-tip data-for="info-gpa" className="column column-5 info-icon" size={20}/>
								<ReactTooltip place='right' id='info-gpa' aria-haspopup='true' role='example'>
								<div className="info-text">
								 <span>Students with a GPA lower than this minimum will be discouraged from applying.</span>

								 </div>

								</ReactTooltip>
								</div>


						<div className="years-allowed optional">
						<label  className="label-inline">Years Desired: </label>
							<input ref={(node) => {
								this.freshman = node
							}} onChange={this.setYears.bind(this)} type="checkbox" name="Freshman" value="Freshman"/>
							<label  className="label-inline">Freshmen </label>
							<input ref={(node) => {
								this.sophomore = node
							}} onChange={this.setYears.bind(this)} type="checkbox" name="Sophomore" value="Sophomore"/>
							<label  className="label-inline">Sophomores </label>
							<input ref={(node) => {
								this.junior = node
							}} onChange={this.setYears.bind(this)} type="checkbox" name="Junior" value="Junior"/>
							<label  className="label-inline">Juniors</label>
							<input ref={(node) => {
								this.senior = node
							}} onChange={this.setYears.bind(this)} type="checkbox" name="Senior" value="Senior"/>
							<label  className="label-inline">Seniors </label>
							</div>
							<div className="row input-row optional">
							<textarea className="column column-90" placeholder="Topics of Research (Please separate with commas)" type="text" name="areas" value={this.state.areas} onChange={this.handleChange}/>

								<InfoIcon data-tip data-for="info-topics" className="column column-5 info-icon" size={20}/>
								<ReactTooltip place='right' id='info-topics' aria-haspopup='true' role='example'>
								<div className="info-text">
								 <span>Examples:</span>
								 <ul className="info-text">
								 <li>Computational Biology</li>
								 <li>Natural Language Processing</li>
								 <li>Protein Classification</li>
								 </ul>
								 </div>
								</ReactTooltip>
								</div>





						<div className="date-pick-container ">
						<label  className="label-inline">Open Application Window: </label>
						<DatePicker className="datePicker"
						placeholderText="Select a date"
        		selected={this.state.opens}
        		onChange={this.handleOpenDateChange.bind(this)}
    				/>

						<label  className="label-inline ">Close Application Window: </label>
						<DatePicker className="datePicker"
        		selected={this.state.closes}
        		onChange={this.handleCloseDateChange.bind(this)}
    				/>
						</div>
						<hr/>
						<div className="question-adder">
						<h4>Application Questions</h4>

							<InfoIcon data-tip data-for="info-questions" className="info-icon-title" size={20}/>
							<ReactTooltip place='top' id='info-questions' aria-haspopup='true' role='example'>
							<p className="info-text-large">
              We recommend asking "Why are you interested in this lab and/or position?" to gauge interest.
              You will nonetheless be able to view each student{"'"}s cover letter, year, GPA, résumé,
							and major, in addition to their responses to these questions once they apply.</p>
							</ReactTooltip>
							<p>Here you can add any position-specific questions or
							requests for additional information, which students will be required to answer in order to apply.</p>

						{this.displayQuestions()}
						<div className="add-question" onClick={this.addQuestion}>
							<span>ADD QUESTION</span>
							<Add className="adder-icon" size={20}/>
						</div>

					</div>

					<div className="submit-div">
					<input className="button submit" type="submit" value="Submit New Position"/>
					</div>
				</form>

				</div>
				</div>
				<Footer/>

			</div>
		);
	}
}

export default CreateOppForm;
