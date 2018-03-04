import React, {Component} from 'react';
import axios from 'axios';
import '../../index.css';
import ApplicationBox from './ApplicationBox';
import * as Utils from '../Shared/Utils.js'

class ApplicationList extends Component {
	constructor(props) {
		super(props);
		this.state = { data: [] };
	}

	componentDidMount() {
		axios.post('/getApplications', {
			'id': '5a3c0f1df36d280c875969ed'
			//this is just syntax for getting the id from the url
			//the url is outsite.com/opportunity/:id, meaning :id can be any number. So this syntax gets us that id/number
		})
		.then((response) => {
			console.log(response.data);
			this.setState({ data: response.data });
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	shouldShow(application) {
		const filter = this.props.filter;

		let froshSelected = filter.yearSelect.Freshman;
		let sophSelected = filter.yearSelect.Sophomore;
		let juniorSelected = filter.yearSelect.Junior;
		let seniorSelected = filter.yearSelect.Senior;
		let gradYear = application.gradYear;

		if ((froshSelected && Utils.gradYearToString(gradYear) === 'Freshman') ||
				(sophSelected && Utils.gradYearToString(gradYear) === 'Sophomore') ||
				(juniorSelected && Utils.gradYearToString(gradYear) === 'Junior') ||
				(seniorSelected && Utils.gradYearToString(gradYear) === 'Senior') ||
				(!froshSelected && !sophSelected && !juniorSelected && !seniorSelected)) {
			
			let csSelected = filter.majorSelect.cs;
			let bioSelected = filter.majorSelect.biology;
			let major = application.major;

			if ((csSelected && major === 'CS') ||
					(bioSelected && major === 'Biology') ||
					(!csSelected && !bioSelected)) {

				let minGPA = filter.gpaSelect.val;

				if (minGPA === undefined || minGPA <= application.gpa) {
					return true;
				}
			}
		}

		return false;
	}
	
	render() {
		var apps = []
		var k = 0;
		for (var opp in this.state.data) {
			for (var app in opp) {
				var curApp = this.state.data[opp][app];
				if (curApp !== undefined) {
					curApp.opportunity = opp;
					apps.push(<ApplicationBox key={ k++ } data={ curApp } show={ this.shouldShow(curApp) } />);
				}
			}
		}
		return (
			<div>{ apps }</div>
		)
	}
}

export default ApplicationList
