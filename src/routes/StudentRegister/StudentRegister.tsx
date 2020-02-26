import React, { Component, ChangeEvent } from 'react';
import axios from 'axios';
import * as ReactGA from 'react-ga';
import '../App/App.scss';
import Footer from '../../components/Footer/Footer';
import CourseSelect from '../../components/CourseSelect/CourseSelect';
import './StudentRegister.scss';
import * as Utils from '../../components/Utils';
import { majorList } from '../../components/constants';

const gradYears = [
  new Date().getFullYear(),
  new Date().getFullYear() + 1,
  new Date().getFullYear() + 2,
  new Date().getFullYear() + 3,
  new Date().getFullYear() + 4,
];

type State = {
  firstName: string;
  lastName: string;
  gradYear: string;
  major: string;
  GPA: string;
  netId: string;
  email: string;
  courses: string[];
  firstNameValid: boolean;
  lastNameValid: boolean;
  gradYearValid: boolean;
  majorValid: boolean;
  triedSubmitting: boolean;
  isButtonDisabled: boolean;
  buttonValue: string;
};

class StudentRegister extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      gradYear: '',
      major: '',
      GPA: '',
      netId: '',
      email: '',
      courses: [],
      firstNameValid: false,
      lastNameValid: false,
      gradYearValid: false,
      majorValid: false,
      triedSubmitting: false,
      isButtonDisabled: false,
      buttonValue: 'Submit',
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  optionify(inputArray: (string | number)[], inputName: string) {
    const newArray: JSX.Element[] = [];
    for (let i = 0; i < inputArray.length; i++) {
      newArray.push(
        <option key={inputArray[i]} value={inputArray[i]}>
          {inputArray[i]}
        </option>,
      );
    }

    let placehold = 'Select';
    let validName;

    if (inputName === 'gradYear') {
      placehold = 'Select Graduation Year';
      validName = this.state.gradYearValid;
    } else if (inputName === 'major') {
      placehold = 'Select Major';
      validName = this.state.majorValid;
    }

    return (
      <select
        className={!validName && this.state.triedSubmitting ? 'error left-input' : 'left-input'}
        name={inputName}
        value={inputName}
        onChange={this.onChange}
      >
        <option id={inputName} key="empty" value="">{placehold}</option>
        {newArray}
      </select>
    );
  }

  onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    const { name } = e.target;
    if (name !== 'courses') {
      const validationName = `${name}Valid`;
      // @ts-ignore: too dynamic
      this.setState({ [name]: e.target.value });
      if (name === 'gradYear' || name === 'major') {
        document.getElementById(name)!.innerHTML = e.target.value;
      }

      // @ts-ignore: too dynamic
      this.setState({ [validationName]: e.target.value !== '' });
    } else {
      this.setState({ courses: (e.target.value).replace(/ /g, '').split(',') });
    }
  };

  handleUpdateCourses = (courseList: string[]) => this.setState({ courses: courseList });

  onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // get our form data out of state
    const {
      firstName,
      lastName,
      gradYear,
      major,
      GPA,
      netId,
      email,
      courses,
      firstNameValid,
      lastNameValid,
      gradYearValid,
      majorValid,
    } = this.state;
    const token_id = sessionStorage.getItem('token_id');

    if (firstNameValid && lastNameValid && gradYearValid && majorValid) {
      const getUrl = window.location;
      const baseUrl = `${getUrl.protocol}//${getUrl.host}`;
      axios.post('/api/undergrads', {
        firstName, lastName, gradYear, major, GPA, netId, email, courses, token_id,
      })
        .then(() => {
          this.setState({ isButtonDisabled: true });
          this.setState({ buttonValue: 'Submitted!' });

          window.location.replace(`${baseUrl}/opportunities`);
        }).catch((error) => {
          // if it's not a session error...
          if (!Utils.handleTokenError(error)) {
            Utils.handleNonTokenError(error);
          }
        });
    } else if (!firstNameValid) {
      alert('First name is required.');
    } else if (!lastNameValid) {
      alert('Last name is required.');
    } else if (!gradYearValid) {
      alert('Graduation year is required.');
    } else if (!majorValid) {
      alert('Major is required.');
    }
  };

  render() {
    const { firstName, lastName } = this.state;
    return (
      <div>
        <div className="student-reg-form">
          <h3>Student Registration</h3>
          <form id="studentForm" onSubmit={this.onSubmit}>
            <input
              className={!this.state.firstNameValid && this.state.triedSubmitting ? 'error left-input' : 'left-input'}
              placeholder="First Name"
              type="text"
              name="firstName"
              value={firstName}
              id="firstName"
              onChange={this.onChange}
            />
            <input
              className={!this.state.lastNameValid && this.state.triedSubmitting ? 'error left-input' : 'left-input'}
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              id="lastName"
              onChange={this.onChange}
            />

            {this.optionify(gradYears, 'gradYear')}
            {this.optionify(majorList, 'major')}

            <div className="student-register-course-select">
              <CourseSelect updateCourses={this.handleUpdateCourses} />
            </div>

            <br />
            <div className="centered">
              <input
                type="submit"
                className="button"
                value={this.state.buttonValue}
                disabled={this.state.isButtonDisabled}
              />
            </div>
          </form>

        </div>
        <Footer />
      </div>
    );
  }
}

export default StudentRegister;
