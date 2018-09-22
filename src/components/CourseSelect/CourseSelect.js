import React, {Component} from 'react';
import './CourseSelect.scss';

class CourseSelect extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			courses: []
		}
	}

  addCourse() {
    let courses = [...this.state.courses];
    let cur = this.newText.value.split(' ').join('').toUpperCase();
    console.log(courses);
    console.log(cur);
    if (cur !== '' && !courses.includes(cur)) {
    	courses.push(cur);
    }
    this.setState({ courses });
  }

  removeFromArray(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
	}

  removeCourse(course) {
  	let courses = this.state.courses;
    this.removeFromArray(courses, course);
    this.setState({ courses });
  }

	render() {
		return (
			<div className="course-select">
				<div>
	        <input placeholder="enter course (ex: CS1110)" type="text" ref={(ip) => {this.newText = ip}}/>
	        <button className="add-button" onClick={this.addCourse.bind(this)}>Add</button>
	      </div>
        <ul>
          {
          	this.state.courses.map((course) => {
                return <li onClick={ () => this.removeCourse(course) }>{ course }</li>
          	})
          }
        </ul>
      </div>
		);
	}
}

export default CourseSelect;
