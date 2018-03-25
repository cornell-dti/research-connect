import React from 'react';
import '../CreateOpportunityForm.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Navbar from '../components/ProfNavbar'
import axios from 'axios';
import Footer from '../components/Footer';
import 'react-datepicker/dist/react-datepicker.css';

class CreateOppForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			labPage: '',
			areas: [],
			title: '',
			projectDescription: '',
			undergradTasks: '',
			qualifications: '',
			spots: '',
			startSeason: '',
			startYear: '',
			yearsAllowed: [],
			questions: {},
			requiredClasses: [],
			minGPA: '',
			minHours: '',
			maxHours: '',
			opens: moment(),
			closes: moment(),
			labName: '',
			supervisor: '',
			numQuestions: 0,
			result: <div></div>

		};

		this.handleChange = this.handleChange.bind(this);
		this.addQuestion = this.addQuestion.bind(this);


	}






		//TODO: use this https://stackoverflow.com/questions/30483645/get-file-object-from-file-input so you don't get redirected everytime and can submit all data at once


	addQuestion(event) {

		let questionsCopy = JSON.parse(JSON.stringify(this.state.questions));
   	questionsCopy["q"+(this.state.numQuestions).toString()] = '';
   	this.setState({
      questions: questionsCopy
    });
		this.setState({numQuestions: this.state.numQuestions + 1});
		setTimeout(() => {
              this.makeBoxes()
          }, 40);
	}

	deleteLastQuestion(event) {

		this.setState({numQuestions: this.state.numQuestions - 1});
		let questionsCopy = JSON.parse(JSON.stringify(this.state.questions));
		delete questionsCopy["q"+(this.state.numQuestions-1).toString()];
		this.setState({
      questions: questionsCopy
    });
		setTimeout(() => {
              this.makeBoxes()
          }, 40);
	}

	makeBoxes() {
		var questionBoxes = [];
		for (var i = 0; i < this.state.numQuestions; i++) {
			var stateLabel= "q"+ (i).toString();
			questionBoxes.push(<span key={(i).toString() +" label"}>{(i+1).toString()+". "}</span>);
			questionBoxes.push(<input name={i} key={i} onChange={this.handleQuestionState.bind(this,i)} className="question" type="text"/>);
			questionBoxes.push(<br key={(i).toString() +" break"}/>);

		}
		this.setState({result: <div className="question-boxes">
			{questionBoxes}
		</div>});
	}
	createGpaOptions() {
		var options = [];
		for(var i=25; i<=43; i++){
			options.push( <option key={i} value={(i/10).toString()} >{(i/10).toString()}</option>);
		}
		return (
			<select name="gpa" className="gpa-select" value={this.state.minGPA} onChange={this.handleChange}>
				<option key="" value="" >Select Minimum GPA</option>
				{options}
			</select>
		);
	}
	setYears(){

		var yearArray = [];
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
			this.setState({undergradTasks: event.target.value});
		} else if (event.target.name === "qual") {
			this.setState({qualifications: event.target.value});
		} else if (event.target.name === "spots") {
			this.setState({spots: event.target.value});
		} else if (event.target.name === "classes") {
			var classArray= event.target.value.split(",");
			this.setState({areas: areaArray});
			this.setState({requiredClasses: classArray});
		} else if (event.target.name === "startSeason") {
			this.setState({startSeason: event.target.value});
		} else if (event.target.name === "startYear") {
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
        const { labPage, areas, title, projectDescription, undergradTasks, qualifications, spots, startSeason, startYear, yearsAllowed, questions, requiredClasses, minGPA, minHours, maxHours, opens, closes, labName, supervisor, numQuestions, result } = this.state;

        axios.post('http://localhost:3001/createOpportunity', { labPage, areas, title, projectDescription, undergradTasks, qualifications, spots, startSeason, startYear, yearsAllowed, questions, requiredClasses, minGPA, minHours, maxHours, opens, closes, labName, supervisor, numQuestions })
            .then((result) => {
                //access the results here....
            });
    }

	render() {
		return (
			<div>
			<Navbar/>
	    <div className="new-opp-form" >
			<div className="form-title">
			<h3>Create New Position</h3>
			</div>
			<form
						id='createOpp'
						action='createOpportunity'
						method='post'
						onSubmit={this.onSubmit}
				>

						<input placeholder="Position Title" type="text" name="title" value={this.state.title} onChange={this.handleChange}/>

						<input placeholder="Position Supervisor" name="supervisor" type="text" value={this.state.supervisor} onChange={this.handleChange}/>

						<textarea placeholder="Project Description" name="descript" type="text" value={this.state.projectDescription} onChange={this.handleChange}/>

						<textarea placeholder="Undergraduate Tasks" name="tasks" type="text" value={this.state.undergradTasks} onChange={this.handleChange}/>

						<textarea placeholder="Position Qualifications" name="qual" type="text" value={this.state.qualifications} onChange={this.handleChange}/>

						<div className="hours">
						<input className="min-hours" placeholder="Min Hours" type="text" name="min" value={this.state.minHours} onChange={this.handleChange}/>

						<input className="max-hours" placeholder="Max Hours" type="text" name="max" value={this.state.maxHours} onChange={this.handleChange}/>
						</div>

						<input placeholder="Required/Recommended Classes (Please separate with commas)" type="text" name="classes" value={this.state.requiredClasses} onChange={this.handleChange}/>


							{this.createGpaOptions()}


						<div className="years-allowed">
						<label  className="label-inline">Years Allowed: </label>
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

							<textarea placeholder="Topics of Research (Please separate with commas)" type="text" name="areas" value={this.state.areas} onChange={this.handleChange}/>

							<input placeholder="# Available Spots" type="text" name="spots" value={this.state.spots} onChange={this.handleChange}/>


						<div className="start-time">
						<select name="startSeason" className="startSeason" value={this.state.startSeason} onChange={this.handleChange}>
							<option value="Select" >Select Start Season</option>
							<option value="Spring" >Spring</option>
							<option value="Summer" >Summer</option>
							<option value="Winter" >Winter</option>
							<option value="Fall" >Fall</option>
						</select>

						<select name="startYear" className="startYear" value={this.state.startYear} onChange={this.handleChange}>
							<option value="Select" >Select Start Year</option>
							<option value="2018" >2018</option>
							<option value="2019" >2019</option>
						</select>
						</div>

						<div className="date-pick-container">
						<label  className="label-inline">Open Application Window: </label>
						<DatePicker className="datePicker"
        		selected={this.state.opens}
        		onChange={this.handleOpenDateChange.bind(this)}
    				/>

						<label  className="label-inline">Close Application Window: </label>
						<DatePicker className="datePicker"
        		selected={this.state.closes}
        		onChange={this.handleCloseDateChange.bind(this)}
    				/>
						</div>


						<p>You can optionally add position-specific questions that students must answer in order to apply:</p>

						<div className="question-adder">
						<input className="button-small button" type="button" value="Add a question" onClick={this.addQuestion}/>
						{this.state.numQuestions !== 0 ? <input className="button-small button remove" type="button" value="Remove a question"
														   onClick={this.deleteLastQuestion.bind(this)}/> : '' }

						{this.state.result}
					</div>

					<div className="submit-div">
					<input className="button submit" type="submit" value="Submit"/>
					</div>
				</form>

				</div>
				<Footer/>
			</div>
		);
	}
}

export default CreateOppForm;
