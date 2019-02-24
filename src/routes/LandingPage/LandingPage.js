import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './LandingPage.scss';
import axios from 'axios';
import DeleteIcon from 'react-icons/lib/ti/delete';
import SearchIcon from 'react-icons/lib/io/search';
import { GoogleLogin } from 'react-google-login';
import check from '../../images/check.png';
import cis from '../../images/logo1.png';
import curb from '../../images/logo2.png';
import CDTI from '../../images/logo3.png';
import lightbulb from '../../images/lightbulb.png';
import pen from '../../images/pen.png';
import triangler from '../../images/triangle1.png';
import trianglel from '../../images/triangle2.png';

import blueIcon from '../../images/blueIcon.png';
import greenIcon from '../../images/greenIcon.png';
import redIcon from '../../images/redIcon.png';
import yellowIcon from '../../images/yellowIcon.png';
import purpleIcon from '../../images/purpleIcon.png';

import img2 from '../../images/img2.png';

import logoWithText from '../../images/vectorlogo.png';
import CDTIlogo from '../../images/cdti.png';
import * as Utils from '../../components/Utils';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBar: '',
      matchingSearches: [],
      searching: false,
      clickedEnter: false,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem('token_id') !== null) {
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`)
        .then((response) => {
          console.log('Role: ');
          console.log(response.data);
          let endUrl;
          if (response.data === 'undergrad') {
            endUrl = '/studentDashboard';
            window.location.href = endUrl;
          } else if (response.data === 'none' || response.data === null) {
            // 'none' means they're not an undergrad or professor
            logoutGoogle();
          } else {
            endUrl = '/professorDashboard';
            window.location.href = endUrl;
          }
        })
        .catch((error) => {
          Utils.handleTokenError(error);
        });
    }
  }

  loginFailure(a) {
    console.log(a);
    console.log('Error logging in with Google, please ensure you used an @cornell.edu address.');
  }

  responseGoogleStudent = (response) => {
    console.log('response google student ran');
    sessionStorage.setItem('token_id', response.tokenId);
    // if they're signing up with an email that's not a cornell one, reject it
    if (response.profileObj.email.indexOf('@cornell.edu') === -1) {
      alert('Please sign in with a cornell email (netid@cornell.edu)');
      logoutGoogle();
    }
    axios.get(`/api/hasRegistered/${response.profileObj.email.replace('@cornell.edu', '')}`).then((hasRegistered) => {
      console.log('has registered');
      console.log(hasRegistered);
      if (hasRegistered.data) {
        window.location.href = '/studentDashboard';
      } else {
        window.location.href = '/studentRegister';
      }
    });
  };

  responseGoogle = (response) => {
    console.log('lab researcher signup');
    sessionStorage.setItem('token_id', response.tokenId);
    // TODO this is wrong, will not always be net id since not all professors have net id emails... remove all references to this session item
    sessionStorage.setItem('netId', response.profileObj.email.replace('@cornell.edu', ''));

    let role = '';
    axios.get(`/api/role/${sessionStorage.getItem('token_id')}` /* 'prk57' */).then((roleResponse) => {
      role = roleResponse.data;
      console.log(`landing page role: ${role}`);
      if (role === 'undergrad') {
        console.log('what');
        this.responseGoogleStudent(response);
        return;
      }
      console.log(`email: ${response.profileObj.email}`);
      // don't use has registered, just use role. but if you do use this, it takes raw net id not token.
      axios.get(`/api/hasRegistered/${response.profileObj.email}`).then((hasRegistered) => {
        console.log(`registerd? ${hasRegistered}`);
        if (hasRegistered.data) {
          window.location.href = '/professorDashboard';
        } else {
          window.location.href = '/instructorRegister';
        }
      });
    }).catch((error) => {
      console.log('Error');
      console.log(error);
      Utils.handleTokenError(error);
    });
  };


  scrollTo(id) {
    console.log('scrolling');
    const scrollToElement = require('scroll-to-element');
    scrollToElement(id, {
      offset: 0,
      ease: 'linear',
      duration: 600,
    });
  }

  postOpp() {
    window.location.href = '/newopp';
  }

  handleUpdateSearch(e) {
    this.setState({ searchBar: e.target.value });
    if (e.target.value == '') {
      this.setState({ matchingSearches: [] });
      this.setState({ clickedEnter: false });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.setState({ clickedEnter: true });
      axios.get(`${'/api/opportunities/search' + '?search='}${this.state.searchBar}`)
        .then((response) => {
          const matching = [];
          for (let i = 0; i < response.data.length; i++) {
            matching.push(response.data[i]._id);
          }
          this.setState({ matchingSearches: matching });
        })
        .catch((error) => {
          Utils.handleTokenError(error);
        });
    }
  }

  onFocus() {
    this.setState({ searching: true });
  }

  onBlur() {
    this.setState({ searching: false });
  }

  clearSearch() {
    this.setState({ searching: false });
    this.setState({ searchBar: '' });
    this.setState({ matchingSearches: [] });
    this.setState({ clickedEnter: false });
  }


  logoutClear() {
    logoutGoogle();
  }

  render() {
    return (
      <div className="landingPage">
        <header>
          <h2>
            <a href="/">
              <img alt="Research Connect" className="logo" src={logoWithText} />
            </a>
          </h2>

          <nav>
            <li><a className="landingPage hover" href="/">For Students</a></li>
            <li><a href="/profLanding">For Labs</a></li>


            {sessionStorage.getItem('token_id') === null ? (

              <div>
                <GoogleLogin
                  clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
                  buttonText="Student Log In"
                    // hostedDomain="cornell.edu"
                  onSuccess={this.responseGoogleStudent.bind(this)}
                  onFailure={this.loginFailure.bind(this)}
                  className="login button"
                />
              </div>
            ) : (
              <li />
            )}
          </nav>
        </header>

        <section id="home" className="hero">
          <div className="background-image" />
          <h1>Research Connect for Labs</h1>
          <h3>Find your next research opportunity.</h3>

          <div className="row search-div-container">
            <div className="search-icon-div">
              <SearchIcon style={{ height: '100%' }} size={36} />
            </div>
            <input
              onFocus={this.onFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              className="search-bar"
              onKeyPress={this.handleKeyPress.bind(this)}
              onChange={this.handleUpdateSearch.bind(this)}
              value={this.state.searchBar}
              type="text"
              name="search"
              placeholder="Search keywords (e.g. psychology, machine learning, Social Media Lab)"
            />
            <div className="delete-div">
              {
                this.state.searchBar != '' ? (
                  <DeleteIcon
                    onClick={this.clearSearch.bind(this)}
                    className="clear-icon"
                    style={{ height: '100%' }}
                    size={36}
                  />
                ) : ''
              }
            </div>
          </div>
        </section>

        <section className="incollab">
          <Container className="middleContainer">
            <Row>
              <Col><p className="collab">In Collabortation with ...     </p></Col>
              <Col><img className="middleImage" src={cis} /></Col>
              {/* <Col><img className="middleImage-curb" src={curb} /></Col> */}
              <Col><img className="middleImage" src={CDTI} /></Col>
            </Row>
          </Container>

        </section>

        <section className="middleContainer2">
          <Container>
            <Row>
              <p>
Are you a professor, student, or other faculty member looking for research assistants?
                <a href="/profLanding">Visit Research Connect for Labs </a>
              </p>
            </Row>
            <Row>
              <p className="big ">Explore Popular Areas of Interest</p>
            </Row>
            <Row>
              <Col className="text-center">
                <Row><img className="middleImage" src={blueIcon} /></Row>
                <Row className="text-center">
                  {' '}
                  <p id="no-max-width">
DATA
                    <br />
                    {' '}
SCIENCE
                  </p>
                  {' '}
                </Row>
              </Col>
              <Col>
                <Row />
                <img className="middleImage" src={greenIcon} />
                <Row />
                <Row>
                  {' '}
                  <p>COMPUTATIONAL BIOLOGY</p>
                  {' '}
                </Row>
              </Col>
              <Col>
                <Row><img className="middleImage" src={redIcon} /></Row>
                <Row>
                  {' '}
                  <p>MACHINE LEARNING</p>
                  {' '}
                </Row>
              </Col>
              <Col>
                <Row><img className="middleImage" src={yellowIcon} /></Row>
                <Row>
                  {' '}
                  <p>NATURAL LANGUAGE PROCESSING</p>
                  {' '}
                </Row>
              </Col>
              <Col>
                <Row><img className="middleImage" src={purpleIcon} /></Row>
                <Row>
                  {' '}
                  <p>COMPUTER VISION</p>
                  {' '}
                </Row>
              </Col>

            </Row>
          </Container>
        </section>

        <section id="about" className="why-us">
          <div className="students-title">
            <h2>Discover your passion.</h2>
            <section>
              <Row>
                <Col><img className="list-image" src={pen} /></Col>
                <Col><p>Search for opportunities by sorting by your interests and qualifications.</p></Col>
              </Row>
              <Row>
                <Col><img className="list-image" src={img2} /></Col>
                <Col><p>Get connected to leading researchers and investigators in fields that interest you.</p></Col>
              </Row>
              <Row>
                <Col><img className="list-image" src={lightbulb} /></Col>
                <Col><p>Apply for lab positions directly from our platform.</p></Col>
              </Row>

            </section>
          </div>
          <div>
            <img className="triangle" src={triangler} alt="research connect logo" />
          </div>
        </section>


        <section id="forstudents" className="our-work for-students">
          <div>
            <img className="triangle" src={trianglel} alt="research connect logo" />
          </div>

          <div className="students-title">

            <section>
              <Row>
                <h2>Made for students by students.</h2>
              </Row>
              <Row>
                <Col><p>We know how frustrating it can be to get involved with a lab at Cornell. That’s why we created Research Connect.</p></Col>
              </Row>
              <Row>
                <section className="list">
                  <Row>
                    <Col><img className="list-image" src={check} /></Col>
                    <Col><p>No more cold emails. </p></Col>
                  </Row>
                  <Row>
                    <Col><img className="list-Image" src={check} /></Col>
                    <Col><p>Less waiting.</p></Col>
                  </Row>
                  <Row>
                    <Col><img className="list-Image" src={check} /></Col>
                    <Col><p>More research. </p></Col>
                  </Row>

                </section>

              </Row>


            </section>
          </div>
        </section>


        <section id="forprofs" className="our work for-profs">
          <div className="students-title center-text">
            <h2>Doing research in leading labs on campus has never been easier.</h2>
            <br />
            <div className="center-text">
              <p id="no-max-width">Join today to start your research journey and get connected. </p>
            </div>
          </div>

          <div className="signup-wrap">
            <GoogleLogin
              clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
              buttonText="GET STARTED"
              onSuccess={this.responseGoogle}
              onFailure={this.loginFailure.bind(this)}
              className="signup2 button"
            />
          </div>
        </section>


        <footer className="footer-all">
          <ul>
            <li><a href="#"><i className="fa fa-twitter-square" /></a></li>
            <li><a href="#"><i className="fa fa-facebook-square" /></a></li>
            <li><a href="#"><i className="fa fa-snapchat-square" /></a></li>
            <li><a href="mailto:acb352@cornell.edu"><i className="fas fa-envelope" /></a></li>
            <li>
              <a href="https://github.com/cornell-dti/research-connect">
                <i className="fa fa-github-square" />
              </a>
            </li>
          </ul>
          <p>Created by</p>
          <a href="http://cornelldti.org/" target="_blank" rel="noopener noreferrer">
            <img className="CDTIlogo" src={CDTIlogo} alt="CDTI logo" />
          </a>

          <div style={{ float: 'left', width: '50%' }}>
            <p><a href="https://goo.gl/forms/MWFfYIRplo3jaVJo2" target="_blank" rel="noopener noreferrer">Report a bug</a></p>
            <p><a href="mailto:acb352@cornell.edu">Contact</a></p>
          </div>
        </footer>
      </div>
    );
  }
}

export default Landing;
