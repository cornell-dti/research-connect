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
import CourseSelect from '../../components/CourseSelect/CourseSelect';

import OpportunitySelect from '../../components/OpportunitySelect/OpportunitySelect';
import Footer from '../../components/Footer/Footer';
import { updateForMultipleChoice } from '../../components/Utils';
import { gpa, years } from '../../components/constants';

type State = {
  yearSelect: string[];
  gpaSelect: string;
  courses: string[];
  opportunity: string;
  opportunities: string[];
  loading: boolean;
};

class ProfessorView extends Component<{}, State> {
  constructor(props: {}) {
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

  handleUpdateCourses = (courses: string[]) => this.setState({ courses });

  handleUpdateOpportunity = (opportunity: string) => this.setState({ opportunity });

  handleYearSelect = (oneOption: string) => this.setState((state) => ({
    yearSelect: updateForMultipleChoice(state.yearSelect, oneOption),
  }));

  handleGPASelect = (gpaSelect: string) => this.setState({ gpaSelect });

  componentDidMount() {
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
        this.setState({ opportunities: opps, loading: false });
      }));
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      const style = { display: 'block', margin: 0, borderColor: 'red' };
      // @ts-ignore
      const loader = <ClipLoader style={style} sizeUnit="px" size={150} color="#ff0000" loading />;
      return <div className="sweet-loading">{loader}</div>;
    }

    return (
      <div>
        <Navbar current="professorView" />

        <div className="professor-view-container">
          <div className="row professor-view-container-row">
            <div className="column column-20">
              <div className="filter-box">

                <div className="filter-child">
                  <label>Filter by...</label>
                </div>
                <hr />

                <div className="filter-child">
                  <label htmlFor="opportunityField">Opportunity</label>
                  <OpportunitySelect
                    opportunities={this.state.opportunities}
                    updateOpportunity={this.handleUpdateOpportunity}
                  />
                </div>

                <hr />

                <Filter
                  label="School Year"
                  updateFilterOption={this.handleYearSelect}
                  choices={years}
                  type="checkbox"
                />

                <hr />

                <Filter
                  label="GPA Select"
                  updateFilterOption={this.handleGPASelect}
                  choices={gpa}
                  type="select"
                />

                <hr />

                <div className="filter-child">
                  <label htmlFor="courseField">Required Courses</label>
                  <CourseSelect updateCourses={this.handleUpdateCourses} />
                </div>

                <hr />
              </div>
            </div>

            <div className="column">
              <div className="application-list-container">
                <div className="application-list-header">Applications For Your Lab</div>
                <ApplicationList
                  filter={{
                    opportunity: this.state.opportunity,
                    yearSelect: this.state.yearSelect,
                    gpaSelect: this.state.gpaSelect,
                    courses: this.state.courses,
                    skills: [],
                  }}
                />
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
