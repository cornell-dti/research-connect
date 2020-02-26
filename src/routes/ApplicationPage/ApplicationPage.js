import React, { Component } from 'react';
import axios from 'axios';
import './ApplicationPage.scss';
import ExternalLink from 'react-icons/lib/fa/external-link';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import { ClipLoader } from 'react-spinners';
import * as ReactGA from 'react-ga';
import * as Utils from '../../components/Utils';
import Footer from '../../components/Footer/Footer';
import EmailDialog from '../../components/EmailDialog/EmailDialog';
import Navbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';

class ApplicationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      application: [],
      opportunity: [],
      resumeId: '',
      loading: true,
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidMount() {
    // this.setState({ loading: false });
    // temporary
    this.state.loading = false;
    axios.get(`/api/applications?id=${sessionStorage.getItem('token_id')
    }&netId=` + 'prk57').then((response) => {
      const oppsList = response.data;
      Object.keys(oppsList).forEach((opp) => {
        oppsList[opp].applications.forEach((app) => {
          const curOpp = oppsList[opp].opportunity;
          if (app !== undefined) {
            if (app.id === this.props.match.params.id) {
              this.setState({ application: app, opportunity: curOpp });
              axios.get(
                `/api/undergrads/la/${this.state.application.undergradNetId
                }?tokenId=${sessionStorage.getItem('token_id')}`,
              )
                .then((response2) => {
                  this.setState({ resumeId: response2.data.resumeId });
                  const transcriptIdText = response2.data.transcriptId != null
                    ? ''
                    : response2.data.transcriptId;
                  this.setState({ transcriptId: transcriptIdText });
                })
                .catch((error) => {
                  Utils.handleTokenError(error);
                });
            }
          }
        });
      });
    }).catch((error) => {
      Utils.handleTokenError(error);
    });
  }

  toDivList(lst) {
    return lst.map((e) => (
      <div key={e}>
        {' '}
        {e}
        {' '}
      </div>
    ));
  }

  getNoGPA(gpa) {
    if (gpa === 5.0) {
      return 'No GPA';
    }

    return gpa;
  }

  renderTranscript() {
    if (!this.state.transcriptId) {
      return null;
    }

    return (
      <div>
        <div className="app-qual-section">
          <div className="resume-link">
            <a href={this.state.transcriptId} target="_blank" rel="noopener noreferrer">
              <h6 className="no-margin">
                View Transcript

                <ExternalLink
                  className="red-link"
                />
              </h6>
            </a>
          </div>

        </div>
        <hr />
      </div>
    );
  }

  returnToApps() {
    window.location.href = '/professorView';
  }

  render() {
    // const override = css`
    // display: block;
    // margin: 0 auto;
    // border-color: red;
    // `;

    if (this.state.loading) {
      return (
        <div className="sweet-loading">
          <ClipLoader
            style={{
              display: 'block',
              margin: 0,
              borderColor: 'red',
            }}
            sizeUnit="px"
            size={150}
            color="#ff0000"
            loading={this.state.loading}
          />
        </div>
      );
    }

    const { responses } = this.state.application;
    const { questions } = this.state.opportunity;
    const questionsAndResponses = Object.keys(responses).map((question, c) => (
      <div className="question-and-response" key={c}>
        <div className="question header">{questions[question] ? questions[question] : 'Cover Letter'}</div>
        <div className="response">{responses[question]}</div>
      </div>
    ));

    return (
      <div>
        <Navbar />
        <div className="application-page-container">
          <div className="return-to-apps" onClick={this.returnToApps.bind(this)}>
            <FaLongArrowLeft className="black-arrow" />
            Return to applications

          </div>
          <div className="row button-bar">
            <div className="column column-33 left-button">
              <EmailDialog
                buttonText="Mark as Accepted"
                statusText="accept"
                opp={this.state.opportunity}
                app={this.state.application}
              />
            </div>
            <div className="column column-33 center-button">
              <EmailDialog
                buttonText="Edit & Send Interview Email"
                statusText="interview"
                opp={this.state.opportunity}
                app={this.state.application}
              />
            </div>
            <div className="column column-33 right-button">
              <EmailDialog
                buttonText="Mark as Rejected"
                statusText="reject"
                opp={this.state.opportunity}
                app={this.state.application}
              />
            </div>
          </div>
          <div className="row">
            <div className="column">
              <div className="row application-page-info">
                <div className="column">
                  <div className="row app-page-info-top-row">
                    <div className="column app-info-left">
                      <div className="name header">
                        {Utils.capitalizeFirstLetter(this.state.application.lastName)}
                        ,
                        {Utils.capitalizeFirstLetter(this.state.application.firstName)}
                      </div>
                      <div className="email">
                        {this.state.application.undergradNetId}
                        @cornell.edu

                      </div>
                    </div>
                    <div className="column app-info-right">
                      <div className="date-applied">
                        Date Applied:
                        {' '}
                        {Utils.convertDate(this.state.application.timeSubmitted)}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column column-33 app-info-left">
                      <div className="grad-year">
                        {Utils.gradYearToString(this.state.application.gradYear)}
                      </div>
                      <div className="major">
                        {this.state.application.major}
                      </div>
                    </div>
                    <div className="column app-info-right">
                      <div className="status">
                        Status:
                        {' '}
                        {Utils.capitalizeFirstLetter(this.state.application.status)}
                      </div>
                      <div className="opportunity">
                        Opportunity:
                        {' '}
                        {this.state.opportunity.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row application-page-responses">
                <div className="column">
                  <div className="responses-header header">Application Responses</div>
                  {questionsAndResponses}
                </div>
              </div>
            </div>
            <div className="column column-app-qual">
              <div className="app-qualifications">
                <div className="app-qual-title header">
                  Qualifications

                </div>

                <hr />

                <div className="app-qual-section">
                  <div className="resume-link">
                    <a href={`/doc/${this.state.resumeId}`} target="_blank" rel="noopener noreferrer">
                      <h6
                        className="no-margin header"
                      >
                        View Resume
                        {' '}
                        <ExternalLink className="red-link" />
                      </h6>
                    </a>
                  </div>
                </div>

                <hr />

                {this.renderTranscript()}

                <div className="app-qual-section">
                  <h6 className="header">GPA</h6>
                  {this.getNoGPA(this.state.application.gpa)}
                </div>

                <hr />

                <div className="app-qual-section">
                  <h6 className="header">Relevant Courses</h6>
                  {this.toDivList(this.state.application.courses)}
                </div>

                <hr />

                <div className="app-qual-section">
                  <h6 className="header">Skills</h6>
                  {this.toDivList(this.state.application.skills)}
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
export default ApplicationPage;
