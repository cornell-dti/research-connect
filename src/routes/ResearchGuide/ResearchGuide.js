import React, {Component} from 'react';
import axios from 'axios';
import '../OpportunityPage/OpportunityPage.scss';
import '../../index.css';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import VariableNavbar from '../../components/Navbars/VariableNavbar';
import Footer from '../../components/Footer/Footer';
import logo from '../../images/vectorlogo.png';

// import StartDate from '../../components/StartDate/StartDate';
import * as Utils from '../../components/Utils';

class ResearchGuide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearSelect: [],
      gpaSelect: '2.5',
      majorSelect: {},
      startDate: '',
      compensationSelect: [],
      searchBar: '',
      matchingSearches: [],
      searching: false,
      clickedEnter: false,
      role: '',
      csAreasSelect: [],
    };
  }

  componentDidMount() {
    if (!sessionStorage.getItem('token_id')) {
      this.setState({role: null});
      return;
    }

    // TODO convert this into a promise and put in utils
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
    /** BEGIN code for detecting role and changing navbar */
    // TODO make temp navbar into a component
    return (
        <div className="opportunities-wrapper">
          <VariableNavbar role={this.state.role} current="opportunities"/>
          <div className="opportunities-page-wrapper">
            <div className={`wallpaper ${
                isNotLoggedIn ? 'wallpaper-no-sign-in' : ''}`}
            />
            <div className="row opportunity-row">
              <div className="column opp-details-column">
                <div className="row">
                  <div className="opp-details-card">
                    <div className="opp-details-section">
                      <div className="header">Supervisor</div>
                      <div>
                        {this.state.opportunity.supervisor
                            ? this.state.opportunity.supervisor
                            : notProvidedMessage}
                      </div>
                    </div>
                    <div className="opp-details-section">
                      <div className="header">Qualifications</div>
                      <div>
                        {this.state.opportunity.qualifications
                            ? this.state.opportunity.qualifications
                            : notProvidedMessage}
                      </div>
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
