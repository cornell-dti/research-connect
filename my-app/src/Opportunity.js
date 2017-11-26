import React, { Component } from 'react';
import axios from 'axios';
import './index.css';

class Opportunity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      area: [], //required, area(s) of research (molecular bio, bioengineering, electrical engineering, computer science, etc.)
      labName: '',    //required
      labId: '',  //required
      pi: '', //required
      supervisor: '', //can be null
      projectDescription: '', //required, add min length that you see fit
      undergradTasks: '',  //what the undergrad would be doing, can be null
      opens: {type: Date, default: new Date()},   //if no date is sent use new Date()
      closes: {type: Date, default: null},  //null if rolling
      startDate: '', //null if start asap, string b/c it will prob be something like Fall 2018
      minSemesters: 0,   //can be null, indicating no min. minimum number of semesters they're expected to work in the lab
      minHours: 0, //can be null, indicating no minimum
      maxHours: 0, //can be null, indicating no max
      qualifications: '', //can be null/empty
      minGPA: 0, //0 if no minimum gpa required
      requiredClasses: [], //can be empty
      questions: [],    //can be empty
      yearsAllowed: [],  //required, do they accept freshman, sophomores, juniors, and/or seniors
      //applications: 0,   //number of people who've submitted, default 0, they don't submit this
      spots: 0
    };
  }
  render() {
    return (
      <tr>
          <td>{ this.props.title }</td>
          <td>{ this.props.area }</td>
          <td>{ this.props.labName }</td>
          <td>{ this.props.pi }</td>
          <td>{ this.props.supervisor }</td>
          <td>{ this.props.projectDescription }</td>
          <td>{ this.props.undergradTasks }</td>
          <td>{ this.props.opens }</td>
          <td>{ this.props.closes }</td>
          <td>{ this.props.startDate }</td>
          <td>{ this.props.minSemesters }</td>
          <td>{ this.props.minHours }</td>
          <td>{ this.props.maxHours }</td>
          <td>{ this.props.qualifications }</td>
          <td>{ this.props.minGPA }</td>
          <td>{ this.props.requiredClasses }</td>
          <td>{ this.props.questions }</td>
          <td>{ this.props.yearsAllowed }</td>
          <td>{ this.props.spots }</td>
      </tr>
    )
  }
}

export default Opportunity;
