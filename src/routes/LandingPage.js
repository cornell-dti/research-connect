import React, {Component} from 'react';
import '../LandingPage.css';
import logo from '../images/vectorlogo.png';
import stockPhoto from '../images/writing-picture.jpg';
import filler from '../images/download.png';
import img1 from '../images/img1.PNG';
import img2 from '../images/img2.PNG';
import img3 from '../images/img3.PNG';

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

    render() {
        return (
            <div className="landingPage">
                <header>

                    <h2><a href="/"><img className="logo" src={logo}/></a></h2>

                    <nav>
                        <li><a onClick={this.scrollTo.bind(this, '#home')}>Home</a></li>
                        <li><a onClick={this.scrollTo.bind(this, '#about')}>About</a></li>
                        <li><a onClick={this.scrollTo.bind(this, '#forstudents')}>For Students</a></li>
                        <li><a onClick={this.scrollTo.bind(this, '#forprofs')}>For Labs</a></li>
                        <input className="button" type="submit" value="Log In"/>

                    </nav>
                </header>


                <section id="home" className="hero">
                    <div className="background-image"></div>
                    <h1>Research Connect</h1>
                    <h3>Find and post research opportunities on campus.</h3>
                    <hr/>
                    <div className="button-div">
                        <input className="button" type="submit" onClick={this.scrollTo.bind(this, '#forstudents')}
                               value="For Students"/>
                        <Link to="/instructorregister">
                            <input className="button" type="submit" value="For Labs"/>
                        </Link>
                    </div>


                </section>
                {/* TODO: set up template formatting so I can edit this*/}
                <section id="about" className="why-us reviews">

                    <h2>Why use Research Connect?</h2>
                </section>

                <section id="forstudents" className="our-work for-students">
                    {/*TODO fix formatting of h3 and h2 in ehre*/}
                    <h3>Get a research position at a Cornell lab of your choice. The days of cold emailing and knocking
                    on professor's doors are over.</h3>
                    <div className="photo-flex">
                        <div className="step">
                            <img className="step-photo" src={img3}/>
                            <br /><p>Step 1: Upload a resume and enter some basic information about yourself</p>
                        </div>
                        <div className="step">
                            <img className="step-photo" src={img3}/>
                            <br /><p>Step 2: Find and apply for research opportunities</p>
                        </div>
                        <div className="step">
                            <img className="step-photo" src={img3}/>
                            <br /><p>Step 3: Get interview requests sent straight to your email inbox!</p>
                        </div>
                    </div>
                    <Link to="/opportunities"><input className="get-started button" type="submit" value="Get Started"/></Link>

                </section>


                <section id="forprofs" className="our-work for-profs">
                    <h3> For Labs, Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam id felis et ipsum bibendum ultrices. Morbi vitae pulvinar velit. Sed
                        aliquam dictum sapien, id sagittis augue malesuada eu.</h3>
                    <div className="photo-flex">
                        <div className="step">
                            <img className="step-photo" src={filler}/>
                            <br /><p>Step 1: Sign up and fill out profile </p>
                        </div>
                        <div className="step">
                            <img className="step-photo" src={filler}/>
                            <br /><p>Step 2: Get applications from students </p>
                        </div>
                        <div className="step">
                            <img className="step-photo" src={filler}/>
                            <br /><p>Step 3: Check your inbox for your results! </p>
                        </div>
                    </div>
                    <Link to="/instructorregister">
                        <input className="get-started button" type="submit" value="Click Here to Get Started"/>
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
                    <p>Made by <a href="http://cornelldti.org/" target="_blank">Cornell Design and Tech Initiative</a>
                    </p>
                    <p><a href="https://goo.gl/forms/MWFfYIRplo3jaVJo2" target="_blank">Report a bug</a></p>
                </footer>
            </div>
        );
    }
}

export default LandingPage;
