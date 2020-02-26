import React, { Component } from 'react';
import '../App/App.scss';
import './ProfessorView.scss';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import * as ReactGA from 'react-ga';
import Navbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';
import ApplicationList from '../../components/ApplicationList/ApplicationList';

// necessary for all filters
import Filter from '../../components/Filter/Filter'; // this one is just the label, a bit annoying
import SchoolYearFilter from '../../components/Filter/SchoolYearFilter';
import GPAFilter from '../../components/Filter/GPAFilter';
import CourseSelect from '../../components/CourseSelect/CourseSelect';

import OpportunitySelect from '../../components/OpportunitySelect/OpportunitySelect';
import Footer from '../../components/Footer/Footer';
import * as Utils from '../../components/Utils';

class ProfessorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearSelect: [],
      gpaSelect: '2.5',
      courses: [],
      opportunity: 'All',
      opportunities: [],
      loading: true,
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  handleUpdateCourses = (courses) => this.setState({ courses });

  handleUpdateOpportunity = (opportunity) => this.setState({ opportunity });

  componentDidMount() {
    this.state.loading = false; // temporary
    axios.all([
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`),
      axios.get(`/api/applications?id=${sessionStorage.getItem('token_id')}`),
    ])
      .then(axios.spread((role, apps) => {
        if (role.data !== 'grad'
          && role.data !== 'labtech'
          && role.data !== 'postdoc'
          && role.data !== 'staffscientist'
          && role.data !== 'pi') {
          window.location.href = '/';
        }
        const opps = Object.keys(apps.data);
        opps.unshift('All');
        this.setState({ opportunities: opps });
      }));
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return (
        <div className="sweet-loading">
          <ClipLoader
            style={{ display: 'block', margin: 0, borderColor: 'red' }}
            sizeUnit="px"
            size={150}
            color="#ff0000"
            loading={loading}
          />
        </div>
      );
    }

    return (
      <div>
        <Navbar current="professorView" />

        <div className="professor-view-container">
          <div className="row professor-view-container-row">
            <div className="column column-20">
              <div className="filter-box">

                <Filter label="Filter by..." />
                <hr />

                <div className="filter-child">
                  <label htmlFor="opportunityField">Opportunity</label>
                  <OpportunitySelect
                    opportunities={this.state.opportunities}
                    updateOpportunity={this.handleUpdateOpportunity}
                  />
                </div>

                <hr />

                <SchoolYearFilter
                  update={Utils.updateMultipleChoiceFilter.bind(this)}
                />

                <hr />

                <GPAFilter
                  update={Utils.updateSingleChoiceFilter.bind(this)}
                />

                <hr />

                <div className="filter-child">
                  <label htmlFor="courseField">Required Courses</label>
                  <CourseSelect updateCourses={this.handleUpdateCourses.bind(this)} />
                </div>

                <hr />
              </div>
            </div>

            <div className="column">
              <div className="application-list-container">
                <div className="application-list-header">Applications For Your Lab</div>
                <ApplicationList filter={this.state} />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default ProfessorView;
