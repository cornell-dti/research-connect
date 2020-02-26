import React from 'react';
import axios from 'axios';
import * as ReactGA from 'react-ga';
import onClickOutside from 'react-onclickoutside';
// import Navbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';
import Footer from '../../components/Footer/Footer';
import '../App/App.scss';
import './InstructorRegister.scss';
import AutoSuggest from '../../components/AutoSuggest/AutoSuggest';
import * as Utils from '../../components/Utils';

class InstructorRegister extends React.Component {
  constructor(props) {
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
      labPage: null,
      name: null,
      labDescription: null,
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


    this.loadOpportunitiesFromServer = this.loadOpportunitiesFromServer.bind(this);
  }

  // displayLabs() {
  //   let arrayOfLabs = [];
  //
  //   for (let i = 0; i < this.state.data.length; i++) {
  //       arrayOfLabs.push(<option key={this.state.data[i].name} value={this.state.data[i].name}>{this.state.data[i].name}</option>);
  //
  //   }
  //   return ( <select> <option key="empty" value="">Select Lab</option> {arrayOfLabs} </select>);
  // }


  toggleNewLab() {
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
  }

  handleUpdateLab(labName, id) {
    if (!this.state.newLab) {
      this.setState({ labId: id, name: labName });
      if (labName !== '') {
        this.setState({ labNameValid: true });
      } else {
        this.setState({ labNameValid: false });
      }
    }
  }

  loadOpportunitiesFromServer() {
    axios.get('/api/labs')
      .then((res) => {
        this.setState({ data: res.data });
      }).catch((error) => {
        Utils.handleTokenError(error);
      });
  }

  componentDidMount() {
    this.loadOpportunitiesFromServer();
  }

  handleChangePosition(event) {
    const role = event.target.value;
    this.setState({ roleValid: role !== 'Select Position', role });
  }

  handleChangeNotifications(event) {
    const notifications = event.target.value;
    const notifValid = notifications !== 'When do you want to receive emails about applications to your postings?';
    this.setState({ notifValid, notifications });
  }

  handleChangeFirstName(event) {
    const firstName = event.target.value;
    this.setState({ firstNameValid: firstName !== '', firstName });
  }

  handleChangeLastName(event) {
    const lastName = event.target.value;
    this.setState({ lastNameValid: lastName !== '', lastName });
  }

  handleChangeNetId(event) {
    const netId = event.target.value;
    if (netId && netId.indexOf('@cornell.edu') === -1) {
      this.setState({ netIDValid: true });
    } else {
      this.setState({ netIDValid: false });
    }
    this.setState({ netId });
  }

  handleChangeNewLabName(event) {
    if (this.state.newLab) {
      this.setState({ name: event.target.value });
      if (event.target.value) {
        this.setState({ labNameValid: true });
      } else {
        this.setState({ labNameValid: false });
      }
    }
  }

  handleChangeLabURL(event) {
    this.setState({ labPage: event.target.value });
    if (event.target.value !== '') {
      this.setState({ labURLValid: true });
    } else {
      this.setState({ labURLValid: false });
    }
  }

  handleChangeLabDescript(event) {
    this.setState({ labDescription: event.target.value });
  }

  handleChangePI(event) {
    this.setState({ pi: event.target.value });
    if (event.target.value !== '') {
      this.setState({ piValid: true });
    } else {
      this.setState({ piValid: false });
    }
  }

  suggestionsClicked(event) {
    event.preventDefault();
  }

    onSubmit = (e) => {
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
          }).catch((error) => {
            Utils.handleTokenError(error);
          });
      }
    };

    render() {
      return (
        <div>
          {/* <Navbar/> */}
          <div className=" instructor-reg-form">
            <h3>Lab Administrator Registration</h3>
            <form
              id="register"
                        // action='http://localhost:3001/labAdmins'
              onSubmit={this.onSubmit}
                        // method='post'
              action="/labAdmins"
              method="post"
            >
              <div className="form-inputs">
                <input
                  className="name left-input"
                  type="text"
                  name="adminFirstName"
                  id="adminFirstName"
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={this.handleChangeFirstName.bind(this)}
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
                  onChange={this.handleChangeLastName.bind(this)}
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
                  onChange={this.handleChangeNetId.bind(this)}
                />
                {!this.state.netIDValid && this.state.triedSubmitting ? (
                  <div className="error-message">
                    <span>Not a valid input.</span>
                  </div>
                ) : ''}

                <select
                  className="main-form-input left-input"
                  value={this.state.role}
                  onChange={this.handleChangePosition.bind(this)}
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
                  onChange={this.handleChangeNotifications.bind(this)}
                >
                  <option value="-2">
                    When do you want to receive emails about applications to your
                    postings?
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

                {/* <h6><center>All members of the same lab can view all the opportunities and applications for that lab</center></h6> */}
                {!this.state.newLab
                  ? (
                    <div className="existing-create-left" onClick={this.suggestionsClicked.bind(this)}>
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
                          onClick={this.toggleNewLab.bind(this)}
                        />
                      </div>
                      <div className="auto-div">
                        <AutoSuggest
                          className="left-input"
                          updateLab={this.handleUpdateLab.bind(this)}
                          showDropdown={this.state.showDropdown}
                          onChange={this.handleUpdateLab.bind(this)}
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
                  )

                  : (
                    <div>
                      <div className="existing-or-create">
                        <input
                          type="button"
                          className="left-button button-small-clear"
                          value="Find Existing Lab"
                          onClick={this.toggleNewLab.bind(this)}
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
                        value={this.name}
                        onChange={this.handleChangeNewLabName.bind(this)}
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
                        value={this.labPage}
                        onChange={this.handleChangeLabURL.bind(this)}
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
                        value={this.pi}
                        onChange={this.handleChangePI.bind(this)}
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
                        value={this.labDescription}
                        onChange={this.handleChangeLabDescript.bind(this)}
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
