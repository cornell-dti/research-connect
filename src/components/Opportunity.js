import React, {Component} from 'react';

import '../index.css';


import {BrowserRouter as Router} from 'react-router-dom'

import OpportunityJSON from './Opportunity.json'
import '../opportunities.css';
import CheckBox from 'react-icons/lib/fa/check-square-o';
import CrossCircle from 'react-icons/lib/fa/exclamation-circle';
import Calendar from 'react-icons/lib/fa/calendar-check-o';

class Opportunity extends Component {
	constructor(props) {
		super(props);
		// this.state = {
		//     title: '',
		//     area: [], //required, area(s) of research (molecular bio, bioengineering, electrical engineering, computer science, etc.)
		//     labName: '',    //required
		//     labId: '',  //required
		//     pi: '', //required
		//     supervisor: '', //can be null
		//     projectDescription: '', //required, add min length that you see fit
		//     undergradTasks: '',  //what the undergrad would be doing, can be null
		//     opens: {type: Date, default: new Date()},   //if no date is sent use new Date()
		//     closes: {type: Date, default: null},  //null if rolling
		//     startDate: '', //null if start asap, string b/c it will prob be something like Fall 2018
		//     minSemesters: 0,   //can be null, indicating no min. minimum number of semesters they're expected to work in the lab
		//     minHours: 0, //can be null, indicating no minimum
		//     maxHours: 0, //can be null, indicating no max
		//     qualifications: '', //can be null/empty
		//     minGPA: 0, //0 if no minimum gpa required
		//     requiredClasses: [], //can be empty
		//     questions: [],    //can be empty
		//     yearsAllowed: [],  //required, do they accept freshman, sophomores, juniors, and/or seniors
		//     //applications: 0,   //number of people who've submitted, default 0, they don't submit this
		//     spots: 0
		// };
		this.state = OpportunityJSON;
	}

	contains(needle) {
		var findNaN = isNaN(needle);
		var indexOf;

		if (!findNaN && typeof Array.prototype.indexOf === 'function') {
			indexOf = Array.prototype.indexOf;
		} else {
			indexOf = function (needle) {
				var i = -1, index = -1;

				for (i = 0; i < this.length; i++) {
					var item = this[i];

					if ((findNaN && isNaN(item)) || item.toLowerCase() === needle.toLowerCase()) {
						index = i;
						break;
					}
				}

				return index;
			};
		}

		return indexOf.call(this, needle) > -1;
	};

	/**
	 * takes the filteredOptions passed all the way down from Opportunities.js through the props
	 * and compare the fileredOptions to the years allowed passed through props by the opportunity list that has all the info about opportunities
	 * @return {boolean} based on the filter paramterse, whether or not each opportunity should show
	 */
	shouldShow() {
		const filteredOptions = this.props.filteredOptions;
		/**
		 * filter for years allowed. Saying if the Freshman option is checked (hence the .Freshman, since it's a checkbox
		 so that value must either be true or false) and if this row has freshman in its array of years allowed, then
		 we return true and should show this opportunity
		 */
		let froshSelected = filteredOptions.yearSelect.Freshman;
		let sophSelected = filteredOptions.yearSelect.Sophomore;
		let juniorSelected = filteredOptions.yearSelect.Junior;
		let seniorSelected = filteredOptions.yearSelect.Senior;
		let yearsAllowed = this.props.yearsAllowed;
		if ((froshSelected && yearsAllowed.indexOf("freshman") !== -1) ||
			(sophSelected && yearsAllowed.indexOf("sophomore") !== -1) ||
			(juniorSelected && yearsAllowed.indexOf("junior") !== -1) ||
			(seniorSelected && yearsAllowed.indexOf("senior") !== -1) ||
			(!froshSelected && !sophSelected && !juniorSelected && !seniorSelected)) {
			/**
			 * Similar to above, checks if the cs box is checked in the majorSelect component (a bunch of major checkboxes)
			 * and also checks to see if this opportunity is in the cs area.
			 * */
			let csSelected = filteredOptions.majorSelect.cs;
			let bioSelected = filteredOptions.majorSelect.biology;
			let area = this.props.area;
			if ((csSelected && area.indexOf("Computer Science") !== -1) ||
				(bioSelected && area.indexOf("Biology") !== -1) ||
				(!csSelected && ! bioSelected)) {

				let minGPA = filteredOptions.gpaSelect.val;

				if ((minGPA==null)||(minGPA >= this.props.minGPA)){
				  return true;
				}
				}

		}
		return false;
	}

	clickRow(rowObj) {
		// this.props.history.push({pathname: 'opportunity/' + this.props.opId});
		document.location.href = ('http://localhost:3000/opportunity/' + this.props.opId);
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

	convertDescription(str){
	  if (str.length > 250) {
		str = str.slice(0,250)+"... ";
		return(<p>{str}<span className="viewDetails">View Details</span> </p>);
	  } else {
		return(<p>{str} </p>);
	  }
	}

	checkPrereqs() {
		if (this.props.title==='Project1') {
			return(<div><CheckBox className="greenCheck"/> <span>All Prereqs Met</span></div>);
		} else {
			return(<div><CrossCircle className="redX"/> <span>Prereqs Missing</span></div>);
		}
	}

	checkOpen() {
		var openDateObj = new Date(this.props.opens);
		var closesDateObj = new Date(this.props.closes);
		var nowTime = Date.now()
		if (closesDateObj.getTime() < nowTime) {
			return "Closed";
		} else if (openDateObj.getTime() > nowTime) {
			return "Not Open Yet";
		} else {
			return "Open";
		}
	}

	render() {
		return (
			<div className="application-box" onClick={this.clickRow.bind(this)} style={{display: this.shouldShow() ? "" : "none"}}>
			<div className="row">
 				<div className="column column-75">
				<h3>{ this.props.title }</h3>
				</div>
 				<div className="column column-25">
					<Calendar className="cal"/>
					<span> Deadline { this.convertDate(this.props.closes) }</span>
					{this.checkPrereqs()}
				</div>
 			</div>

				{/*  <p>{ this.props.labName }</p> */}
				<p>Lab Name</p>
				{ this.convertDescription(this.props.projectDescription) }



				{/*
				<p>{ this.props.area }</p>
				<p>{ this.props.pi }</p>
				<p>{ this.props.supervisor }</p>

				<p>{ this.props.undergradTasks }</p>
				<p>{ this.props.opens }</p>

				<p>{ this.props.starpate }</p>
				<p>{ this.props.minSemesters }</p>
				<p>{ this.props.minHours }</p>
				<p>{ this.props.maxHours }</p>
				<p>{ this.props.qualifications }</p>
				<p>{ this.props.minGPA }</p>
				<p>{ this.props.requiredClasses }</p>
				/*<p>{ this.props.questions }</p>
				<p>{ this.props.yearsAllowed }</p>
				<p>{ this.props.spots }</p> */ }
			</div>
		)
	}
}

export default Opportunity;
