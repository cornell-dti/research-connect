import React, { ChangeEvent } from 'react';
import './CreateOpportunityForm.scss';
// @ts-ignore
import DatePicker from 'react-datepicker';
import moment from 'moment';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
// @ts-ignore
import ReactTooltip from 'react-tooltip';
// @ts-ignore
import InfoIcon from 'react-icons/lib/md/info';
// @ts-ignore
import Delete from 'react-icons/lib/ti/delete';
// @ts-ignore
import Add from 'react-icons/lib/md/add-circle';
import { ClipLoader } from 'react-spinners';
// @ts-ignore
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import * as ReactGA from 'react-ga';
import { updateForMultipleChoice, handleTokenError } from '../../components/Utils';
import Footer from '../../components/Footer/Footer';
import ProfessorNavbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';
import Detail from '../../components/Detail/Detail';
import { years, csAreas, compensation as compensationOptions } from '../../components/constants';

type State = {
  creatorNetId: string | null;
  labPage: string;
  areas: string[];
  email: string;
  title: string;
  projectDescription: string;
  undergradTasks: string;
  qualifications: string;
  compensation: string[];
  startSeason: string;
  startYear: string;
  yearsAllowed: string[];
  questions: { [key: string]: string };
  requiredClasses: string[];
  minGPA: string;
  minHours: string;
  maxHours: string;
  opens: moment.Moment;
  closes: moment.Moment;
  labName: string;
  supervisor: string;
  additionalInformation: string;
  numQuestions: number;
  titleIsValid: boolean;
  emailIsValid: boolean;
  tasksAreValid: boolean;
  seasonIsValid: boolean;
  yearIsValid: boolean;
  supervisorIsValid: boolean;
  triedSubmitting: boolean;
  isButtonDisabled: boolean;
  buttonValue: string;
  loading: boolean;
  areaData: any[],
  detailsButtonValue: string;
  showDetails: boolean;
};

