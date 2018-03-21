import React, {Component} from 'react';
import '../LandingPage.css';
import logo from '../images/vectorlogo.png';
import stockPhoto from '../images/writing-picture.jpg';
import filler from '../images/download.png';
import student1 from '../images/student-laptop.png';
import student2 from '../images/student-magnifier.png';
import student3 from '../images/student-lightbulb.png';
import prof1 from '../images/prof1.png';
import prof2 from '../images/prof2.png';
import prof3 from '../images/prof3.png';
import logoWithText from '../images/LogoWithText.png';
import CDTIlogo from '../images/cdti.png';
import GoogleLogin from 'react-google-login';
import {Link} from 'react-router-dom';


class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    scrollTo(id) {
        console.log("scrolling");
        var scrollToElement = require('scroll-to-element');
        scrollToElement(id, {
            offset: 0,
            ease: 'linear',
            duration: 600
        });
    }

    loginFailure() {
        console.log("error");
    }

    responseGoogle(response) {
        const email = response.profileObj.email;
        const netid = email.substring(0, email.indexOf("@"));
        console.log(netid);
    }

    logout() {
        console.log("logged out");
    }


    render() {
        return (
            <div className="landingPage">
                <header>

                    <h2><a onClick={this.scrollTo.bind(this, '#home')}><img className="logo" src={logoWithText}/></a></h2>

                    <nav>
                        <li><a onClick={this.scrollTo.bind(this, '#about')}>About</a></li>
                        <li><a onClick={this.scrollTo.bind(this, '#forstudents')}>For Students</a></li>
                        <li><a onClick={this.scrollTo.bind(this, '#forprofs')}>For Labs</a></li>
                        <GoogleLogin
                            clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
                            buttonText="Log In"
                            onSuccess={this.responseGoogle.bind(this)}
                            onFailure={this.loginFailure.bind(this)}
                            className="login button"
                            hostedDomain="cornell.edu" />
                    </nav>
                </header>


                <section id="home" className="hero">
                    <div className="background-image"></div>
                    <h1>Research Connect</h1>
                    <h3>Find and post research opportunities on campus.</h3>
                    <hr/>
                    <div className="button-div">
                        <input className="white-button" type="submit" onClick={this.scrollTo.bind(this, '#forstudents')}
                               value="For Students"/>
                        <Link to="/instructorregister">
                            <input className="white-button lab-button" type="submit" value="For Labs"/>
                        </Link>
                    </div>


                </section>
                <section id="about" className="why-us reviews">
                <div className="students-title">
                <h2>Why use Research Connect?</h2>
                <h3>Getting reliable help in your research lab has never been easier.
                Let students come to you without the hassle of contacting individuals and sifting through apps.</h3>
                </div>
                <div>
                <img className="why-logo" src={logo} alt="research connect logo"/>
                </div>

                </section>

                <section id="forstudents" className="our-work for-students">
                    {/*TODO fix formatting of h3 and h2 in ehre*/}
                    <div className="students-title">
                    <h2>Made for students by students.</h2>
                    <h3>Get a research position at a Cornell lab of your choice. The days of cold emailing and knocking
                    on professors{"'"} doors are over.</h3>
                    </div>
                    <div className="photo-flex">
                        <div className="step">
                            <img className="step-photo" src={student1}/>
                            <br /><p>Easily fill out a profile with your credentials and interests.</p>

                        </div>
                        <div className="step">
                            <img className="step-photo" src={student2}/>
                            <br /><p>Find listings that fit your interests and qualifications.</p>

                        </div>
                        <div className="step">
                            <img className="step-photo" src={student3}/>
                            <br /><p>Apply and get in touch with researchers and labs in your field!</p>
                        </div>
                    </div>
                    <Link to="/opportunities"><input className="get-started button" type="submit" value="Get Started"/></Link>

                </section>


                <section id="forprofs" className="our-work for-profs">
                <div className="students-title">
                <h2>Find passionate and qualified students for your lab.</h2>
                <h3>Getting reliable help in your research lab has never been easier.
                Let students come to you without the hassle of contacting individuals and sifting through apps.</h3>
                </div>
                    <div className="photo-flex">
                        <div className="step">
                            <img className="step-photo" src={prof1}/>
                            <br /><p>Customize listings to reach hundreds of interested students. </p>
                            <br/>
                        </div>
                        <div className="step">
                            <img className="step-photo" src={prof2}/>
                            <br /><p>Easily sort through applications and get in touch with qualified students. </p>
                        </div>
                        <div className="step">
                            <img className="step-photo" src={prof3}/>
                            <br /><p>Get the reliable research assistance you need in your lab! </p>
                            <br/>
                        </div>
                    </div>
                    <Link to="/instructorregister">
                        <input className="get-started button" type="submit" value="Get Started"/>
                    </Link>
                </section>


                <footer>
                    <ul>
                        <li><a href="#"><i className="fa fa-twitter-square"></i></a></li>
                        <li><a href="#"><i className="fa fa-facebook-square"></i></a></li>
                        <li><a href="#"><i className="fa fa-snapchat-square"></i></a></li>
                        <li><a href="mailto:acb352@cornell.edu"><i className="fas fa-envelope"></i></a></li>
                        <li><a href="https://github.com/cornell-dti/research-connect"><i
                            className="fa fa-github-square"></i></a></li>
                    </ul>
                    <p>Created by</p>
                     <a href="http://cornelldti.org/" target="_blank"><img className="CDTIlogo" src={CDTIlogo} alt="CDTI logo"/></a>

                    <p><a href="https://goo.gl/forms/MWFfYIRplo3jaVJo2" target="_blank">Report a bug</a></p>
                </footer>
            </div>
        );
    }
}

export default LandingPage;
