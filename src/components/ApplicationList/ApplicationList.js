import React, {Component} from 'react';
import axios from 'axios';
import './ApplicationList.scss';
import ApplicationBox from './ApplicationBox/ApplicationBox';
import * as Utils from '../Utils.js'

class ApplicationList extends Component {
	constructor(props) {
		super(props);
		this.state = {data: [], role: ""};
	}

	componentDidMount() {
		axios.get('/api/applications?id=' + sessionStorage.getItem('token_id'))
			.then((response) => {
				this.setState({data: response.data});
			})
			.catch(function (error) {
				Utils.handleTokenError(error);
			});
	}

	coursesSatisfied(studentCourses, filterCourses) {
		studentCourses = studentCourses.map((course) => course.split(' ').join('').toUpperCase());
		for (var i = 0; i < filterCourses.length; i++) {
			const course = filterCourses[i];
			if (!studentCourses.includes(course)) {
				return false;
			}
		}
		return true;
	}

	skillsSatisfied(studentSkills, filterSkills) {
		studentSkills = studentSkills.map((skill) => skill.toUpperCase());
		filterSkills = filterSkills.map((skill) => skill.toUpperCase());
		for (var i = 0; i < filterSkills.length; i++) {
			const skill = filterSkills[i];
			if (!studentSkills.includes(skill)) {
				return false;
			}
		}
		return true;
	}

	shouldShow(application) {
		const filter = this.props.filter;

		if (filter.opportunity.toLowerCase() !== 'all' && 
				filter.opportunity !== application.opportunity) return false;

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
					return this.coursesSatisfied(application.courses, filter.courses) &&
						  	 this.skillsSatisfied(application.skills, filter.skills);
				}
			}
		}

		return false;
	}

	render() {
		let apps = [];
		let k = 0;
		const data = this.state.data;
		if (data.length === 0 || data === {} || Object.keys(data).length === 0) {
			return (<div>There are currently no applications.</div>);
		}
		else {
			for (let opp in data) {
				for (let app in data[opp].applications) {
					let curApp = data[opp].applications[app];
					let curOpp = data[opp].opportunity;
					if (curApp !== undefined) {
						apps.push(
							<ApplicationBox 
								key={ k++ } 
								data={ curApp } 
								opportunity={ curOpp }
								show={ this.shouldShow(curApp) } />
						);
					}
				}
			}
			return (
				<div>{ apps }</div>
			)
		}
	}
}

export default ApplicationList
