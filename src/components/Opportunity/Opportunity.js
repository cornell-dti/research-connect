import React, {Component} from 'react';
import axios from 'axios';
import '../../index.css';
import {BrowserRouter as Router} from 'react-router-dom'
import OpportunityJSON from './Opportunity.json'
import './Opportunity.scss';
import CheckBox from 'react-icons/lib/fa/check-square-o';
import CrossCircle from 'react-icons/lib/fa/exclamation-circle';
import Calendar from 'react-icons/lib/fa/calendar-check-o';
import * as Utils from '../Utils.js';

class Opportunity extends Component {

	constructor(props) {
		super(props);
		this.state = OpportunityJSON;
	}

	contains(needle) {
		let findNaN = isNaN(needle);
		let indexOf;

		if (!findNaN && typeof Array.prototype.indexOf === 'function') {
			indexOf = Array.prototype.indexOf;
		} else {
			indexOf = needle => {
				this.findIndex(item => findNaN && isNaN(item)) || item.toLowerCase() === needle.toLowerCase());
			};
		}

		return indexOf.call(this, needle) > -1;
	};

	clickRow(rowObj) {
		document.location.href = ('/opportunity/' + this.props.opId);
	}

	convertDescription(str1, str2){
		if(str1.length === 0){
			if (str2.length > 250) {
				str2 = str2.slice(0,250)+"... ";
				return(<h6>{str2}<span className="viewDetails">View Details</span> </h6>);
		  } else {
				return(<h6>{("Tasks: ")+str2} </h6>);
			}
		} else{
			if (str1.length > 250) {
				str1 = str1.slice(0,250)+"... ";
				return(<div className="description-div">{str1}<span className="viewDetails">View Details</span></div>);
			} else {
				return(<div className="description-div">{("Description: ")+str1} </div>);
		  }
		}
	}

	checkPrereqs() {
		if (this.props.prereqsMatch === true) {
			return(<div><CheckBox className="greenCheck"/> <span>All Prereqs Met</span></div>);
		} else {
			return(<div><CrossCircle className="redX"/> <span>Prereqs Missing</span></div>);
		}
	}

	checkOpen() {
		let openDateObj = new Date(this.props.opens);
		let closesDateObj = new Date(this.props.closes);
		let nowTime = Date.now()
		if (closesDateObj.getTime() < nowTime) {
			return "Closed";
		} else if (openDateObj.getTime() > nowTime) {
			return "Not Open Yet";
		} else {
			return "Open";
		}
	}

	checkEdit () {
		let lab = false;
		axios.get('/api/role/' + sessionStorage.getItem('token_id'))
      .then((response) => {
				if (!response || response.data == "none" ||
				 !response.data || response.data == "undergrad"){
					return false;
				} else {
					return true;
				}
		});
	}

	render() {
		return (
			<div className="opportunity-card" onClick={this.clickRow.bind(this)}>
				<div className="row opp-box-row">
					<div className="column column-75">
						<div className="title">{ this.props.title }</div>
						<div className="lab-name">{this.props.labName}</div>
					</div>

					<div className="column column-25">
						<Calendar className="cal"/> <span>Deadline { Utils.convertDate(this.props.closes) }</span>
						{this.checkPrereqs()}
					</div>
				</div>

				{ this.convertDescription(this.props.projectDescription, this.props.undergradTasks) }
			</div>
		);
	}
}

export default Opportunity;
