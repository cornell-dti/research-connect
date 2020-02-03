import React, { Component } from 'react';
import axios from 'axios';
import '../App/App.scss';
import Dropzone from 'react-dropzone';
import Footer from '../../components/Footer/Footer';
import CourseSelect from '../../components/CourseSelect/CourseSelect';
import './StudentRegister.scss';
import * as Utils from '../../components/Utils';
import * as ReactGA from 'react-ga';

ReactGA.pageview(window.location.pathname + window.location.search);


const majorList = Utils.getMajorList();
const gradYears = [new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2, new Date().getFullYear() + 3, new Date().getFullYear() + 4];

class StudentRegister extends Component {
  constructor(props) {
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
      file: null,
      resume: null,
      transcript: null,
      firstNameValid: false,
      lastNameValid: false,
      gradYearValid: false,
      majorValid: false,
      GPAValid: false,
      resumeValid: false,
      triedSubmitting: false,
      isButtonDisabled: false,
      buttonValue: 'Submit',
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search); this.onChange.bind(this);
    this.onSubmit.bind(this);
  }

  optionify(inputArray, inputName) {
    const newArray = [];
    for (let i = 0; i < inputArray.length; i++) {
      newArray.push(<option key={inputArray[i]} value={inputArray[i]}>
        {inputArray[i]}
      </option>);
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

  onDropResume = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileAsBinaryString = reader.result;
        const encodedData = window.btoa(fileAsBinaryString);
        // do whatever you want with the file content
        this.setState({ resume: [encodedData] });
        this.setState({ resumeValid: true });
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  }

  onChange = (e) => {
    // Because we named the inputs to match their corresponding values in state, it's
    // super easy to update the state
    const { state } = this;
    const { name } = e.target;
    if (name !== 'courses') {
      const validationName = `${name}Valid`;
      this.setState({ [name]: e.target.value });
      if (name === 'gradYear' || name === 'major') {
        document.getElementById(name).innerHTML = [e.target.value];
      }

      if (e.target.value != '') {
        this.setState({ [validationName]: true });
      } else {
        this.setState({ [validationName]: false });
      }
    } else {
      this.setState({ [e.target.name]: (e.target.value).replace(/ /g, '').split(',') });
    }
  };

  handleUpdateCourses(courseList) {
    this.setState({ courses: courseList });
  }

  onSubmit = (e) => {
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
      resume,
      transcript,
      firstNameValid,
      lastNameValid,
      gradYearValid,
      majorValid,
      GPAValid,
      resumeValid,
      triedSubmitting,
    } = this.state;
    this.setState({ token_id: sessionStorage.getItem('token_id') });
    const token_id = sessionStorage.getItem('token_id');

    if (firstNameValid && lastNameValid && gradYearValid && majorValid) {
      const oneRan = false;
      const getUrl = window.location;
      const baseUrl = `${getUrl.protocol}//${getUrl.host}`;
      axios.post('/api/undergrads', {
        firstName, lastName, gradYear, major, GPA, netId, email, courses, token_id,
      })
        .then((result) => {
          console.log('undergrad created, result:');
          console.log(result);
          this.setState({ isButtonDisabled: true });
          this.setState({ buttonValue: 'Submitted!' });

          window.location.replace(`${baseUrl}/opportunities`);
        }).catch((error) => {
          console.log('error in creating undergrad');
          console.log(error);
          // if it's not a session error...
          if (!Utils.handleTokenError(error)) {
            console.log('error in /api/undergrad in student register');
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
    const {
      firstName, lastName, gradYear, major, GPA, netId, courses, resume, transcript,
    } = this.state;
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
              <CourseSelect updateCourses={this.handleUpdateCourses.bind(this)} />
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
