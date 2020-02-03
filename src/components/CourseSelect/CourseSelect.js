import React, { Component } from 'react';
import './CourseSelect.scss';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';

class CourseSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  addCourse(e) {
    e.preventDefault();
    const courses = [...this.state.courses];
    const cur = this.newText.value.split(' ').join('').toUpperCase();
    if (cur !== '' && !courses.includes(cur)) {
    	courses.push(cur);
    }
    this.setState({ courses }, () => this.props.updateCourses(courses));
    this.newText.value = '';
  }

  removeFromArray(arr) {
    let what; const a = arguments; let L = a.length; let
      ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  removeCourse(course) {
  	const courses = this.state.courses;
    this.removeFromArray(courses, course);
    this.setState({ courses }, () => this.props.updateCourses(courses));
  }

  render() {
    return (
      <div className="course-select">
        <div>
          <input placeholder="enter CS courses taken (ex: CS1110)" type="text" ref={(ip) => { this.newText = ip; }} />
          <button className="add-button" onClick={this.addCourse.bind(this)}>Add</button>
        </div>
        <ul>
          {
          	this.state.courses.map(course => (
            <li onClick={() => this.removeCourse(course)}>
              { course }
              {' '}
              <FaTimesCircle style={{ verticalAlign: 'text-top' }} />
            </li>
          	))
          }
        </ul>
      </div>
    );
  }
}

export default CourseSelect;
