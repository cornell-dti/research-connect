import React, { Component, ChangeEvent, MouseEvent } from 'react';
import './EditProfile.scss';
import '../../index.css';
// @ts-ignore
import Pencil from 'react-icons/lib/fa/pencil';
// @ts-ignore
import Delete from 'react-icons/lib/ti/delete';
// @ts-ignore
import Check from 'react-icons/lib/fa/check';
// @ts-ignore
import Add from 'react-icons/lib/md/add-circle';
// @ts-ignore
import Dropzone from 'react-dropzone';
import axios from 'axios';
import * as ReactGA from 'react-ga';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import * as Utils from '../../components/Utils';

type State = {
  firstName: string;
  lastName: string;
  year: string;
  major: string;
  gpa: string;
  relevantCourses: string[];
  relevantSkills: string[];
  editYear: boolean;
  editMajor: boolean;
  editCourses: boolean;
  editSkills: boolean;
  editResume: boolean;
  editTranscript: boolean;
  invalidYear: boolean;
  invalidMajor: boolean;
  newCourse: string;
  newSkill: string;
  netId: string;
  resumeId: string;
  transcriptId: string;
  resume: any;
  transcript: any;
  resumeValid: boolean;
}

class EditProfile extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      year: 'Sophomore',
      major: 'Computer Science',
      gpa: '3.9',
      relevantCourses: ['CS 2110', 'CS 3410', 'INFO 1300'],
      relevantSkills: ['Java', 'Python', 'HTML', 'CSS', 'Javascript', 'Excel'],
      editYear: false,
      editMajor: false,
      editCourses: true,
      editSkills: true,
      editResume: false,
      editTranscript: false,
      invalidYear: false,
      invalidMajor: false,
      newCourse: '',
      newSkill: '',
      netId: '',
      resumeId: '',
      transcriptId: '',
      resume: null,
      transcript: null,
      resumeValid: false,
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidMount() {
    axios.get(`/api/undergrads/token/${sessionStorage.getItem('token_id')}`)
      .then((res) => {
        const info = res.data[0];
        const skills = info.skills === undefined ? [] : info.skills;
        const year = info.gradYear;
        this.setState({
          relevantCourses: info.courses,
          firstName: info.firstName,
          lastName: info.lastName,
          year,
          major: info.major,
          gpa: info.gpa,
          relevantSkills: skills,
          netId: info.netId,
          resumeId: info.resumeId,
          transcriptId: info.transcriptId,
        });
      }).catch((error) => {
        Utils.handleTokenError(error);
      });
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === 'year') {
      this.setState({ year: event.target.value });
    } else if (event.target.id === 'major') {
      this.setState({ major: event.target.value });
    } else if (event.target.id === 'gpa') {
      this.setState({ gpa: event.target.value });
    } else if (event.target.id === 'new-course') {
      this.setState({ newCourse: event.target.value });
    } else if (event.target.id === 'new-skill') {
      this.setState({ newSkill: event.target.value });
    }
  };

  handleEditUpperBox = () => {
    this.setState(({ editYear, editMajor }) => ({ editYear: !editYear, editMajor: !editMajor }));
  };

  handleEditYear = () => {
    const presentYear = new Date().getFullYear();
    const validateYear = [presentYear + 4, presentYear + 3, presentYear + 2, presentYear + 1, presentYear];
    if (validateYear.indexOf(parseInt(this.state.year, 10)) === -1) {
      this.setState({ invalidYear: true });
    } else {
      this.setState(({ editYear }) => ({ invalidYear: false, editYear: !editYear }));
    }
  };

  handleEditMajor = () => {
    if (this.state.major === '') {
      this.setState({ invalidMajor: true });
    } else {
      this.setState(({ editMajor }) => ({ invalidMajor: false, editMajor: !editMajor }));
    }
  };

  handleEditResume = () => this.setState(({ editResume }) => ({ editResume: !editResume }));

  handleEditTranscript = () => this.setState(({ editTranscript }) => ({ editTranscript: !editTranscript }));

  handleDeleteCourse = (data: string) => {
    this.setState((state) => ({ relevantCourses: state.relevantCourses.filter((course) => course !== data) }));
  };

  addCourse = () => {
    if (this.state.newCourse !== '') {
      this.setState((state) => ({
        relevantCourses: [...state.relevantCourses, state.newCourse],
        newCourse: '',
      }));
    }
  }

  handleDeleteSkill = (data: string) => {
    this.setState((state) => ({ relevantSkills: state.relevantSkills.filter((skill) => skill !== data) }));
  };

  addSkill = () => {
    if (this.state.newSkill !== '') {
      this.setState((state) => ({
        relevantSkills: [...state.relevantSkills, state.newSkill],
        newSkill: '',
      }));
    }
  };

  displayCourses = () => {
    const list = [];
    if (this.state.editCourses) {
      for (let i = 0; i < this.state.relevantCourses.length; i++) {
        list.push(
          <div key={i} className="edit-container">
            <div className="editting">
              <p
                className="course editting"
                key={`${this.state.relevantCourses[i]}edit`}
              >
                {this.state.relevantCourses[i]}
              </p>
              <Delete
                size={30}
                id={this.state.relevantCourses[i]}
                onClick={() => this.handleDeleteCourse(this.state.relevantCourses[i])}
                className="delete-icon"
              />
            </div>
          </div>,
        );
      }
      return (
        <div className="display-list">
          <input
            className="addTag"
            onChange={this.handleChange}
            id="new-course"
            type="text"
            name="new-course"
            key="new-course"
            placeholder="Add new course here"
            value={this.state.newCourse}
          />
          <Add className="add-icon" value={this.state.newCourse} size={22} onClick={this.addCourse} />
          {list}
        </div>
      );
    }
    for (let i = 0; i < this.state.relevantCourses.length; i++) {
      list.push(
        <p className="display-list-item course" key={this.state.relevantCourses[i]}>
          {this.state.relevantCourses[i]}
        </p>,
      );
    }
    return <div className="display-list">{list}</div>;
  };

  displaySkills = () => {
    const list = [];
    if (this.state.editSkills) {
      for (let i = 0; i < this.state.relevantSkills.length; i++) {
        list.push(
          <div key={i} className="edit-container">
            <div className="editting">
              <p className="skill editting" key={`${this.state.relevantSkills[i]}edit`}>
                {this.state.relevantSkills[i]}
              </p>
              <Delete
                size={30}
                id={this.state.relevantSkills[i]}
                onClick={() => this.handleDeleteSkill(this.state.relevantSkills[i])}
                className="delete-icon"
              />
            </div>
          </div>,
        );
      }
      return (
        <div className="display-list">
          <input
            className="addTag"
            onChange={this.handleChange}
            id="new-skill"
            type="text"
            name="new-skill"
            key="new-skill"
            placeholder="Add new skill here"
            value={this.state.newSkill}
          />

          <Add className="add-icon" value={this.state.newSkill} size={22} onClick={this.addSkill} />
          {list}
        </div>
      );
    }

    for (let i = 0; i < this.state.relevantSkills.length; i++) {
      list.push(
        <p className="display-list-item skill" key={this.state.relevantSkills[i]}>
          {this.state.relevantSkills[i]}
        </p>,
      );
    }
    return <div className="display-list">{list}</div>;
  };

  viewResume = (e: MouseEvent) => {
    e.preventDefault();
    window.location.href = `/doc/${this.state.resumeId}`;
  }

  viewTranscript = (e: MouseEvent) => {
    e.preventDefault();
    window.location.href = `/doc/${this.state.transcriptId}`;
  }

    onDropResume = (acceptedFiles: any[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileAsBinaryString = reader.result;
          // @ts-ignore
          const encodedData = window.btoa(fileAsBinaryString);
          // do whatever you want with the file content
          this.setState({ resume: [encodedData] });
          this.setState({ resumeValid: true });
        };

        reader.readAsBinaryString(file);
      });
    }

    onDropTranscript = (acceptedFiles: any[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const fileAsBinaryString = reader.result;
          // @ts-ignore
          const encodedData = window.btoa(fileAsBinaryString);
          // do whatever you want with the file content
          this.setState({ transcript: [encodedData] });
        };

        reader.readAsBinaryString(file);
      });
    }

    onClick = (e: MouseEvent) => {
      e.preventDefault();
      const {
        year,
        major,
        gpa,
        relevantCourses,
        relevantSkills,
        resume,
        transcript,
      } = this.state;
      const token_id = sessionStorage.getItem('token_id');

      if (this.state.resume != null && this.state.resume.length !== 0) {
        axios.post('/api/docs', { token_id, resume });
      }
      if (this.state.transcript != null && this.state.transcript.length !== 0) {
        axios.post('/api/docs', { token_id, transcript });
      }
      axios.put(`/api/undergrads/${sessionStorage.getItem('token_id')}`, {
        year, major, gpa, relevantCourses, relevantSkills,
      })
        .then(() => {
          setTimeout(() => {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            window.location.replace(`${baseUrl}/editprofile`);
          }, 1500);

          // access the results here....
        });
    };

    render() {
      return (
        <div>
          <Navbar current="editprofile" />
          <div className="profile-page-wrapper">
            <div className="wallpaper" />
            <div className="row edit-row">
              <div className="column edit-details-col">
                <div className=" row title-box-prof">
                  <div className="column left-column">
                    <div className="header">
                      <h4 className="edit-bold">{`${this.state.firstName} ${this.state.lastName}`}</h4>
                    </div>
                    <h6 className="edit-bold">{`${this.state.netId}@cornell.edu`}</h6>
                    {this.state.editYear
                      ? (
                        <div className="input-div">
                          <input
                            className="year edit-input"
                            type="text"
                            name="year"
                            id="year"
                            value={this.state.year}
                            onChange={this.handleChange}
                          />
                          <Check size={25} onClick={this.handleEditYear} className="check-icon" />
                          {this.state.invalidYear ? 'Invalid Year' : ''}
                        </div>
                      )
                      : (
                        <h5>
                          {this.state.year}
                          <Pencil
                            size={20}
                            className="pencil-icon right-column"
                            onClick={this.handleEditYear}
                          />
                        </h5>
                      )}
                    {this.state.editMajor
                      ? (
                        <div className="input-div">
                          <input
                            className="major edit-input"
                            type="text"
                            name="major"
                            id="major"
                            value={this.state.major}
                            onChange={this.handleChange}
                          />
                          <Check size={25} onClick={this.handleEditMajor} className="check-icon" />
                          {this.state.invalidMajor ? 'Required' : ''}
                        </div>
                      )
                      : (
                        <h5>
                          {this.state.major}
                          {' '}
                          <Pencil
                            size={20}
                            className="pencil-icon right-column"
                            onClick={this.handleEditMajor}
                          />
                        </h5>
                      )}

                  </div>
                </div>
              </div>
            </div>


            <div className="edit-row row">
              <div className="qual-box column">
                <div className="edit-row grey-box">
                  <h4>Your Qualifications</h4>
                </div>
                <hr />
                <div className="row qual-row trans-resume">
                  <h5 className="sub-section">Resume:</h5>
                  <input
                    type="button"
                    className="button viewLink"
                    value="View"
                    onClick={this.viewResume}
                  />
                  {this.state.editResume
                    ? (
                      <div className="handleResume">
                        <h5>
                          <Check
                            size={23}
                            className="check-icon"
                            onClick={this.handleEditResume}
                          />
                        </h5>
                        <Dropzone
                          className="edit-drop"
                          style={{
                            position: 'relative',
                            background: '#ededed',
                            padding: '10px',
                            width: '50%',
                            margin: '0 0 0 25%',
                            border: !this.state.resumeValid
                              ? '3px #b31b1b solid' : '1px dashed black',
                          }}
                          onDrop={this.onDropResume}
                        >
                          <p>Click/drag to update resume</p>
                        </Dropzone>
                        <div className="uploaded-message">
                          {this.state.resume != null
                            ? (
                              <p>
                                Uploaded:
                                {this.state.resume.name}
                              </p>
                            ) : ''}
                        </div>
                      </div>
                    )
                    : (
                      <h5 aria-label="edit-icon">
                        <Pencil
                          size={20}
                          className="pencil-icon"
                          alt="edit"
                          onClick={this.handleEditResume}
                        />
                      </h5>
                    )}
                </div>
                <hr />
                {this.state.transcriptId ? (
                  <div className="row qual-row trans-resume">
                    <h5 className="sub-section">Transcript:</h5>
                    <input
                      type="button"
                      className="button viewLink"
                      value="View"
                      onClick={this.viewTranscript}
                    />
                    {this.state.editTranscript
                      ? (
                        <div className="handleTranscript">
                          <h5>
                            <Check
                              size={23}
                              className="check-icon"
                              onClick={this.handleEditTranscript}
                            />
                          </h5>

                          <Dropzone
                            className="edit-drop"
                            style={{
                              position: 'relative',
                              background: '#ededed',
                              padding: '10px',
                              width: '50%',
                              margin: '0 25%',
                              border: '1px dashed black',
                            }}
                            onDrop={this.onDropTranscript}
                          >
                            <p>Click/drag to update transcript</p>

                          </Dropzone>
                          <div className="uploaded-message">
                            {this.state.transcript != null
                              ? (
                                <p>
                                  Uploaded:
                                  {this.state.transcript.name}
                                </p>
                              ) : ''}
                          </div>
                        </div>
                      )
                      : (
                        <h5>
                          {' '}
                          <Pencil
                            size={20}
                            className="pencil-icon"
                            onClick={this.handleEditTranscript}
                          />
                        </h5>
                      )}
                  </div>
                ) : ''}
                <hr />
                <hr />
                <div className="row relevant-row">

                  <div className="column column-49">

                    <h5 className="sub-section">Coursework</h5>

                    {this.displayCourses()}
                  </div>

                  <div className="vl" />

                  <div className="column column-49">

                    <h5 className="sub-section">Skills </h5>

                    {this.displaySkills()}

                  </div>

                </div>
              </div>
            </div>
            <button
              type="button"
              className="column column-50 edit-submit"
              style={{ marginLeft: '45%', marginTop: '10px' }}
              onClick={this.onClick}
            >
              Submit
            </button>
          </div>
          <Footer />
        </div>
      );
    }
}

export default EditProfile;
