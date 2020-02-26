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
import * as ReactGA from 'react-ga';
import * as Utils from '../../components/Utils';
import Footer from '../../components/Footer/Footer';
import ProfessorNavbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';

type State = {
  creatorNetId: string | null;
  labPage: string;
  areas: string[];
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
  tasksAreValid: boolean;
  seasonIsValid: boolean;
  yearIsValid: boolean;
  triedSubmitting: boolean;
  isButtonDisabled: boolean;
  buttonValue: string;
};

class EditOppForm extends React.Component<{}, State> {
  pay!: HTMLInputElement;

  credit!: HTMLInputElement;

  undetermined!: HTMLInputElement;

  freshman!: HTMLInputElement;

  sophomore!: HTMLInputElement;

  junior!: HTMLInputElement;

  senior!: HTMLInputElement;

  constructor(props: {}) {
    super(props);
    this.state = {
      creatorNetId: sessionStorage.getItem('token_id'),
      labPage: '',
      areas: [],
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
      tasksAreValid: false,
      seasonIsValid: false,
      yearIsValid: false,
      triedSubmitting: false,
      isButtonDisabled: false,
      buttonValue: 'Update Position',
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  getUrlId = (val: string): string | null => {
    const url = window.location.href;
    const word = val.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${word}(=([^&#]*)|&|#|$)`);
    const res = regex.exec(url);
    if (!res) {
      return null;
    }
    if (!res[2]) {
      return '';
    }
    return decodeURIComponent(res[2].replace(/\+/g, ' '));
  };

  componentDidMount() {
    const id = this.getUrlId('Id');
    this.setValues(id);
  }

  setValues = (id: string | null) => {
    axios.get(`/api/opportunities/${id}?netId=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        if (response) {
          type Response = Partial<Omit<State, 'opens' | 'closes'>> & { opens: string; closes: string };
          const resp = response.data as Response;
          if (resp.title) this.setState({ title: resp.title });
          if (resp.areas) this.setState({ areas: resp.areas });
          if (resp.projectDescription) {
            this.setState({ projectDescription: resp.projectDescription });
          }
          const openDate = moment(new Date(resp.opens));
          const closeDate = moment(new Date(resp.closes));
          if (resp.startSeason) this.setState({ startSeason: resp.startSeason });
          if (resp.startYear) this.setState({ startYear: resp.startYear });
          if (resp.undergradTasks) this.setState({ undergradTasks: resp.undergradTasks });
          if (resp.qualifications) this.setState({ qualifications: resp.qualifications });
          if (resp.compensation) this.setState({ compensation: resp.compensation });
          if (resp.yearsAllowed) this.setState({ yearsAllowed: resp.yearsAllowed });
          if (resp.questions) this.setState({ questions: resp.questions });
          if (resp.requiredClasses) this.setState({ requiredClasses: resp.requiredClasses });
          if (resp.minGPA) this.setState({ minGPA: resp.minGPA });
          if (resp.minHours !== undefined && resp.minHours !== null) {
            this.setState({ minHours: resp.minHours });
          }
          if (resp.maxHours) this.setState({ maxHours: resp.maxHours });
          if (resp.opens) this.setState({ opens: openDate });
          if (resp.closes) this.setState({ closes: closeDate });
          if (resp.labName) this.setState({ labName: resp.labName });
          if (resp.supervisor) this.setState({ supervisor: resp.supervisor });
          if (resp.additionalInformation) this.setState({ additionalInformation: resp.additionalInformation });
        }
      });
  };

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
      const questionsCopy = JSON.parse(JSON.stringify(state.questions));
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
    const questionsCopy = JSON.parse(JSON.stringify(this.state.questions));
    questionsCopy[`q${(this.state.numQuestions).toString()}`] = '';
    this.setState(({ numQuestions }) => ({ questions: questionsCopy, numQuestions: numQuestions + 1 }));
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

  setYears() {
    if (this.state.yearsAllowed !== []) {
      const yearArray = [];
      if (this.freshman.checked) {
        yearArray.push('freshman');
      }
      if (this.sophomore.checked) {
        yearArray.push('sophomore');
      }
      if (this.junior.checked) {
        yearArray.push('junior');
      }
      if (this.senior.checked) {
        yearArray.push('senior');
      }
      this.setState({ yearsAllowed: yearArray });
    }
  }

  setCompensation() {
    if (this.state.compensation !== []) {
      const compensationArray = [];
      if (this.pay.checked) {
        compensationArray.push('pay');
      }
      if (this.credit.checked) {
        compensationArray.push('credit');
      }
      if (this.undetermined.checked) {
        compensationArray.push('undetermined');
      }
      // const atLeastOneOptionSelected = compensationArray.length !== 0;
      // this.setState({compensationIsValid: atLeastOneOptionSelected});
      this.setState({ compensation: compensationArray });
    }
  }

  // Set values of form items in state and change their validation state if they're invalid
  handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (event.target.name === 'labName') {
      this.setState({ labName: event.target.value });
    } else if (event.target.name === 'netID') {
      this.setState({ creatorNetId: event.target.value });
    } else if (event.target.name === 'title') {
      if (event.target.value.length > 0) {
        this.setState({ titleIsValid: true });
      } else {
        this.setState({ titleIsValid: false });
      }
      this.setState({ title: event.target.value });
    } else if (event.target.name === 'areas') {
      const areaArray = event.target.value.split(',');
      this.setState({ areas: areaArray });
    } else if (event.target.name === 'supervisor') {
      this.setState({ supervisor: event.target.value });
    } else if (event.target.name === 'descript') {
      this.setState({ projectDescription: event.target.value });
    } else if (event.target.name === 'tasks') {
      if (event.target.value.length > 0) {
        this.setState({ tasksAreValid: true });
      } else {
        this.setState({ tasksAreValid: false });
      }
      this.setState({ undergradTasks: event.target.value });
    } else if (event.target.name === 'qual') {
      this.setState({ qualifications: event.target.value });
    } else if (event.target.name === 'classes') {
      const classArray = event.target.value.split(',');
      this.setState({ requiredClasses: classArray });
    } else if (event.target.name === 'startSeason') {
      if (event.target.value !== 'Select') {
        this.setState({ seasonIsValid: true });
      } else {
        this.setState({ seasonIsValid: false });
      }
      this.setState({ startSeason: event.target.value });
    } else if (event.target.name === 'startYear') {
      if (event.target.value !== 'Select') {
        this.setState({ yearIsValid: true });
      } else {
        this.setState({ yearIsValid: false });
      }
      this.setState({ startYear: event.target.value });
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
      questionsCopy[stateLabel] = document.getElementsByName(String(i))[0].value;
      return { questions: questionsCopy };
    });
  };

  handleOpenDateChange = (date: moment.Moment) => this.setState({ opens: date });

  handleCloseDateChange = (date: moment.Moment) => this.setState({ closes: date });

    // takes care of sending the form data to the back-end
    onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      // get our form data out of state
      const {
        creatorNetId, labPage, areas, title, projectDescription, undergradTasks,
        qualifications, compensation, startSeason, startYear, yearsAllowed, questions,
        requiredClasses, minGPA, minHours, maxHours, opens, closes, labName, supervisor,
        numQuestions, additionalInformation,
      } = this.state;

      // makes sure all the fields that are required are valid
      // if (!(this.state.titleIsValid &&
      //     this.state.tasksAreValid &&
      //     this.state.seasonIsValid &&
      //     // this.state.compensationIsValid &&
      //     this.state.yearIsValid)) {
      //     return;
      // }
      axios.put(`/api/opportunities/${this.getUrlId('Id')}`, {
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
        opens,
        closes,
        labName,
        supervisor,
        numQuestions,
        additionalInformation,
      })
        .then(() => {
          // access the results here....
          this.setState({ isButtonDisabled: true, buttonValue: 'Submitted!' });
          setTimeout(() => {
            document.location.href = '/professorView';
          }, 1200);
        }).catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              alert('One of the required fields is not properly filled in.');
            } else if (!Utils.handleTokenError(error)) {
              // if there's no token-related error, then do the alert.
              alert('Something went wrong on our side. Please refresh and try again.');
            }
          }
        });
    };

    render() {
      return (
        <div>
          <ProfessorNavbar current="newopp" />
          <div className="row">
            <div className="new-opp-form">
              <div className="form-title">
                <h3>Create New Position</h3>
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
                  className={!this.state.titleIsValid && this.state.triedSubmitting
                    ? 'row input-row wrong' : 'row input-row'}
                >

                  <span className="required-star">*</span>

                  <input
                    className="column column-90"
                    placeholder="Position Title"
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
                    placeholder="Undergraduate Tasks"
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
                    <option value="Spring">Spring Semester</option>
                    <option value="Summer">Summer Semester</option>
                    {/* <option value="Winter" >Winter</option> */}
                    <option value="Fall">Fall Semester</option>
                  </select>

                  <select
                    className={!this.state.yearIsValid && this.state.triedSubmitting
                      ? 'startYear wrong-select' : 'startYear'}
                    name="startYear"
                    value={this.state.startYear}
                    onChange={this.handleChange}
                  >
                    <option value="Select">Select Start Year</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                  </select>
                  <InfoIcon data-tip data-for="info-start" className=" info-icon" size={20} />
                  <ReactTooltip place="right" id="info-start" aria-haspopup="true" role="example">
                    <p className="info-text">
                      Indicates the semester the student will start working in
                      the lab.
                    </p>

                  </ReactTooltip>
                </div>


                <div className="row input-row optional">
                  <input
                    className="column column-90"
                    placeholder="Position Supervisor"
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
                    <p className="info-text">Example:</p>
                    <p className="info-text">
                      Apprentice will conduct a genetic screen to discover
                      novel genes required for tissue morphogenesis and will be trained in
                      general wet-lab work and microdissection.
                      {' '}
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

                <div className="years-allowed compensation">
                  <label className="label-inline">
                    Student Compensation (leave blank if just
                    experience):
                    {' '}
                  </label>
                  <br />
                  <input
                    ref={(node) => { this.pay = node!; }}
                    onChange={this.setCompensation.bind(this)}
                    type="checkbox"
                    name="pay"
                    value="pay"
                    checked={this.state.compensation.indexOf('pay') !== -1}
                  />
                  <label className="label-inline">Pay </label>
                  <input
                    ref={(node) => { this.credit = node!; }}
                    onChange={this.setCompensation.bind(this)}
                    type="checkbox"
                    name="credit"
                    value="credit"
                    checked={this.state.compensation.indexOf('credit') !== -1}
                  />
                  <label className="label-inline">Course Credit </label>
                  <input
                    ref={(node) => { this.undetermined = node!; }}
                    onChange={this.setCompensation.bind(this)}
                    type="checkbox"
                    name="undetermined"
                    value="undetermined"
                    checked={this.state.compensation.indexOf('undetermined') !== -1}
                  />
                  <label className="label-inline">Not sure yet</label>
                </div>

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
                    placeholder="Max Hours/Week"
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


                <div className="years-allowed optional">
                  <label className="label-inline">Years Desired: </label>
                  <input
                    ref={(node) => { this.freshman = node!; }}
                    onChange={this.setYears.bind(this)}
                    type="checkbox"
                    name="Freshman"
                    value="Freshman"
                    checked={this.state.yearsAllowed.indexOf('freshman') !== -1}
                  />
                  <label className="label-inline">Freshmen </label>
                  <input
                    ref={(node) => { this.sophomore = node!; }}
                    onChange={this.setYears.bind(this)}
                    type="checkbox"
                    name="Sophomore"
                    value="Sophomore"
                    checked={this.state.yearsAllowed.indexOf('sophomore') !== -1}
                  />
                  <label className="label-inline">Sophomores </label>
                  <input
                    ref={(node) => { this.junior = node!; }}
                    onChange={this.setYears.bind(this)}
                    type="checkbox"
                    name="Junior"
                    value="Junior"
                    checked={this.state.yearsAllowed.indexOf('junior') !== -1}
                  />
                  <label className="label-inline">Juniors</label>
                  <input
                    ref={(node) => { this.senior = node!; }}
                    onChange={this.setYears.bind(this)}
                    type="checkbox"
                    name="Senior"
                    value="Senior"
                    checked={this.state.yearsAllowed.indexOf('senior') !== -1}
                  />
                  <label className="label-inline">Seniors </label>
                </div>
                <div className="row input-row optional">
                  <textarea
                    className="column column-90"
                    placeholder="Topics of Research (Please separate with commas)"
                    name="areas"
                    value={this.state.areas}
                    onChange={this.handleChange}
                  />

                  <InfoIcon
                    data-tip
                    data-for="info-topics"
                    className="column column-5 info-icon"
                    size={20}
                  />
                  <ReactTooltip place="right" id="info-topics" aria-haspopup="true" role="example">
                    <div className="info-text">
                      <span>Examples:</span>
                      <ul className="info-text">
                        <li>Computational Biology</li>
                        <li>Natural Language Processing</li>
                        <li>Protein Classification</li>
                      </ul>
                    </div>
                  </ReactTooltip>
                </div>
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
                    <div className="info-text">
                      <span>
                        Include any other relevant information to your opportunity not already described in the form.
                      </span>
                    </div>
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

                  <label className="label-inline ">Close Application Window: </label>
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
                      gauge interest.
                      {'You will nonetheless be able to view each student\'s cover letter, year, GPA,'}
                      résumé,
                      and major, in addition to their responses to these questions once they
                      apply.
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

export default EditOppForm;
