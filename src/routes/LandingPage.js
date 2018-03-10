import React, {Component} from 'react';
import '../LandingPage.css';
import logo from '../images/vectorlogo.png';
import stockPhoto from '../images/writing-picture.jpg';
import filler from '../images/download.png';
import CrossCircle from 'react-icons/lib/fa/exclamation-circle';


class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        return (
          <div className="landingPage">
          <header>
		<h2><img className="logo" src={logo}/></h2>
		<nav>
			<li><a href="#">Home</a></li>
			<li><a href="#">Products</a></li>
			<li><a href="#">About</a></li>
			<li><a href="#">Contacts</a></li>
		</nav>
	</header>


	<section className="hero">
		<div className="background-image"></div>
		<h1>Research Connect</h1>
		<h3>Find and post research opportunities on campus.</h3>
    <hr/>
    <div className="button-div">
    <input className="button" type="submit" value="For Students"/>
    <input className="button" type="submit" value="For Faculty"/>
    </div>

    <CrossCircle className="arrow"/>

	</section>


	<section className="our-work for-students">
		<h3> For students, Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nullam id felis et ipsum bibendum ultrices. Morbi vitae pulvinar velit. Sed
    aliquam dictum sapien, id sagittis augue malesuada eu.</h3>
    <div className="photo-flex">
    <div className="step">
      <img className="step-photo" src={filler}/>
      <p>Step 1: Sign up and fill out profile </p>
    </div>
    <div className="step">
      <img className="step-photo" src={filler}/>
      <p>Step 2: Find and apply for opportunities </p>
    </div>
    <div className="step">
      <img className="step-photo" src={filler}/>
      <p>Step 3: Check your inbox for your results! </p>
    </div>
    </div>
    <input className="get-started button" type="submit" value="Click Here to Get Started"/>

	</section>


  <section className="our-work for-profs">
    <h3> For faculty, Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nullam id felis et ipsum bibendum ultrices. Morbi vitae pulvinar velit. Sed
    aliquam dictum sapien, id sagittis augue malesuada eu.</h3>
    <div className="photo-flex">
    <div className="step">
      <img className="step-photo" src={filler}/>
      <p>Step 1: Sign up and fill out profile </p>
    </div>
    <div className="step">
      <img className="step-photo" src={filler}/>
      <p>Step 2: Get applications from students </p>
    </div>
    <div className="step">
      <img className="step-photo" src={filler}/>
      <p>Step 3: Check your inbox for your results! </p>
    </div>
    </div>
    <input className="get-started button" type="submit" value="Click Here to Get Started"/>

  </section>


	<section className="reviews">

  <h2>Why use Research Connect?</h2>

	</section>




	<footer>
		<ul>
			<li><a href="#"><i className="fa fa-twitter-square"></i></a></li>
			<li><a href="#"><i className="fa fa-facebook-square"></i></a></li>
			<li><a href="#"><i className="fa fa-snapchat-square"></i></a></li>
			<li><a href="#"><i className="fa fa-pinterest-square"></i></a></li>
			<li><a href="#"><i className="fa fa-github-square"></i></a></li>
		</ul>
		<p>Made by <a href="http://cornelldti.org/" target="_blank">Cornell Design and Tech Initiative</a></p>
    <p>Report a bug </p>
	</footer>
  </div>
        );
    }
}

export default LandingPage;
