import React, {Component} from 'react';
import axios from 'axios';
import '../OpportunityPage/OpportunityPage.scss';
import './ResearchGuide.scss';
import '../../index.css';
import VariableNavbar from '../../components/Navbars/VariableNavbar';
import Footer from '../../components/Footer/Footer';
import * as Utils from '../../components/Utils';
import * as ReactGA from 'react-ga';


class ResearchGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidMount() {
    if (!sessionStorage.getItem('token_id')) {
      this.setState({role: null});
      return;
    }
    axios.get(`/api/role/${sessionStorage.getItem('token_id')}`).
        then((response) => {
          this.setState({role: response.data});
        }).
        catch((error) => {
          Utils.handleTokenError(error);
        });
  }

  goHome() {
    window.location.href = '/';
  }

  render() {
    const isNotLoggedIn = !(this.state.role);
    return (
        <div className="opportunities-wrapper">
          <VariableNavbar role={this.state.role} current="guide"/>
          <div className="opportunities-page-wrapper">
            <div className={`wallpaper ${
                isNotLoggedIn ? 'wallpaper-no-sign-in' : ''}`}
            />
            <div className="row opportunity-row">
              <div className="column">
                <div className="row">
                  <div className="opp-details-card">
                    <div className="opp-details-section">
                      <p className="title">How Do I Find Research?</p>
                      <p className="header1 step">Step 1: Find Interesting Research Being Done By PhD's/Faculty</p>
                      <p className="header2 substep">View Opportunities</p>
                      <p className="instructions">One way to find interesting research is by going to the <a href="/opportunities">"View Opportunities" </a>
                        page and finding opportunities in an area that's interesting to you.</p>
                      <p className="header2 substep">Browse Faculty</p>
                      <p className="instructions">You could also browse the <a href="/faculty">"Email Faculty"</a> page
                      and filter faculty by areas you're interested in, then read their page
                      to see if their research aligns with what you want to do.</p>
                      <p className="header1 step">Step 2: Reach out to the PhD/Faculty</p>
                      <p className="header2 substep">Email</p>
                      <p className="instructions">
                        One way is by writing emails to PhD/Faculty whose work
                        seems interesting. If you go to the <a href="/faculty">"Email Faculty"</a> page
                        and click on a faculty, we provide an email template & writer you can use. It's important
                        that in your email you show that you've looked at their research. On the faculty page
                        we provide info about their research and publications.
                      </p>
                      <p className="header2 substep">In-Person Visits</p>
                      <p className="instructions">
                        You could also go to professor's office hours and ask
                        them about their research and then express your interest in working with them.
                        This is harder but has a higher success rate. In the faculty section of the website,
                        each faculty's page has their office location.
                      </p>
                      <p className="header1 step">Step 3: Repeat</p>
                      <p className="instructions">You'll likely have to reach out to multiple PhD's/Faculty
                      If you do, just be sure you actually care about their research - they can tell if you don't.</p>
                    </div>
                    <div className="opp-details-section">
                      <p className="title">Is It Too Early/Late To Reach Out For Research?</p>
                      <p className="step">It can't hurt; worst case scenario they tell you to ping them in a month or so and now you've demonstrated interest!
                      PhD students are usually flexible.</p>
                    </div>
                    <div className="opp-details-section">
                      <p className="title">I Still Have Questions About Finding Research</p>
                      <p className="header1 step">Ask Us!</p>
                      <p className="substep">We'd love to answer any questions you have - use the <a href="https://docs.google.com/forms/d/e/1FAIpQLSelEuVftvCr9ndS2Cby0Zli2V89PIuqk2FxPzekd5MpSS9HGA/viewform" target="_blank">contact form</a> to ask and we'll respond in 24 hours!.</p>
                      <p className="header1 step">Read the Comprehensive Guide</p>
                      <p className="substep">We collaborated with ACSU to produce a
                        <a href="https://medium.com/@researchconnectcu/cornell-cs-research-readme-381206eaabcb" target="_blank"> comprehensive guide </a>
                        to finding CS research at Cornell. If you're in a rush, the guide's <a href="https://medium.com/p/381206eaabcb#31a8">FAQ</a> is very helpful.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <Footer/>
        </div>
    );
  }
}

export default ResearchGuide;
