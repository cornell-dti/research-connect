import React from 'react';
import '../CreateOpportunityForm.css';
import YearSelect from '../components/YearSelect.js';
import GPASelect from '../components/GPASelect.js';

class CreateOppForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			labPage: '',
			title: '',
			projectDescription: '',
			undergradTasks: '',
			qualifications: '',
			spots: '',
			startSeason: '',
			startYear: '',
			yearsAllowed: '',
			questions: '',
			requiredClasses: '',
			minGPA: '',
			minHours: '',
			maxHours: '',
			opens: '',
			closes: '',
			areas: [],
			labName: '',
			supervisor: '',

			numQuestions: 0

		};

		this.handleChange = this.handleChange.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}


	handleChange(event) {
		if (event.target.name === "labName") {
			this.setState({labName: event.target.value});
		} else if (event.target.name === "netID") {
			this.setState({creatorNetId: event.target.value});
		} else if (event.target.name === "title") {
			this.setState({title: event.target.value});
		} else if (event.target.name === "area") {
			this.setState({area: event.target.value});
		} else if (event.target.name === "pi") {
			this.setState({pi: event.target.value});
		} else if (event.target.name === "supervisor") {
			this.setState({supervisor: event.target.value});
		}


	}

	handleSubmit(event) {
		alert('NetID:' + this.state.creatorNetId + ' labName: ' + this.state.labName);
		event.preventDefault();
		//TODO: use this https://stackoverflow.com/questions/30483645/get-file-object-from-file-input so you don't get redirected everytime and can submit all data at once
	}

	addQuestion(event) {
		this.setState({numQuestions: this.state.numQuestions + 1});

	}

	deleteLastQuestion(event) {
		this.setState({numQuestions: this.state.numQuestions - 1});
	}

	makeBoxes() {
		var questionBoxes = [];
		for (var i = 0; i < this.state.numQuestions; i++) {
			questionBoxes.push(<input type="text"/>);
			questionBoxes.push(<br />);

		}
		return (
			<div>
				{questionBoxes}
			</div>
		);
	}

	render() {
		return (
			<div>
			<div className="header"></div>
	    <div className="new-opp-form" >
			<h3>Create New Position</h3>
				<form onSubmit={this.handleSubmit}>

						<input placeholder="Position Title" type="text" name="title" value={this.state.title} onChange={this.handleChange}/>
<input placeholder="Position Supervisor" name="supervisor" type="text" value={this.state.supervisor} onChange={this.handleChange}/>
						<textarea placeholder="Project Description" name="descript" type="text" value={this.state.projectDescription} onChange={this.handleChange}/>

						<textarea placeholder="Undergraduate Tasks" name="tasks" type="text" value={this.state.undergradTasks} onChange={this.handleChange}/>
						<textarea placeholder="Qualifications" name="qual" type="text" value={this.state.qualifications} onChange={this.handleChange}/>

						<textarea placeholder="Areas" type="text" name="areas" value={this.state.area} onChange={this.handleChange}/>
						<input placeholder="# Available Spots" type="text" name="spots" value={this.state.spots} onChange={this.handleChange}/>
						<input placeholder="Required/Recommended Classes" type="text" name="classes" value={this.state.requiredClasses} onChange={this.handleChange}/>

						<select value={this.state.startSeason} onChange={this.handleChange}>
						<option value="Select" >Select Start Season</option>
							<option value="Spring" >Spring</option>
		                <option value="Summer" >Summer</option>
		          <option value="Fall" >Fall</option>

		    		</select>
						<select value={this.state.startYear} onChange={this.handleChange}>
						<option value="Select" >Select Start Year</option>
							<option value="2018" >2018</option>
		                <option value="2019" >2019</option>
		    			</select>
							<YearSelect/>
							<GPASelect/>
							<input placeholder="Min Hours" type="text" name="min" value={this.state.minHours} onChange={this.handleChange}/>
							<input placeholder="Max Hours" type="text" name="max" value={this.state.maxHours} onChange={this.handleChange}/>
							 {/* put open and close date calendars/date selectors here*/}



						<p>You can optionally add position-specific questions that students must answer in order to apply:</p>
						<div className="question-adder">
					<input className="button add" type="button" value="Add a question" onClick={this.addQuestion}/>
					{this.state.numQuestions !== 0 ? <input className="button" type="button" value="Remove a question"
														   onClick={this.deleteLastQuestion.bind(this)}/> : '' }

					{this.makeBoxes()}
					</div>


					<input className="button submit" type="submit" value="Submit"/>

				</form>

				</div>
			</div>
		);
	}
}

export default CreateOppForm;
