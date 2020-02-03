import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './LandingPage.scss';
import axios from 'axios';
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
import SearchBar from '../../components/LandingPage/Student/SearchBar';
import * as ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
ReactGA.initialize('UA-69262899-9');
ReactGA.pageview(window.location.pathname + window.location.search);

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
            endUrl = '/opportunities';
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
          console.log('token error handled on landing page');
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
      return logoutGoogle();
    }
    axios.get(`/api/hasRegistered/${response.profileObj.email.replace('@cornell.edu', '')}`).then((hasRegistered) => {
      console.log('has registered');
      console.log(hasRegistered);
      if (hasRegistered.data) {
        window.location.href = '/faculty';
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
      console.log('token error handled on 2nd landing page catch');
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

  logoutClear() {
    logoutGoogle();
  }

  viewOpps() {
    window.location.href = '/faculty';
  }

  render() {
    return (
      <div className="landingPage">
        <header>
          <h2>
            <a href="/">
              <img alt="Research Connect logo" className="logo" src={logoWithText} />
            </a>
          </h2>

          <nav>
            <li><a className="landingPage hover" href="/">For Students</a></li>
            <li><a href="/profLanding">For Labs</a></li>


            {sessionStorage.getItem('token_id') === null ? (

              <div>
                <GoogleLogin
                  clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
                  buttonText="Log In/Sign Up"
                  onSuccess={this.responseGoogleStudent}
                  onFailure={this.loginFailure.bind(this)}
                  className="signup"
                />

              </div>
            ) : (
                <li />
              )}
          </nav>
        </header>

        <section id="home" className="hero">
          <div className="background-image" />
          <h1>Research Connect</h1>
          <h3>Find your next CS research opportunity.</h3>
          <SearchBar id="search-div-container1" />
          {/*<input*/}
          {/*  className="white-button"*/}
          {/*  id="whiteButton"*/}
          {/*  type="button"*/}
          {/*  onClick={this.viewOpps.bind(this)}*/}
          {/*  value="View All Opportunities"*/}
          {/*  style={{backgroundColor: "white", borderColor: "white", color: "rgb(166,57,45)", marginTop: "20px", width: "30rem", height: "5rem"}}*/}
          {/*/>*/}

        </section>

        <section className="middleContainer2">
          <Container style={{ marginLeft: "auto" }}>
            {/*<Row>*/}
            {/*<p>Are you a professor, student, or other faculty member looking for research assistants? <a href="/profLanding">Visit Research Connect for Labs </a></p>*/}
            {/*</Row>*/}
            <Row>
              <h2 class="big ">Explore Popular Areas of Interest</h2>
            </Row>
            <Row>
              <Col className="text-center">
                <Row><img className="middleImage" src={blueIcon} alt="" /></Row>
                <Row className="text-center"> <p id="no-max-width">DATA <br /> SCIENCE</p> </Row>
              </Col>
              <Col>
                <Row><img className="middleImage" src={greenIcon} alt="" /> </Row>
                <Row> <p>COMPUTATIONAL BIOLOGY</p> </Row>
              </Col>
              <Col>
                <Row><img className="middleImage" src={redIcon} alt="" /></Row>
                <Row> <p>MACHINE LEARNING</p> </Row>
              </Col>
              <Col>
                <Row><img className="middleImage" src={yellowIcon} alt="" /></Row>
                <Row> <p>NATURAL LANGUAGE PROCESSING</p> </Row>
              </Col>
              <Col>
                <Row><img className="middleImage" src={purpleIcon} alt="" /></Row>
                <Row> <p>COMPUTER VISION</p> </Row>
              </Col>

            </Row>
          </Container>
        </section>

        <section id="about" className="why-us">
          <div className="students-title">
            <h2>Discover your passion.</h2>
            <section>
              <Row className="picRow">
                <Col><img id="list-image1" src={pen} height="72" width="100" alt="pen" /></Col>
                <Col><p className="picP">Search for computer science opportunities and stop guessing who is accepting.</p></Col>
              </Row>
              <Row className="picRow">
                <Col><img id="list-image2" src={img2} height="72" width="100" alt="magnifying glass" /></Col>
                <Col><p className="picP">Get help writing emails to professors.</p></Col>
              </Row>
              <Row className="picRow">
                <Col><img id="list-image3" src={lightbulb} height="72" width="100" alt="lightbulb" /></Col>
                <Col><p className="picP">View our complete guide on finding research.</p></Col>
              </Row>

            </section>
          </div>
          <div>
            <img className="triangle" src={triangler} alt="opportunities page screenshot" />
          </div>
        </section>


        <section id="forstudents" className="our-work for-students">
          <div>
            <img className="triangle" src={trianglel} alt="application screenshot" />
          </div>

          <div className="students-title">

            <section>
              <Row>
                <h2>Made for students by students.</h2>
              </Row>
              <Row>
                <Col><p>We know how confusing and frustrating it can be to get involved with CS research at Cornell. That’s why we created Research Connect.</p></Col>
              </Row>
              <Row>
                <section className="list">
                  <Row className="picRow">
                    <Col><img className="list-image" src={check} alt="check" /></Col>

                    <Col>

                      <p className="picP">Apply to positions without having to guess if they’re open.</p></Col>
                  </Row>
                  <Row>
                    <Col><img className="list-image" src={check} alt="check" /></Col>
                    <Col>

                      <p>Search for opportunities by sorting by your interests. </p></Col>
                  </Row>
                  <Row>
                    <Col><img className="list-image" src={check} alt="check" /></Col>
                    <Col>

                      <p>Connect with leading researchers! in fields that inspire you.</p></Col>
                  </Row>

                </section>

              </Row>


            </section>
          </div>
        </section>


        <section id="forprofs" className="our work for-profs">
          <div className="students-title center-text">
            <h2>Doing research in leading groups on campus has never been easier.</h2>
            <br />
            <div className="center-text">
              <p id="no-max-width">Join today to start your research journey and get connected. </p>
            </div>
          </div>

          <div className="signup-wrap">
            <GoogleLogin
              clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
              buttonText="GET STARTED"
              onSuccess={this.responseGoogleStudent}
              onFailure={this.loginFailure.bind(this)}
              className="signup2 button"
            />
          </div>
        </section>

        <footer className="footer-all">
          {/* <ul>
            <li><a href="#" aria-label = "twitter"><i className="fa fa-twitter-square" /></a></li>
            <li><a href="#" aria-label = "facebook"><i className="fa fa-facebook-square" /></a></li>
            <li><a href="#" aria-label = "snapchat"><i className="fa fa-snapchat-square" /></a></li>
            <li><a href="mailto:acb352@cornell.edu" aria-label = "email"><i className="fas fa-envelope" /></a></li>
            <li>
              <a href="https://github.com/cornell-dti/research-connect" aria-label = "github">
                <i className="fa fa-github-square" />
              </a>
            </li>
          </ul> */}
          <p>Created by</p>
          <a href="http://cornelldti.org/" target="_blank" rel="noopener noreferrer">
            <img className="CDTIlogo" src={CDTIlogo} alt="Cornell Design & Tech Initiative" />
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
