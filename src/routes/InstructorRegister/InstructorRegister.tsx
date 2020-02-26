import React, { ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import * as ReactGA from 'react-ga';
import Footer from '../../components/Footer/Footer';
import '../App/App.scss';
import './InstructorRegister.scss';
import AutoSuggest from '../../components/AutoSuggest/AutoSuggest';
import * as Utils from '../../components/Utils';

type State = {
  data: [],
  newLab: boolean;
  showDropdown: boolean;
  role: string;
  notifications: string;
  firstName: string;
  lastName: string;
  netId: string;
  labId: string | null,
  labPage: string,
  name: string,
  labDescription: string,
  pi: string;
  firstNameValid: boolean;
  lastNameValid: boolean;
  netIDValid: boolean;
  roleValid: boolean;
  notifValid: boolean;
  labNameValid: boolean;
  labURLValid: boolean;
  piValid: boolean;
  triedSubmitting: boolean;
  buttonDisabled: boolean;
  buttonValue: string;
};

class InstructorRegister extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      data: [],
      newLab: false,
      showDropdown: false,
      role: 'Select Position',
      notifications: 'Select Notification Settings',
      firstName: '',
      lastName: '',
      netId: '',
      labId: null,
      labPage: '',
      name: '',
      labDescription: '',
      pi: '',
      firstNameValid: false,
      lastNameValid: false,
      netIDValid: false,
      roleValid: false,
      notifValid: false,
      labNameValid: false,
      labURLValid: false,
      piValid: false,
      triedSubmitting: false,
      buttonDisabled: false,
      buttonValue: 'Register',
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  toggleNewLab = () => {
    // @ts-ignore
    this.setState((state) => {
      const update = {
        labNameValid: false,
        labURLValid: false,
        piValid: false,
        newLab: !state.newLab,
      };
      if (state.newLab) {
        return { ...update, labId: null };
      }
      return update;
    });
  };

  handleUpdateLab = (labName: string, id: string | null) => {
    if (!this.state.newLab) {
      this.setState({ labId: id, name: labName, labNameValid: labName !== '' });
    }
  };

  loadOpportunitiesFromServer = () => {
    axios.get('/api/labs')
      .then((res) => {
        this.setState({ data: res.data });
      }).catch((error) => {
        Utils.handleTokenError(error);
      });
  };

  componentDidMount() {
    this.loadOpportunitiesFromServer();
  }

  handleChangePosition = (event: ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value;
    this.setState({ roleValid: role !== 'Select Position', role });
  };

  handleChangeNotifications = (event: ChangeEvent<HTMLSelectElement>) => {
    const notifications = event.target.value;
    const notifValid = notifications !== 'When do you want to receive emails about applications to your postings?';
    this.setState({ notifValid, notifications });
  };

  handleChangeFirstName = (event: ChangeEvent<HTMLInputElement>) => {
    const firstName = event.target.value;
    this.setState({ firstNameValid: firstName !== '', firstName });
  };

  handleChangeLastName = (event: ChangeEvent<HTMLInputElement>) => {
    const lastName = event.target.value;
    this.setState({ lastNameValid: lastName !== '', lastName });
  };

  handleChangeNetId = (event: ChangeEvent<HTMLInputElement>) => {
    const netId = event.target.value;
    if (netId && netId.indexOf('@cornell.edu') === -1) {
      this.setState({ netIDValid: true });
    } else {
      this.setState({ netIDValid: false });
    }
    this.setState({ netId });
  };

  handleChangeNewLabName = (event: ChangeEvent<HTMLInputElement>) => {
    if (this.state.newLab) {
      this.setState({ name: event.target.value });
      if (event.target.value) {
        this.setState({ labNameValid: true });
      } else {
        this.setState({ labNameValid: false });
      }
    }
  };

  handleChangeLabURL = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ labPage: event.target.value });
    if (event.target.value !== '') {
      this.setState({ labURLValid: true });
    } else {
      this.setState({ labURLValid: false });
    }
  };

  handleChangeLabDescript = (event: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ labDescription: event.target.value });
  };

  handleChangePI = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ pi: event.target.value });
    if (event.target.value !== '') {
      this.setState({ piValid: true });
    } else {
      this.setState({ piValid: false });
    }
  };

  suggestionsClicked = (event: MouseEvent<HTMLDivElement>) => event.preventDefault();

  onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    this.setState({ triedSubmitting: true });
    e.preventDefault();
    // get our form data out of state
    const {
      data, newLab, showDropdown, role, notifications,
      firstName, lastName, netId,
      labId, labPage, name, labDescription, pi,
      firstNameValid, lastNameValid, netIDValid, roleValid, notifValid, labNameValid, labURLValid, piValid,
    } = this.state;
    const token_id = sessionStorage.getItem('token_id');
    if (firstNameValid && lastNameValid && netIDValid && roleValid && notifValid && labNameValid
            && (!newLab || (labURLValid && piValid))) {
      if (newLab) { this.setState({ labId: null }); }
      axios.post('/api/labAdmins', {
        data,
        newLab,
        showDropdown,
        role,
        notifications,
        firstName,
        lastName,
        netId,
        labId,
        labPage,
        name,
        labDescription,
        pi,
        token_id,
      })
        .then(() => {
          // access the results here....
          document.location.href = '/professorView';
          this.setState({
            buttonDisabled: true,
            buttonValue: 'Submitted',
          });
        }).catch((error) => Utils.handleTokenError(error));
    }
  };

  render() {
    return (
      <div>
        {/* <Navbar/> */}
        <div className=" instructor-reg-form">
          <h3>Lab Administrator Registration</h3>
          <form id="register" onSubmit={this.onSubmit} action="/labAdmins" method="post">
            <div className="form-inputs">
              <input
                className="name left-input"
                type="text"
                name="adminFirstName"
                id="adminFirstName"
                placeholder="First Name"
                value={this.state.firstName}
                onChange={this.handleChangeFirstName}
              />
              {!this.state.firstNameValid && this.state.triedSubmitting ? (
                <div className="error-message">
                  <span>Not a valid input.</span>
                </div>
              ) : ''}
              <input
                className="name left-input"
                type="text"
                name="adminLastName"
                id="adminLastName"
                placeholder="Last Name"
                value={this.state.lastName}
                onChange={this.handleChangeLastName}
              />
              {!this.state.lastNameValid && this.state.triedSubmitting ? (
                <div className="error-message">
                  <span>Not a valid input.</span>
                </div>
              ) : ''}
              <input
                className="name left-input"
                type="text"
                name="netId"
                id="netId"
                placeholder="NetID"
                value={this.state.netId}
                onChange={this.handleChangeNetId}
              />
              {!this.state.netIDValid && this.state.triedSubmitting ? (
                <div className="error-message">
                  <span>Not a valid input.</span>
                </div>
              ) : ''}

              <select
                className="main-form-input left-input"
                value={this.state.role}
                onChange={this.handleChangePosition}
              >
                <option value="Select Position">Select Your Position</option>
                <option value="grad">Graduate Student</option>
                <option value="labtech">Lab Technician</option>
                <option value="postdoc">Post-Doc</option>
                <option value="staffscientist">Staff Scientist</option>
                <option value="pi">Professor</option>
              </select>
              {!this.state.roleValid && this.state.triedSubmitting ? (
                <div className="error-message">
                  <span>Not a valid input.</span>
                </div>
              ) : ''}

              <select
                className="main-form-input left-input"
                value={this.state.notifications}
                onChange={this.handleChangeNotifications}
              >
                <option value="-2">
                  When do you want to receive emails about applications to your postings?
                  You can nonetheless view applications on the site at any time.
                </option>
                <option value="0">Every Time An Application is Submitted</option>
                <option value="7">Weekly Update</option>
                <option value="30">Monthly Update</option>
                <option value="-1">Never (not recommended)</option>
              </select>
              {!this.state.notifValid && this.state.triedSubmitting ? (
                <div className="error-message">
                  <span>Not a valid input.</span>
                </div>
              ) : ''}

              {!this.state.newLab
                ? (
                  <div className="existing-create-left" onClick={this.suggestionsClicked}>
                    <div className="existing-or-create">
                      <input
                        type="button"
                        className="button left-button no-click button-small"
                        value="Find Existing Lab"
                      />

                      <input
                        type="button"
                        className="right-button button-small-clear"
                        value="Add New Lab"
                        onClick={this.toggleNewLab}
                      />
                    </div>
                    <div className="auto-div">
                      <AutoSuggest
                        // @ts-ignore
                        className="left-input"
                        updateLab={this.handleUpdateLab}
                        showDropdown={this.state.showDropdown}
                        onChange={this.handleUpdateLab}
                        data={this.state.data}
                      />
                      {!this.state.labNameValid && this.state.triedSubmitting
                        ? (
                          <div className="error-message">
                            <span>Not a valid input.</span>
                          </div>
                        ) : ''}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="existing-or-create">
                      <input
                        type="button"
                        className="left-button button-small-clear"
                        value="Find Existing Lab"
                        onClick={this.toggleNewLab}
                      />

                      <input
                        type="button"
                        className="right-button no-click button button-small"
                        value="Add New Lab"
                      />
                    </div>

                    <input
                      className="left-input"
                      type="text"
                      name="labName"
                      id="labName"
                      placeholder="Lab Name"
                      value={this.state.name}
                      onChange={this.handleChangeNewLabName}
                    />
                    {!this.state.labNameValid && this.state.triedSubmitting
                      ? (
                        <div className="error-message">
                          <span>Not a valid input.</span>
                        </div>
                      ) : ''}

                    <input
                      className="left-input"
                      type="text"
                      name="labURL"
                      id="labURL"
                      placeholder="Lab URL"
                      value={this.state.labPage}
                      onChange={this.handleChangeLabURL}
                    />
                    {!this.state.labURLValid && this.state.triedSubmitting
                      ? (
                        <div className="error-message">
                          <span>Not a valid input.</span>
                        </div>
                      ) : ''}
                    <input
                      className="left-input"
                      type="text"
                      name="labPI"
                      id="labPI"
                      placeholder="Professor"
                      value={this.state.pi}
                      onChange={this.handleChangePI}
                    />
                    {!this.state.piValid && this.state.triedSubmitting ? (
                      <div className="error-message">
                        <span>Not a valid input.</span>
                      </div>
                    ) : ''}

                    <textarea
                      className="left-input"
                      name="labDescription"
                      id="labDescription"
                      value={this.state.labDescription}
                      onChange={this.handleChangeLabDescript}
                      placeholder="Optional Lab Description"
                    />
                  </div>
                )}
              <br />
            </div>
            <div className="submit-container">
              <input
                className="button button-small registration"
                type="submit"
                value={this.state.buttonValue}
                disabled={this.state.buttonDisabled}
              />
            </div>
          </form>

        </div>
        <Footer />
      </div>
    );
  }
}
export default InstructorRegister;
