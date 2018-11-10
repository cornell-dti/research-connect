import React, { Component } from 'react';
import axios from 'axios';
import './ApplicationList.scss';
import ApplicationBox from './ApplicationBox/ApplicationBox';
import * as Utils from '../Utils.js';

class ApplicationList extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], role: '' };
  }

  componentDidMount() {
    axios.get(`/api/applications?id=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        Utils.handleTokenError(error);
      });
  }

  coursesSatisfied(studentCourses, filterCourses) {
    studentCourses = studentCourses.map(course => course.split(' ').join('').toUpperCase());
    for (let i = 0; i < filterCourses.length; i++) {
      const course = filterCourses[i];
      if (!studentCourses.includes(course)) {
        return false;
      }
    }
    return true;
  }

  skillsSatisfied(studentSkills, filterSkills) {
    studentSkills = studentSkills.map(skill => skill.toUpperCase());
    filterSkills = filterSkills.map(skill => skill.toUpperCase());
    for (let i = 0; i < filterSkills.length; i++) {
      const skill = filterSkills[i];
      if (!studentSkills.includes(skill)) {
        return false;
      }
    }
    return true;
  }

  shouldShow(application) {
    const filter = this.props.filter;

    if (filter.opportunity.toLowerCase() !== 'all'
				&& filter.opportunity !== application.opportunity) return false;

    const froshSelected = filter.yearSelect.Freshman;
    const sophSelected = filter.yearSelect.Sophomore;
    const juniorSelected = filter.yearSelect.Junior;
    const seniorSelected = filter.yearSelect.Senior;
    const gradYear = application.gradYear;

    if ((froshSelected && Utils.gradYearToString(gradYear) === 'Freshman')
			|| (sophSelected && Utils.gradYearToString(gradYear) === 'Sophomore')
			|| (juniorSelected && Utils.gradYearToString(gradYear) === 'Junior')
			|| (seniorSelected && Utils.gradYearToString(gradYear) === 'Senior')
			|| (!froshSelected && !sophSelected && !juniorSelected && !seniorSelected)) {
      const csSelected = filter.majorSelect.cs;
      const bioSelected = filter.majorSelect.biology;
      const major = application.major;

      if ((csSelected && major === 'CS')
				|| (bioSelected && major === 'Biology')
				|| (!csSelected && !bioSelected)) {
        const minGPA = filter.gpaSelect.val;

        if (minGPA === undefined || minGPA <= application.gpa) {
          return this.coursesSatisfied(application.courses, filter.courses)
						  	 && this.skillsSatisfied(application.skills, filter.skills);
        }
      }
    }

    return false;
  }

  render() {
    const apps = [];
    let k = 0;
    const data = this.state.data;
    if (data.length === 0 || data === {} || Object.keys(data).length === 0) {
      return (<div>There are currently no applications.</div>);
    }

    for (const opp in data) {
      for (const app in data[opp].applications) {
        const curApp = data[opp].applications[app];
        const curOpp = data[opp].opportunity;
        if (curApp !== undefined) {
          apps.push(
            <ApplicationBox
              key={k++}
              data={curApp}
              opportunity={curOpp}
              show={this.shouldShow(curApp)}
            />,
          );
        }
      }
    }
    return (
      <div>{ apps }</div>
    );
  }
}

export default ApplicationList;
