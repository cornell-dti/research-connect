import React, {Component} from 'react';
import '../LandingPage.css';
import logo from '../images/vectorlogo.png';
import stockPhoto from '../images/writing-picture.jpg';
import filler from '../images/download.png';
import img1 from '../images/img1.png';
import img2 from '../images/img2.png';
import img3 from '../images/img3.png';
import axios from 'axios';
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

	componentWillMount() {
		if (sessionStorage.getItem('token_id') !== null) {
			axios.get('/api/role/' +  sessionStorage.getItem('token_id'))
			.then((response) => {
				window.location.href = response.data !== 'undergrad' ? '/professorView' : '/opportunities';
			})
			.catch(function (error) {
				console.log(error);
			});
		}
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

	loginFailure(a) {
		console.log(a);
		console.log("Error logging in with Google, please ensure you used an @cornell.edu address.");
	}

	responseGoogleStudent(response) {
		sessionStorage.setItem('token_id', response.tokenId);
		console.log(sessionStorage.getItem('token_id'));
		axios.get("/api/hasRegistered/" + response.profileObj.email.replace("@cornell.edu","")).then((hasRegistered) => {
			console.log("has registered");
			console.log(hasRegistered);
			if (hasRegistered.data) {
				window.location.href = "/opportunities";
			}
			else {
				window.location.href = "/studentRegister";
			}
		});
	}

	responseGoogle(response) {
		sessionStorage.setItem('token_id', response.tokenId);
		sessionStorage.setItem('netId', response.profileObj.email.replace("@cornell.edu",""));

		let role = "";
		axios.get('/api/role/' + sessionStorage.getItem('token_id') /* 'prk57'*/).then((response) => { role = response.data });

		if (role === 'undergrad') {
			this.responseGoogleStudent(response);
			return;
		}

		//don't use has registreed, just use role. but if you do use this, it takes raw net id not token.
		axios.get("/api/hasRegistered/" + response.profileObj.email.replace("@cornell.edu","")).then((hasRegistered) => {
			if (hasRegistered.data) {
				window.location.href = "/professorView";
			}
			else {
				window.location.href = "/instructorRegister";
			}
		});
	}


	logout() {
		sessionStorage.clear();
	}

	render() {
		return (
			<div className="landingPage">
				<header>
					<h2>
						<a onClick={this.scrollTo.bind(this, '#home')}>
							<img className="logo" src={logoWithText}/>
						</a>
					</h2>

					<nav>
						<li><a onClick={this.scrollTo.bind(this, '#about')}>About</a></li>
						<li><a onClick={this.scrollTo.bind(this, '#forstudents')}>For Students</a></li>
						<li><a onClick={this.scrollTo.bind(this, '#forprofs')}>For Labs</a></li>
						{sessionStorage.getItem('token_id') === null ? (
							<div><GoogleLogin
								clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
								buttonText="Lab Log In"
								onSuccess={this.responseGoogle.bind(this)}
								onFailure={this.loginFailure.bind(this)}
								className="login button"/>
								<GoogleLogin
									clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
									buttonText="Student Log In"
									onSuccess={this.responseGoogleStudent.bind(this)}
									onFailure={this.loginFailure.bind(this)}
									className="login button"/>
							</div>
						) : (
							<li></li>
						)}
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
						{/*<Link to="/instructorregister">*/}
						<input className="white-button lab-button" type="submit" value="For Labs"
							   onClick={this.scrollTo.bind(this, '#forprofs')}/>
						{/*</Link>*/}
					</div>
				</section>

				<section id="about" className="why-us reviews">
					<div className="students-title">
						<h2>Why use Research Connect?</h2>
						<h3>The abundance of undergraduate research opportunities is one of the great things about Cornell, yet unfortunately the process of finding these opportunities is still very unstructured. One must knock on doors, send countless emails to professors, and make do with obsolete web pages to seek research opportunities. Research Connect aims to bridge this gap by providing a structured platform where students can find opportunities, and research labs can find the students they are looking for.</h3>
					</div>
					<div>
						<img className="why-logo" src={logo} alt="research connect logo"/>
					</div>
				</section>

				<section id="forstudents" className="our-work for-students">
					<div className="students-title">
						<h2>Made for students by students.</h2>
						<h3>Get a research position at a Cornell lab of your choice. The days of cold emailing and
							knocking
							on professors{"'"} doors are over.</h3>
					</div>
					<div className="photo-flex">
						<div className="step">
							<img className="padding step-photo" src={student1}/>
							<br /><p>Easily fill out a profile with your credentials and interests.</p>
						</div>
						<div className="step">
							<img className="padding step-photo" src={student2}/>
							<br /><p>Find relevant listings that fit your interests and qualifications.</p>
						</div>
						<div className="step">
							<img className="padding step-photo" src={student3}/>
							<br /><p>Apply and get in touch with researchers and labs in your field!</p>
						</div>
					</div>
					{/*<Link to="/opportunities"><input className="get-started button" type="submit" value="Get Started"/></Link>*/
						/* hostedDomain="cornell.edu" */}
					<div className="signup-wrap">
					<GoogleLogin
						clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
						buttonText="Student Signup"
						onSuccess={this.responseGoogleStudent.bind(this)}
						onFailure={this.loginFailure.bind(this)}
						className="signup button"/>
					</div>
				</section>


				<section id="forprofs" className="our-work for-profs">
					<div className="students-title">
						<h2>Find passionate and qualified students for your lab.</h2>
						<h3>Getting reliable help in your research lab has never been easier.
							Let students come to you without the hassle of contacting individuals and sifting through
							apps.</h3>
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
					<div className="signup-wrap">
					<GoogleLogin
						clientId="938750905686-krm3o32tgqofhdb05mivarep1et459sm.apps.googleusercontent.com"
						buttonText="Lab Signup"
						onSuccess={this.responseGoogle.bind(this)}
						onFailure={this.loginFailure.bind(this)}
						className="signup button"/>
					</div>
				</section>


				<footer>
					<ul>
						<li><a href="#"><i className="fa fa-twitter-square"></i></a></li>
						<li><a href="#"><i className="fa fa-facebook-square"></i></a></li>
						<li><a href="#"><i className="fa fa-snapchat-square"></i></a></li>
						<li><a href="mailto:acb352@cornell.edu"><i className="fas fa-envelope"></i></a></li>
						<li>
							<a href="https://github.com/cornell-dti/research-connect">
								<i className="fa fa-github-square"></i>
							</a>
						</li>
					</ul>
					<p>Created by</p>
					<a href="http://cornelldti.org/" target="_blank">
						<img className="CDTIlogo" src={CDTIlogo} alt="CDTI logo"/>
					</a>

					<div style={{"float": "left", "width": "50%"}}>
						<p><a href="https://goo.gl/forms/MWFfYIRplo3jaVJo2" target="_blank">Report a bug</a></p>
						<p><a href="mailto:acb352@cornell.edu">Contact</a></p>
					</div>
				</footer>
			</div>
		);
	}
}

export default LandingPage;