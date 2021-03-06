import React, { Component, ChangeEvent } from 'react';
import axios from 'axios';
import './OpportunityPage.scss';
import { FaRegCheckSquare as CheckBox, FaMinusCircle as CrossCircle } from 'react-icons/fa';
import * as ReactGA from 'react-ga';
import Footer from '../../components/Footer/Footer';
import * as Utils from '../../components/Utils';
import VariableNavbar from '../../components/Navbars/VariableNavbar';
import Star from '../../components/Star/Star';
import { Opportunity } from '../../types';

function LinkFaculty(props: { facultyId: string }) {
  // if we manually enter their faculty ID in the database, then we can show
  // their faculty page here
  if (props.facultyId) {
    return (
      <span>
        {' '}
        You can view info about this faculty and use our email tips & writer
        <a href={`/faculty/${props.facultyId}`}> here. </a>
      </span>
    );
  }

  return (
    <span>
      You can learn how to write a good email by looking at the template
      for another faculty at the bottom of
      <a href="/faculty/5b8eba793136d653ddc3dfb4" target="_blank">this</a>
      {' '}
      page, as well as our email writing tips on the sidebar of that page.
    </span>
  );
}

type Props = { match: { params: { id: string } } };
type State = {
  opportunity: Opportunity,
  questionAnswers: { [key: string]: string },
  submitted: boolean;
  triedSubmitting: boolean;
  student: any,
  netId: string | null;
  role: string | null;
  detectedLoggedOut: boolean;
  starred: boolean;
  appliedAlready?: boolean;
};

class OpportunityPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      opportunity: {} as Opportunity,
      questionAnswers: {},
      submitted: false,
      triedSubmitting: false,
      student: null,
      netId: 'unknown',
      role: '',
      detectedLoggedOut: false,
      starred: false,
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
    this.parseClasses = this.parseClasses.bind(this);
    this.parseMajors = this.parseMajors.bind(this);
    this.parseYears = this.parseYears.bind(this);
    this.parseGPA = this.parseGPA.bind(this);
  }

  star = () => {
    const token_id = sessionStorage.getItem('token_id');
    const type = 'opportunity';
    const { id } = this.props.match.params;

    axios.post('/api/undergrads/star', { token_id, type, id })
      .then((response) => {
        if (response && response.data) {
          const stars = response.data;
          this.setState({ starred: stars.includes(id) });
        }
      });
  };

  sendToHome = (error: { response: { status: number } }) => {
    if (!this.state.detectedLoggedOut) {
      Utils.handleTokenError(error);
      window.location.href = '/';
      this.setState({ detectedLoggedOut: true });
    }
  };

  handleChange = (key: string) => {
    this.setState((state) => {
      const answersCopy = JSON.parse(JSON.stringify(state.questionAnswers));
      // @ts-ignore
      answersCopy[key] = document.getElementsByName(key)[0].value;
      return { questionAnswers: answersCopy };
    });
  };

  handleAppSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ triedSubmitting: true });

    // get our form data out of state
    const { opportunity, questionAnswers, netId } = this.state;
    const allQsAnswered = Object.values(questionAnswers)
      .every((questionVal) => !(!questionVal));
    if (allQsAnswered === true) {
      this.setState({ submitted: true });
      const opportunityId = opportunity._id;
      const responses = questionAnswers;
      axios.post('/api/applications', { opportunityId, netId, responses })
        .catch((error) => {
          this.sendToHome(error);
        });
    }
  };

  getUndergradData() {
    return axios.get(`/api/undergrads/token/${sessionStorage.getItem('token_id')}`)
      .then((response) => (response.data ? response.data : null))
      .catch((error) => {
        this.sendToHome(error);
      });
  }

  hasApplied(netId: string, opportunityId: string) {
    return axios.get(`/api/opportunities/check/${opportunityId}?netId=${netId}`)
      .then((response) => {
        // returns true or false
        if (!response || !response.data) {
          return false;
        }
        return response.data;
      })
      .catch(() => false);
  }

  componentDidMount() {
    if (!sessionStorage.getItem('token_id')) {
      this.setState({ role: null });
      return;
    }

    axios.get(`/api/role/${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        this.setState({ role: response.data });
      })
      .catch((error) => {
        this.sendToHome(error);
      });
    axios.get(`/api/undergrads/star?type=opportunity&token_id=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        const { data } = response;
        this.setState({ starred: data.includes(this.props.match.params.id) });
      });
    axios.get(`/api/opportunities/${this.props.match.params.id}?netId=${
      sessionStorage.getItem('token_id')}`).then((response) => {
      this.setState({ opportunity: response.data });
      this.setState({ student: response.data.student });
      if (Object.keys(response.data).length >= 0) {
        const obj: { [k: string]: string } = {};
        Object.keys(response.data.questions).forEach((k) => { obj[k] = ''; });
        this.setState({ questionAnswers: obj });
      }
      if (!sessionStorage.getItem('token_id')) {
        this.setState({ netId: null });
        return;
      }
      this.getUndergradData().then((undergradsArray) => {
        if (!undergradsArray || !undergradsArray[0]
            || !undergradsArray[0].netId) {
          this.setState({ netId: '' });
          return null;
        }
        const ugradNetId = undergradsArray[0].netId;
        this.setState({ netId: ugradNetId });
        return this.hasApplied(ugradNetId, this.state.opportunity._id);
      }).then((appliedStatus) => {
        this.setState({ appliedAlready: appliedStatus });
      }).catch(() => {
        this.setState({ netId: '' });
      });
    }).catch((error) => this.sendToHome(error));
  }

  printQuestions() {
    const { questions } = this.state.opportunity;
    if (questions == null) {
      return <div />;
    }
    const keys = Object.keys(questions);
    if (keys.length >= 0) {
      // sort the keys by their number
      keys.sort((a, b) => parseInt(a.replace('q', ''), 10) - parseInt(b.replace('q', ''), 10));

      const questionMapping = keys.map((key) => (
        <div id={key} key={key}>
          {this.state.opportunity.questions[parseInt(key.replace('q', ''), 10)]}
          <br />
          <textarea
            style={{ minHeight: '16rem' }}
            name={key}
            key={key}
            onChange={() => this.handleChange(key)}
          />
          <br />
        </div>
      ));

      return (
        <form onSubmit={this.handleAppSubmit}>
          {questionMapping}
          <div className="submit-button-div">
            <input className="button" type="submit" value="Submit" />
          </div>
        </form>
      );
    }
    return (
      <form onSubmit={this.handleAppSubmit}>
        <input className="button" type="submit" value="Submit" />
      </form>
    );
  }

  convertDate(dateString: string) {
    const dateObj = new Date(dateString);
    let year = dateObj.getUTCFullYear().toString();
    year = year.substring(2, 4);
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDay();
    let month0 = '';
    let day0 = '';
    if (month < 10) {
      month0 = '0';
    }
    if (Number(day0) < 10) {
      day0 = '0';
    }

    return (`${month0 + (month).toString()}/${day0}${(day).toString()}/${
      year}`);
  }

  checkOpen() {
    const openDateObj = new Date(this.state.opportunity.opens);
    const closesDateObj = new Date(this.state.opportunity.closes);
    const nowTime = Date.now();
    if (closesDateObj.getTime() < nowTime) {
      return 'Closed';
    } if (openDateObj.getTime() > nowTime) {
      return 'Not Open Yet';
    }
    return 'Open';
  }

  parseYears(yearsArray: string[]) {
    const yearDivArray = [];
    if (yearsArray) {
      let trackYear = false;
      if (yearsArray.includes('freshman')) {
        if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === 'Freshman') {
          yearDivArray.push(
            <div key="f">
              <CheckBox className="greenCheck" />
              <span key="fresh">{' Freshman'}</span>
            </div>,
          );
        } else {
          yearDivArray.push(
            <div key="f">
              <CrossCircle className="cross" />
              <span key="fresh">{' Freshman'}</span>
            </div>,
          );
        }
        trackYear = true;
      }
      if (yearsArray.includes('sophomore')) {
        if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === 'Sophomore') {
          yearDivArray.push(
            <div key="so">
              <CheckBox className="greenCheck" />
              <span> Sophomore</span>
            </div>,
          );
        } else {
          yearDivArray.push(
            <div key="so">
              <CrossCircle className="cross" />
              <span> Sophomore</span>
            </div>,
          );
        }
        trackYear = true;
      }
      if (yearsArray.includes('junior')) {
        if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === 'Junior') {
          yearDivArray.push(
            <div key="j">
              <CheckBox className="greenCheck" />
              <span> Junior</span>
            </div>,
          );
        } else {
          yearDivArray.push(
            <div key="j">
              <CrossCircle className="cross" />
              <span> Junior</span>
            </div>,
          );
        }
        trackYear = true;
      }
      if (yearsArray.includes('senior')) {
        if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === 'Senior') {
          yearDivArray.push(
            <div key="se">
              <CheckBox className="greenCheck" />
              <span> Senior</span>
            </div>,
          );
        } else {
          yearDivArray.push(
            <div key="se">
              <CrossCircle className="cross" />
              <span> Senior</span>
            </div>,
          );
        }
        trackYear = true;
      }
      if (trackYear) {
        return <ul>{yearDivArray}</ul>;
      }
      return (
        <ul>
          <div key="n">
            <CheckBox
              className="greenCheck"
            />
            <span> No Preference</span>
          </div>
        </ul>
      );
    }
    return undefined;
  }

  parseMajors(arrayIn: string[]) {
    if (arrayIn) {
      if (arrayIn.length === 0) {
        return (
          <ul>
            <div key="none">
              <CheckBox key="no" className="greenCheck" />
              <span key="n"> No Preference</span>
            </div>
          </ul>
        );
      }
      return (
        <ul>
          {arrayIn.map((major) => {
            if (this.state.student != null
                && this.state.student.major.indexOf(major) !== -1) {
              return (
                <div key={major}>
                  <CheckBox
                    className="greenCheck"
                  />
                  <span>
                    {' '}
                    {major}
                  </span>
                </div>
              );
            }
            return (
              <div key={major}>
                <CrossCircle
                  className="cross"
                />
                <span>
                  {' '}
                  {major}
                </span>
              </div>
            );
          })}
        </ul>
      );
    }
    return undefined;
  }

  parseClasses(arrayIn: string[]) {
    if (arrayIn) {
      if (arrayIn.length === 0) {
        return (
          <ul>
            <div key="none">
              <CheckBox key="no" className="greenCheck" />
              <span key="n">{' No Preference'}</span>
            </div>
          </ul>
        );
      }
      return (
        <ul>
          {arrayIn.map((course) => {
            if (this.state.student != null
                && this.state.student.courses.indexOf(course) !== -1) {
              return (
                <div key={course}>
                  <CheckBox className="greenCheck" />
                  <span>{` ${course}`}</span>
                </div>
              );
            }
            return (
              <div key={course}>
                <CrossCircle className="cross" />
                <span>{` ${course}`}</span>
              </div>
            );
          })}
        </ul>
      );
    }
    return undefined;
  }

  parseGPA() {
    // if minGPA is falsy or falls in range
    if (!this.state.opportunity.minGPA || (this.state.student && this.state.opportunity
        && this.state.opportunity.minGPA <= this.state.student.gpa)) {
      return (
        <p key={0}>
          <CheckBox
            className="greenCheck"
          />
          <span>
            {' '}
            {this.state.opportunity.minGPA
              ? this.state.opportunity.minGPA.toFixed(2)
              : 'No Preference'}
          </span>
        </p>
      );
    }
    return (
      <p key={1}>
        <CrossCircle className="cross" />
        <span>
          {' '}
          {this.state.opportunity.minGPA.toFixed(2)}
        </span>
      </p>
    );
  }

  parseCompensation() {
    let compString = 'Not specified';
    if (this.state.opportunity && this.state.opportunity.compensation) {
      const pay = this.state.opportunity.compensation.indexOf('pay') !== -1;
      const credit = this.state.opportunity.compensation.indexOf('credit') !== -1;
      if (pay && credit) compString = 'Credit or Pay';
      else if (pay) compString = 'Pay only';
      else if (credit) compString = 'Credit only';
    }
    return <div>{compString}</div>;
  }

  render() {
    const notProvidedMessage = 'Not specified';
    const isLab = this.state.role !== 'undergrad';
    const isNotLoggedIn = !(this.state.role);
    return (
      <div>
        <VariableNavbar current="opportunities" role={this.state.role} />

        <div className={`opportunities-page-wrapper ${isLab ? 'opportunity-lab' : ''}`}>
          <div className={`wallpaper ${isNotLoggedIn ? 'wallpaper-no-sign-in' : ''}`} />
          <div className="row opportunity-row">
            <div className="column opp-details-column">
              <div className="row opp-title-card">
                <div className="column left-column">
                  <div className="header">
                    {this.state.opportunity.title}
                    <Star
                      update={this.star}
                      starred={this.state.starred}
                    />
                  </div>
                  <div>{this.state.opportunity.ghostPost ? '' : this.state.opportunity.labName}</div>
                </div>
                <div className="column right-column" style={{ marginBottom: 0 }}>
                  {!isNotLoggedIn && !isLab && <a className="button" href="#Application">Apply</a>}
                  {!isNotLoggedIn && isLab && (
                    <a className="button" href={`/EditOpp?Id=${this.props.match.params.id}/`}>
                      Edit
                      Opportunity
                    </a>
                  )}
                  {isNotLoggedIn && (
                    <a className={`button ${isNotLoggedIn ? 'back-to-opportunities' : ''}`} href="/opportunities">
                      Back To Opportunities
                    </a>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="opp-details-card">
                  <div className="opp-details-section">
                    <div className="header">Supervisor</div>
                    <div>
                      {this.state.opportunity.supervisor
                        ? this.state.opportunity.supervisor
                        : notProvidedMessage}
                    </div>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Qualifications</div>
                    <div>
                      {this.state.opportunity.qualifications
                        ? this.state.opportunity.qualifications
                        : notProvidedMessage}
                    </div>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Tasks</div>
                    <div>
                      {this.state.opportunity.undergradTasks
                        ? this.state.opportunity.undergradTasks
                        : notProvidedMessage}
                    </div>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Start Period:</div>
                    <div>
                      {/* Varies, can contact any time. */}
                      {/* Changed it b/c launch was soon and these opportunities had no specific start date */}
                      {/* ... must change later TODO */}
                      {this.state.opportunity.startSeason
                        ? `${this.state.opportunity.startSeason} `
                        : '(Season not specified) '}
                      {this.state.opportunity.startYear
                        ? `${this.state.opportunity.startYear}`
                        : ' (Year not specified)'}
                    </div>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Weekly Hours</div>
                    <div>
                      {(() => {
                        const { minHours, maxHours } = this.state.opportunity;
                        if (!minHours && !maxHours) {
                          return 'Not specified';
                        }
                        const min = minHours ? this.state.opportunity.minHours : 'Not specified';
                        const max = maxHours ? `${this.state.opportunity.maxHours} ` : 'Not specified';
                        return `${min} - ${max} hours per week`;
                      })()}
                    </div>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Compensation</div>
                    <div>
                      {this.state.opportunity.compensation ? this.parseCompensation() : 'Not specified'}
                    </div>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Project Description</div>
                    <div>
                      {this.state.opportunity.projectDescription
                        ? this.state.opportunity.projectDescription
                        : notProvidedMessage}
                    </div>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Additional Information</div>
                    <div>
                      {this.state.opportunity.additionalInformation
                        ? this.state.opportunity.additionalInformation
                        : notProvidedMessage}
                    </div>
                  </div>
                </div>
              </div>
              {
                  !isLab
                  && (
                  <div id="Application" className="row opp-application-box">
                    <div className="column">
                      <div className="header">Apply Here</div>
                      {this.state.opportunity.ghostPost
                        ? (
                          <div>
                            {`Please email ${this.state.opportunity.ghostEmail
                            } with your resume and why you're interested in order to apply.`}
                            <LinkFaculty facultyId={this.state.opportunity.facultyId} />
                          </div>
                        )
                        : (
                          <div>
                            <div className="error-div">
                              {
                                this.state.triedSubmitting
                                && !this.state.submitted
                                  ? (
                                    <p className="app-error-message">
                                      Please
                                      answer all questions in order to
                                      submit.
                                    </p>
                                  ) : ''
                              }
                            </div>
                            {
                              (!this.state.submitted && !this.state.appliedAlready)
                                ? this.printQuestions()
                                : <p>You have applied to this position.</p>
                            }
                          </div>
                        )}
                    </div>
                  </div>
                  )
                }
              {
                  isNotLoggedIn
                  && (
                  <div id="Application" className="row opp-application-box">
                    <div className="column">
                      <div className="header">
                        {'Please '}
                        <a href="/#forprofs">create an account</a>
                        {' to apply.'}
                      </div>
                    </div>
                  </div>
                  )
                }
            </div>
            <div className="column">
              <div className="opp-qualifications">
                <div className="opp-qual-title">
                  <div>Preferred Qualifications</div>
                </div>

                <hr />

                <div className="opp-qual-section">
                  <h6 className="header">Year</h6>
                  {this.parseYears(this.state.opportunity.yearsAllowed)}
                </div>

                <hr />

                <div className="opp-qual-section">
                  <h6 className="header">Major</h6>
                  {this.parseMajors(this.state.opportunity.majorsAllowed)}
                </div>

                <hr />

                <div className="opp-qual-section">
                  <h6 className="header">GPA</h6>
                  {this.parseGPA()}
                </div>

                <hr />

                <div className="opp-qual-section">
                  <h6 className="header">Courses</h6>
                  {this.parseClasses(this.state.opportunity.requiredClasses)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default OpportunityPage;
