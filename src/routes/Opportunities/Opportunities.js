import React, { Component } from 'react';
import axios from 'axios';
import './Opportunities.scss';
import '../../index.css';
import DeleteIcon from 'react-icons/lib/ti/delete';
import SearchIcon from 'react-icons/lib/io/search';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import * as ReactGA from 'react-ga';
import { Route, Redirect } from 'react-router';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import VariableNavbar from '../../components/Navbars/VariableNavbar';
import Footer from '../../components/Footer/Footer';
import logo from '../../images/vectorlogo.png';
import OpportunityBox from '../../components/Opportunity/OpportunityBox/OpportunityBox';
// import MajorSelect from '../../components/MajorSelect/MajorSelect';
// import GPASelect from '../../components/GPASelect/GPASelect';

// necessary for all filters
import Filter from '../../components/Filter/Filter'; // this one is just the label, a bit annoying
import SchoolYearFilter from '../../components/Filter/SchoolYearFilter';
import GPAFilter from '../../components/Filter/GPAFilter';
import CompensationFilter from '../../components/Filter/CompensationFilter';
import CSAreasFilter from '../../components/Filter/CSAreasFilter';
import StartDateFilter from '../../components/Filter/StartDateFilter';


// import StartDate from '../../components/StartDate/StartDate';
import * as Utils from '../../components/Utils';
import ProfessorNavbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';

class Opportunities extends Component {
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
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  handleSearchTerms() {
    // They can search from the home page, make it do something
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    console.log('search term!');
    console.log(searchTerm);
    if (searchTerm) {
      console.log('in search term');
      this.setState({ searchBar: searchTerm });
      document.getElementById('searchOpps').value = searchTerm;
    }
  }

  componentDidMount() {
    this.handleSearchTerms();
    if (!sessionStorage.getItem('token_id')) {
      this.setState({ role: null });
      return;
    }
    // TODO convert this into a promise and put in utils
    axios.get(`/api/role/${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        if (!response || response.data === 'none' || !response.data) {
        } else {
          this.setState({ role: response.data });
        }
      })
      .catch((error) => {
        console.log('error in /api/role for in Opportunities');
        Utils.handleTokenError(error);
      });

    // They can search from the home page, make it do something
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    console.log('search term!');
    console.log(searchTerm);
    if (searchTerm) {
      console.log('in search term');
      this.setState({ searchBar: searchTerm });
      document.getElementById('searchOpps').value = searchTerm;
    }
  }

  handleUpdateMajor(majorObj) {
    this.setState({ majorSelect: majorObj });
  }

  handleUpdateDate(dateObj) {
    this.setState({ startDate: dateObj });
  }

  handleUpdateSearch(e) {
    this.setState({ searchBar: e.target.value });
    if (e.target.value == '') {
      this.setState({
        matchingSearches: [],
        clickedEnter: false,
      });
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
          console.log('error in /api/opportunities/search in Opportunities');
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

  goHome() {
    window.location.href = '/';
  }

  render() {
    /** BEGIN code for detecting role and changing navbar */
    // TODO make temp navbar into a component
    return (
      <div className="opportunities-wrapper">
        <Redirect to="/faculty" />
        <VariableNavbar role={this.state.role} current="opportunities" />
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
            id="searchOpps"
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
        <br />
        <div className="opp-container row" id="top-align">
          <div className="column column-20">
            <div className="filter-box">

              <Filter label="Filter by..." />
              <hr />
              <SchoolYearFilter
                update={Utils.updateMultipleChoiceFilter.bind(this)}
              />
              <hr />
              <GPAFilter
                update={Utils.updateSingleChoiceFilter.bind(this)}
              />
              <hr />
              <StartDateFilter
                update={Utils.updateSingleChoiceFilter.bind(this)}
              />
              <hr />
              <CompensationFilter
                update={Utils.updateMultipleChoiceFilter.bind(this)}
              />
              <hr />
              <CSAreasFilter
                update={Utils.updateMultipleChoiceFilter.bind(this)}
              />

            </div>
          </div>

          <div className="column opportunities-list-wrapper">
            <OpportunityBox
              filteredOptions={this.state}
              url="opportunities"
              searching={this.state.clickedEnter}
            />
          </div>
        </div>

        <Footer />
      </div>

    );
  }
}

export default Opportunities;