class CreateOppForm extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      creatorNetId: sessionStorage.getItem('token_id'),
      labPage: '',
      areas: [],
      email: '',
      title: '',
      projectDescription: '',
      undergradTasks: '',
      qualifications: '',
      compensation: [],
      startSeason: '',
      startYear: '',
      yearsAllowed: [],
      questions: {},
      requiredClasses: [],
      minGPA: '',
      minHours: '',
      maxHours: '',
      opens: moment(),
      closes: moment().add(365, 'days'),
      labName: '',
      supervisor: '',
      additionalInformation: '',
      numQuestions: 0,
      titleIsValid: false,
      emailIsValid: false,
      tasksAreValid: false,
      seasonIsValid: false,
      yearIsValid: false,
      supervisorIsValid: false,
      triedSubmitting: false,
      isButtonDisabled: false,
      buttonValue: 'Submit New Position',
      loading: false,
      areaData: [],
      detailsButtonValue: 'Show Advanced Options',
      showDetails: false,
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  // Returns an array of CS areas
  displayAreas = () => {
    const arrayOfAreas = [];
    for (let i = 0; i < this.state.areaData.length; i++) {
      arrayOfAreas.push({ label: this.state.areaData[i].name, value: this.state.areaData[i]._id });
    }
    return arrayOfAreas;
  };

  loadAreasFromServer() {
    // Need code for getting areas
    axios.get('/api/labs')
      .then((res) => this.setState({ areaData: res.data }))
      .catch((error) => handleTokenError(error));
  }

  // display the questions interface to add/delete questions
  displayQuestions = () => {
    const questionBoxes = [];
    for (let i = 0; i < this.state.numQuestions; i++) {
      const stateLabel = `q${(i).toString()}`;
      questionBoxes.push(
        <div key={stateLabel}>
          <span>
            {' '}
            {`${(i + 1).toString()}. `}
            {' '}
          </span>
          <input
            name={String(i)}
            value={this.state.questions[stateLabel]}
            onChange={() => this.handleQuestionState(i)}
            className="question"
            type="text"
          />
          <Delete
            size={30}
            id={i}
            onClick={() => this.deleteQuestion(stateLabel)}
            className="deleter-icon"
          />
        </div>,
      );
    }
    return (
      <div className="question-boxes">
        {questionBoxes}
      </div>
    );
  };

  deleteQuestion = (data: string) => {
    const deleted = parseInt(data.slice(1), 10);
    this.setState((state) => {
      const newQnum = state.numQuestions - 1;
      const questionsCopy = JSON.parse(JSON.stringify(this.state.questions));
      const questionsEdit: { [k: string]: string } = {};

      Object.keys(questionsCopy).forEach((question) => {
        const num = parseInt(question.slice(1), 10);
        if (num < deleted) {
          questionsEdit[question] = questionsCopy[question];
        } else if (num > deleted) {
          const newString = `q${(num - 1).toString()}`;
          questionsEdit[newString] = questionsCopy[question];
        }
      });
      return { numQuestions: newQnum, questions: questionsEdit };
    });
  };

  addQuestion = () => {
    this.setState((state) => {
      const questionsCopy = JSON.parse(JSON.stringify(state.questions));
      questionsCopy[`q${(state.numQuestions).toString()}`] = '';
      return { questions: questionsCopy, numQuestions: state.numQuestions + 1 };
    });
  };

  createGpaOptions = () => {
    const options = [];
    for (let i = 25; i <= 43; i++) {
      options.push(<option key={i} value={(i / 10).toString()}>{(i / 10).toString()}</option>);
    }
    return (
      <select
        name="gpa"
        className="gpa-select column column-90"
        value={this.state.minGPA}
        onChange={this.handleChange}
      >
        <option key="" value="">Select Minimum GPA</option>
        {options}
      </select>
    );
  };

  toggleDetails = () => this.setState(({ showDetails }) => ({
    detailsButtonValue: showDetails ? 'Show Advanced Options' : 'Hide Advanced Options',
    showDetails: !showDetails,
  }));

  // Set values of form items in state and change their validation state if they're invalid
  handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (event.target.name === 'labName') {
      this.setState({ labName: event.target.value });
    } else if (event.target.name === 'netID') {
      this.setState({ creatorNetId: event.target.value });
    } else if (event.target.name === 'title') {
      const st = event.target.value.length > 0;
      this.setState({ title: event.target.value, titleIsValid: st });
    } else if (event.target.name === 'email') {
      const st = event.target.value.length > 0;
      this.setState({ email: event.target.value, emailIsValid: st });
    } else if (event.target.name === 'supervisor') {
      const st = event.target.value.length > 0;
      this.setState({ supervisor: event.target.value, supervisorIsValid: st });
    } else if (event.target.name === 'descript') {
      this.setState({ projectDescription: event.target.value });
    } else if (event.target.name === 'tasks') {
      const st = event.target.value.length > 0;
      this.setState({ undergradTasks: event.target.value, tasksAreValid: st });
    } else if (event.target.name === 'qual') {
      this.setState({ qualifications: event.target.value });
    } else if (event.target.name === 'classes') {
      const classArray = event.target.value.split(',');
      this.setState({ requiredClasses: classArray });
    } else if (event.target.name === 'startSeason') {
      const st = event.target.value !== 'Select';
      this.setState({ startSeason: event.target.value, seasonIsValid: st });
    } else if (event.target.name === 'startYear') {
      const st = event.target.value !== 'Select';
      this.setState({ startYear: event.target.value, yearIsValid: st });
    } else if (event.target.name === 'gpa') {
      this.setState({ minGPA: event.target.value });
    } else if (event.target.name === 'min') {
      this.setState({ minHours: event.target.value });
    } else if (event.target.name === 'max') {
      this.setState({ maxHours: event.target.value });
    } else if (event.target.name === 'additional') {
      this.setState({ additionalInformation: event.target.value });
    }
  };

  handleQuestionState = (i: number) => {
    const stateLabel = `q${i.toString()}`;
    this.setState((state) => {
      const questionsCopy = JSON.parse(JSON.stringify(state.questions));
      // @ts-ignore
      questionsCopy[stateLabel] = document.getElementsByName(String(i))[0].value as string;
      return { questions: questionsCopy };
    });
  };

  handleOpenDateChange = (date: moment.Moment) => this.setState({ opens: date });

  handleCloseDateChange = (date: moment.Moment) => this.setState({ closes: date });

  isValid = () => (
    this.state.titleIsValid && this.state.tasksAreValid && this.state.seasonIsValid && this.state.yearIsValid
  );

  // takes care of sending the form data to the back-end
  onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    this.setState({ triedSubmitting: true });
    e.preventDefault();
    // get our form data out of state
    const {
      email, creatorNetId, labPage, areas, title, projectDescription, undergradTasks,
      qualifications, compensation, startSeason, startYear, yearsAllowed, questions,
      requiredClasses, minGPA, minHours, maxHours, additionalInformation, opens, closes,
      labName, supervisor, numQuestions,
    } = this.state;

    // makes sure all the fields that are required are valid
    if (!this.isValid()) {
      return;
    }
    axios.post('/api/opportunities', {
      email,
      creatorNetId,
      labPage,
      areas,
      title,
      projectDescription,
      undergradTasks,
      qualifications,
      compensation,
      startSeason,
      startYear,
      yearsAllowed,
      questions,
      requiredClasses,
      minGPA,
      minHours,
      maxHours,
      additionalInformation,
      opens,
      closes,
      labName,
      supervisor,
      numQuestions,
    })
      .then(() => {
        this.setState({ isButtonDisabled: true, buttonValue: 'Submitted!' });
        setTimeout(() => {
          if (this.state.creatorNetId) {
            document.location.href = '/professorView';
          } else {
            alert('Submitted! You can find your opportunity on the opportunities page of our site! '
              + '(research-connect.com/faculty/)');
            document.location.href = '/faculty';
          }
        }, 1200);
      }).catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            alert('One of the required fields is not properly filled in.');
          } else if (!handleTokenError(error)) {
            // if there's no token-related error, then do the alert.
            alert('Something went wrong on our side. Please refresh and try again.');
          }
        }
      });
  };

  render() {
    if (this.state.loading) {
      const style = { display: 'block', margin: 0, borderColor: 'red' };
      // @ts-ignore
      const loader = <ClipLoader style={style} sizeUnit="px" size={150} color="#ff0000" loading />;
      return <div className="sweet-loading">{loader}</div>;
    }

    return (
      <div>
        {this.state.creatorNetId && <ProfessorNavbar current="newopp" />}
        {!this.state.creatorNetId && (
          <div className="go-home" onClick={() => { window.location.href = '/'; }}>
            <FaLongArrowLeft
              style={{ verticalAlign: 'text-top', position: 'relative', top: '2px' }}
              className="black-arrow"
            />
            Home
          </div>
        )}
        <ProfessorNavbar current="newopp" />
        <div className="row">
          <div className="new-opp-form">
            <div className="form-title">
              <h3>Create New Position</h3>
              <h6>
                If you post without an account, students will have to write an email to you if they are interested.
                If you post with an account, students will write a cover letter on the site and
                you can view their info through our portal as well as edit your opportunity.
              </h6>
              <span className="required-star-top">* Required Fields</span>
            </div>
            <form
              className="form-body "
              id="createOpp"
              action="opportunities"
              method="post"
              onSubmit={this.onSubmit}
            >


              <div
                className={!this.state.emailIsValid && this.state.triedSubmitting
                  ? 'row input-row wrong' : 'row input-row'}
              >

                <span className="required-star">*</span>

                <input
                  className="column column-90"
                  placeholder="Email"
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
                <InfoIcon data-tip data-for="info-email" className="info-icon" size={20} />
                <ReactTooltip place="right" id="info-email" aria-haspopup="true" role="example">
                  <div className="info-text">
                    <span>We will email whenever a student submits a cover letter for your lab.</span>
                  </div>
                </ReactTooltip>


              </div>

              <div
                className={!this.state.supervisorIsValid && this.state.triedSubmitting
                  ? 'row input-row wrong' : 'row input-row'}
              >
                <span className="required-star">*</span>

                <input
                  className="column column-90"
                  placeholder="Name"
                  name="supervisor"
                  type="text"
                  value={this.state.supervisor}
                  onChange={this.handleChange}
                />
                <InfoIcon data-tip data-for="info-super" className="info-icon" size={20} />
                <ReactTooltip place="right" id="info-super" aria-haspopup="true" role="example">
                  <p className="info-text">
                    {' '}
                    Your name or the name of other person who would be their
                    direct supervisor.
                  </p>

                </ReactTooltip>
              </div>

              <div
                className={!this.state.titleIsValid && this.state.triedSubmitting
                  ? 'row input-row wrong' : 'row input-row'}
              >

                <span className="required-star">*</span>

                <input
                  className="column column-90"
                  placeholder="Project Title (i.e. Interaction of PL and Computer Architecture)"
                  type="text"
                  name="title"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
                <InfoIcon data-tip data-for="info-title" className="info-icon" size={20} />
                <ReactTooltip place="right" id="info-title" aria-haspopup="true" role="example">
                  <div className="info-text">
                    <span>Examples:</span>
                    <ul className="info-text">
                      <li> Molecular Mechanisms of Tissue Morphogenesis</li>
                      <li>Translational Regulation in Yeast Meiosis</li>
                    </ul>
                  </div>
                </ReactTooltip>


              </div>

              <div
                className={!this.state.tasksAreValid && this.state.triedSubmitting
                  ? 'row input-row wrong' : 'row input-row'}
              >
                <span className="required-star">*</span>
                <textarea
                  className="column column-90"
                  placeholder="General description, undergraduate tasks, or
                    just a link to your website and text saying to email you
                    if anything looks interesting."
                  name="tasks"
                  value={this.state.undergradTasks}
                  onChange={this.handleChange}
                />

                <InfoIcon
                  data-tip
                  data-for="info-tasks"
                  className="info-icon column column-5"
                  size={20}
                />
                <ReactTooltip place="right" id="info-tasks" aria-haspopup="true" role="example">
                  <div className="info-text">
                    <span>Examples:</span>
                    <ul className="info-text">
                      <li>Presenting findings</li>
                      <li>Transcribing interviews</li>
                      <li>Microscopy</li>
                      <li>Caring for lab rats</li>
                      <li>Data analytics in Excel</li>
                    </ul>
                  </div>

                </ReactTooltip>
              </div>

              <div className="row input-row start-time">
                <span className="required-star">*</span>

                <select
                  className={!this.state.seasonIsValid && this.state.triedSubmitting
                    ? 'startSeason wrong-select' : 'startSeason'}
                  name="startSeason"
                  value={this.state.startSeason}
                  onChange={this.handleChange}
                >
                  <option value="Select">Select Start Semester</option>
                  <option value="Fall">Fall Semester</option>
                  <option value="Spring">Spring Semester</option>
                  <option value="Summer">Summer Semester</option>
                  {/* <option value="Winter" >Winter</option> */}
                </select>

                <select
                  className={!this.state.yearIsValid && this.state.triedSubmitting
                    ? 'startYear wrong-select' : 'startYear'}
                  name="startYear"
                  value={this.state.startYear}
                  onChange={this.handleChange}
                >
                  <option value="Select">Select Start Year</option>
                  <option value={(new Date().getFullYear())}>{new Date().getFullYear()}</option>
                  <option value={((new Date().getFullYear() + 1))}>{new Date().getFullYear() + 1}</option>
                </select>
                <InfoIcon data-tip data-for="info-start" className=" info-icon" size={20} />

                <ReactTooltip place="right" id="info-start" aria-haspopup="true" role="example">
                  <p className="info-text">
                    Indicates the semester the student will start working in the lab.
                  </p>
                </ReactTooltip>

              </div>

              <div className={this.state.showDetails ? '' : 'hidden'}>
                <div className="row input-row optional">
                  <textarea
                    className="column column-90"
                    placeholder="Project Description and Goals"
                    name="descript"
                    value={this.state.projectDescription}
                    onChange={this.handleChange}
                  />

                  <InfoIcon
                    data-tip
                    data-for="info-descript"
                    className="info-icon column column-5"
                    size={20}
                  />
                  <ReactTooltip place="right" id="info-descript" aria-haspopup="true" role="example">
                    <p className="info-text">
                      Example: Apprentice will conduct a genetic screen to discover
                      novel genes required for tissue morphogenesis and will be trained in
                      general wet-lab work and microdissection.
                    </p>
                  </ReactTooltip>
                </div>


                <div className="row input-row optional">
                  <textarea
                    className="column column-90"
                    placeholder="Preferred Qualifications (i.e. completion of a class, familiarity with a subject)"
                    name="qual"
                    value={this.state.qualifications}
                    onChange={this.handleChange}
                  />

                  <InfoIcon
                    data-tip
                    data-for="info-quals"
                    className="column column-5 info-icon"
                    size={20}
                  />
                  <ReactTooltip place="right" id="info-quals" aria-haspopup="true" role="example">
                    <div className="info-text">
                      <span>Examples:</span>
                      <ul className="info-text">
                        <li>Familiarity with molecular biology</li>
                        <li>Experience with automated image analysis</li>
                        <li>Passion for biomedical tech</li>
                        <li>Above B+ in Intro Chem</li>
                      </ul>
                    </div>
                  </ReactTooltip>
                </div>

                <Detail
                  label="Student Compensation (leave blank if just experience):"
                  updateDetail={
                    (option) => this.setState((state) => ({
                      compensation: updateForMultipleChoice(state.compensation, option),
                    }))
                  }
                  choices={compensationOptions}
                />

                <div className="hours row input-row optional">
                  <input
                    className="min-hours"
                    placeholder="Min Hours/Week"
                    type="text"
                    name="min"
                    value={this.state.minHours}
                    onChange={this.handleChange}
                  />


                  <input
                    className="max-hours"
                    placeholder="Max Hours/Week, if applicable"
                    type="text"
                    name="max"
                    value={this.state.maxHours}
                    onChange={this.handleChange}
                  />
                  <InfoIcon
                    data-tip
                    data-for="info-hours"
                    className="info-icon column column-5"
                    size={20}
                  />
                  <ReactTooltip place="right" id="info-hours" aria-haspopup="true" role="example">
                    <p className="info-text">
                      Estimate the minimum hours you would expect the student to
                      work each week and the maximum hours you would ever require.
                    </p>
                  </ReactTooltip>
                </div>

                <div className="row input-row optional">
                  <input
                    className="column column-90"
                    placeholder="Required/Preferred Classes (Separate with commas, i.e. BIO 1110, MATH 1910)"
                    type="text"
                    name="classes"
                    value={this.state.requiredClasses}
                    onChange={this.handleChange}
                  />

                  <InfoIcon
                    data-tip
                    data-for="info-classes"
                    className="column column-5 info-icon"
                    size={20}
                  />
                  <ReactTooltip place="right" id="info-classes" aria-haspopup="true" role="example">
                    <div className="info-text">
                      <span>Examples:</span>
                      <ul className="info-text">
                        <li>CS 1110</li>
                        <li>MATH 1910</li>
                      </ul>
                    </div>

                  </ReactTooltip>
                </div>

                <div className="row input-row optional">
                  {this.createGpaOptions()}
                  <InfoIcon data-tip data-for="info-gpa" className="column column-5 info-icon" size={20} />
                  <ReactTooltip place="right" id="info-gpa" aria-haspopup="true" role="example">
                    <div className="info-text">
                      <span>Students with a GPA lower than this minimum will be discouraged from applying.</span>
                    </div>
                  </ReactTooltip>
                </div>

                <Detail
                  label="Years Desired:"
                  updateDetail={
                    (option) => this.setState((state) => ({
                      yearsAllowed: updateForMultipleChoice(state.yearsAllowed, option),
                    }))
                  }
                  choices={years}
                />
                <Detail
                  label="CS Areas"
                  updateDetail={
                    (option) => this.setState((state) => ({ areas: updateForMultipleChoice(state.areas, option) }))
                  }
                  choices={csAreas}
                />

                <div className="row input-row optional">
                  <textarea
                    className="column column-90"
                    placeholder="Additional Information"
                    name="additional"
                    value={this.state.additionalInformation}
                    onChange={this.handleChange}
                  />

                  <InfoIcon
                    data-tip
                    data-for="info-additional"
                    className="column column-5 info-icon"
                    size={20}
                  />

                  <ReactTooltip place="right" id="info-additional" aria-haspopup="true" role="example">
                    <p className="info-text">
                      Include any other relevant information to your opportunity not already described in the form.
                    </p>
                  </ReactTooltip>
                </div>

                <div className="date-pick-container ">
                  <label className="label-inline">Open Application Window: </label>
                  <DatePicker
                    className="datePicker"
                    placeholderText="Select a date"
                    selected={this.state.opens}
                    onChange={this.handleOpenDateChange}
                  />

                  <label className="label-inline ">Close Application Window (if applicable): </label>
                  <DatePicker
                    className="datePicker"
                    selected={this.state.closes}
                    onChange={this.handleCloseDateChange}
                  />
                </div>
                <hr />
                <div className="question-adder">
                  <h4>Application Question</h4>

                  <InfoIcon data-tip data-for="info-questions" className="info-icon-title" size={20} />
                  <ReactTooltip place="top" id="info-questions" aria-haspopup="true" role="example">
                    <p className="info-text-large">
                      We recommend asking &quot;Why are you interested in this lab and/or position?&quot; to
                      {'gauge interest. You will nonetheless be able to view each students\' cover'}
                      letter, year, GPA, résumé, and major, in addition to their responses to these
                      questions once they apply.
                    </p>
                  </ReactTooltip>

                  <p>
                    Here you can add any position-specific questions or
                    requests for additional information, which students will be required to answer in
                    order to apply.
                  </p>

                  {this.displayQuestions()}
                  <div className="add-question" onClick={this.addQuestion}>
                    <span>ADD QUESTION</span>
                    <Add className="adder-icon" size={20} />
                  </div>
                </div>
                <br />
              </div>
              <div className="details-div">
                <input
                  className="button"
                  type="button"
                  value={this.state.detailsButtonValue}
                  onClick={this.toggleDetails}
                />
              </div>
              <div className="submit-div">
                <input
                  className="button submit"
                  type="submit"
                  value={this.state.buttonValue}
                  disabled={this.state.isButtonDisabled}
                />
              </div>
            </form>

          </div>
        </div>
        <Footer />

      </div>
    );
  }
}

export default CreateOppForm;
