import React, { Component } from 'react';
import './FacultyPage.scss';
import axios from 'axios';
import '../OpportunityPage/OpportunityPage.scss';
import ReactDOM from 'react-dom';
import { stateToHTML } from 'draft-js-export-html';
import { Editor, EditorState } from 'draft-js';
import RichTextEditor from '../../components/Faculty/RichTextEditor/RichTextEditor';
import VariableNavbar from '../../components/Navbars/VariableNavbar';
import * as Utils from '../../components/Utils';
import { logoutGoogle } from '../../components/Utils';

// Utils.gradYearToString(2020) == "Sophomore"

/**
 * @param props should be awards=this.state.profInfo.awards
 */
const ListItems = (props) => {
  if (!props.items || props.items.length === 0) {
    return 'Not listed';
  }
  return props.items.map(item => <p key={item}>{item}</p>);
};


class FacultyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profInfo: {},
      buttonValue: 'Send Email',
      isButtonDisabled: false,
    };
    this.TextEditor = React.createRef();
    this.separateInterests = this.separateInterests.bind(this);
  }

  // this runs before the "render and return ( ... ) " runs. We use it to get data from the backend about the faculty member
  componentWillMount() {
    console.log(this.props.match.params.id);
    axios.get(`/api/faculty/${this.props.match.params.id}`)
      .then((response) => {
        this.setState({ profInfo: response.data });
      })
      .catch((error) => {
        console.log('error in getting this faculty');
        console.log(error);
        Utils.handleTokenError(error);
      });
    if (!sessionStorage.getItem('token_id')) {
      console.log('not logged in');
      this.setState({ role: null });
    } else {
      console.log('logged in');
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`)
        .then((response) => {
          // if they don't have a role or it's just not showing up for some reason, go to home page
          // remove this line if you want anybody to be able to view opportunity page
          if (!response || response.data === 'none' || !response.data) {
            this.setState({ role: null });
          } else {
            this.setState({ role: response.data });
          }
        })
        .catch((error) => {
          Utils.handleTokenError(error);
        });
    }
  }

  separateInterests(list) {
    let separated = '';
    if (list != null) {
      for (let i = 0; i < list.length; i++) {
        if (i === (list.length - 1)) {
          separated += list[i];
        } else {
          separated += list[i];
          separated += ', ';
        }
      }
    }
    return separated;
  }

  disableButton() {
    this.setState({
      isButtonDisabled: true,
      buttonValue: 'Sending...',
    });
  }

  completeButton() {
    this.setState({
      isButtonDisabled: true,
      buttonValue: 'Sent!',
    });
  }

  breakButton() {
    this.setState({
      isButtonDisabled: true,
      buttonValue: 'Error sending email',
    });
  }

  sendEmail() {
    this.disableButton();
    const textEditorState = this.TextEditor.current.state;
    const contentState = textEditorState.editorState.getCurrentContent();
    const emailHtml = stateToHTML(contentState);
    const userToken = sessionStorage.getItem('token_id');
    if (!this.state.profInfo) {
      this.breakButton();
    }
    if (!userToken) {
      logoutGoogle();
    }
    const profEmail = this.state.profInfo.email;
    console.log(emailHtml);
    axios.post('/api/faculty/email', { emailHtml, profEmail, userToken })
      .then(() => {
        this.completeButton();
      })
      .catch((error) => {
        this.breakButton();
        Utils.handleTokenError(error);
      });
  }

  render() {
    const noInfoMessage = 'No description provided';
    const isNotLoggedIn = !(this.state.role);
    return (

      <div>
        <VariableNavbar role={this.state.role} current="facultysearch" />
        <div className="opportunities-page-wrapper">
          <div className={`wallpaper ${
            !this.state.role ? 'wallpaper-no-sign-in' : ''}`}
          />

          <div className="row opportunity-row">
            <div className="column opp-details-column">
              <div className="row opp-title-card">
                <div className="column column-20">
                  <img alt="faculty" src={this.state.profInfo.photoId} width="150px" />
                </div>
                <div className="column column-5" />
                <div className="column column-75">
                  <h3><b>{this.state.profInfo.name}</b></h3>

                  <p>
                    <b>Professor</b>
                    {' '}
in
                    {' '}
                    <b>{this.state.profInfo.department}</b>
                    {' '}
at
                    <b>{this.state.profInfo.labName ? this.state.profInfo.labName : ' Cornell'}</b>
                  </p>
                  <p>
                    <b>
Areas of
                                    Interest:
                      {' '}
                    </b>
                    {(this.state.profInfo.researchInterests && this.state.profInfo.researchInterests.length !== 0)
                      ? this.separateInterests(this.state.profInfo.researchInterests) : 'None found'}
                  </p>
                  <div className="row">
                    <div className="column column-60">
                      <h6>
                                            Office:
                        {' '}
                        {this.state.profInfo.office ? this.state.profInfo.office : 'Unknown'}
                      </h6>
                    </div>


                    <div className="column column-60">
                      <h6>
Email:
                        {' '}
                        <a
                          href={this.state.profInfo.email ? `mailto:${this.state.profInfo.email}` : ''}
                        >
                          {this.state.profInfo.email ? this.state.profInfo.email : 'Unknown'}
                        </a>
                      </h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column column-60">
                      <h6>
                                            Phone:
                        {' '}
                        {this.state.profInfo.phone ? this.state.profInfo.phone : 'Unknown'}
                        {' '}

                      </h6>
                    </div>


                    <div className="column column-60">
                      <h6>
Website:
                        {' '}
                        <b>
                          <a
                            href={this.state.profInfo.labPage ? this.state.profInfo.labPage : '#'}
                            target="_blank"
                          >
                            {this.state.profInfo.labPage ? 'View page' : 'None'}
                          </a>
                        </b>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="opp-details-card">
                  <div className="opp-details-section">
                    <div className="header">About</div>
                    <p>
                      {this.state.profInfo.researchDescription && this.state.profInfo.researchDescription.length > 0
                        ? this.state.profInfo.researchDescription : noInfoMessage}
                    </p>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Bio</div>
                    <p>
                      {this.state.profInfo.bio && this.state.profInfo.bio.length > 0 ? this.state.profInfo.bio
                        : 'No bio provided'}
                    </p>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Teaching</div>
                    <p>
                      {this.state.profInfo.teaching ? this.state.profInfo.teaching : noInfoMessage}
                    </p>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Awards</div>
                    <ListItems items={this.state.profInfo.awards} />
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Education</div>
                    <ListItems items={this.state.profInfo.education} />
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Publications</div>
                    <ListItems items={this.state.profInfo.publications} />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="opp-details-card" id="emailText">
                  {this.state.role ? (
                    <div>
                      <RichTextEditor ref={this.TextEditor} />
                      <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <input
                          type="submit"
                          className="button"
                          style={{ width: '150px' }}
                          value={this.state.buttonValue}
                          disabled={this.state.isButtonDisabled}
                          onClick={this.sendEmail.bind(this)}
                        />
                        <br />
                        <p style={{ fontSize: '10px' }}>
                          {`We'll schedule your email to be sent out when
                          professors are most likely to respond (in the morning).`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="header">
                      {'Please '}
                      <a
                        href="/#student-sign-up"
                      >
                        create an account
                      </a>
                      {` to use our email composer! Your email will be saved as
                      a template as well as scheduled to be sent out at the
                      ideal time.`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FacultyPage;
