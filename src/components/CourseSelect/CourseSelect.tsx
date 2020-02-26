import React, { Component, MouseEvent } from 'react';
import './CourseSelect.scss';
// @ts-ignore
import FaTimesCircle from 'react-icons/lib/fa/times-circle';

type Props = { updateCourses: (courses: string[]) => void };
type State = { courses: string[] };

class CourseSelect extends Component<Props, State> {
  state: State = { courses: [] };

  newText?: HTMLInputElement | null;

  addCourse = (e: MouseEvent) => {
    e.preventDefault();
    this.setState(
      (state) => {
        const courses = [...state.courses];
        const cur = this.newText!.value.split(' ').join('').toUpperCase();
        if (cur !== '' && !courses.includes(cur)) {
          courses.push(cur);
        }
        return { courses };
      },
      () => this.props.updateCourses(this.state.courses),
    );
    this.newText!.value = '';
  };

  removeCourse = (course: string) => {
    this.setState(
      (state) => ({ courses: state.courses.filter((c) => c !== course) }),
      () => this.props.updateCourses(this.state.courses),
    );
  };

  render() {
    return (
      <div className="course-select">
        <div>
          <input placeholder="enter CS courses taken (ex: CS1110)" type="text" ref={(ip) => { this.newText = ip; }} />
          <button type="button" className="add-button" onClick={this.addCourse}>Add</button>
        </div>
        <ul>
          {
            this.state.courses.map((course, i) => (
              <li key={course} onClick={() => this.removeCourse(course)}>
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
