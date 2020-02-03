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
        console.log('error in applicationsList.js');
        Utils.handleTokenError(error);
      });
  }

  coursesSatisfied(studentCourses, filterCourses) {
    studentCourses = studentCourses.map((course) => course.split(' ').join('').toUpperCase());
    return filterCourses.every((course) => studentCourses.includes(course));
  }

  skillsSatisfied(studentSkills, filterSkills) {
    studentSkills = studentSkills.map((skill) => skill.toUpperCase());
    filterSkills = filterSkills.map((skill) => skill.toUpperCase());
    return filterSkills.every((skill) => studentSkills.includes(skill));
  }

  shouldShow(application) {
    const { filter } = this.props;

    if (filter.opportunity.toLowerCase() !== 'all'
        && filter.opportunity !== application.opportunity) return false;

    const yearsSelected = filter.yearSelect;
    const { gradYear } = application;

    if (yearsSelected.includes(Utils.gradYearToGrade(gradYear))
       || yearsSelected.length === 0) {
      const minGPA = filter.gpaSelect;

      if (minGPA <= application.gpa) {
        return this.coursesSatisfied(application.courses, filter.courses)
                 && this.skillsSatisfied(application.skills, filter.skills);
      }
    }

    return false;
  }

  render() {
    const { data } = this.state;

    if (data.length === 0 || data === {} || Object.keys(data).length === 0) {
      return (
        <div>There are currently no applications.</div>
      );
    }

    const apps = [];
    let k = 0;

    Object.entries(data).forEach((oppAppPair) => {
      oppAppPair[1].applications.forEach((app) => {
        if (app.gpa == 5.0) app.gpa = 'No GPA';
        if (app !== undefined) {
          apps.push(
            <ApplicationBox
              key={k += 1}
              data={app}
              opportunity={oppAppPair[1].opportunity}
              show={this.shouldShow(app)}
            />,
          );
        }
      });
    });

    return (
      <div>{ apps }</div>
    );
  }
}

export default ApplicationList;
