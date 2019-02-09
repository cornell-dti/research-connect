import React, { Component } from 'react';
import axios from 'axios';
import './Opportunities.scss';
import '../../index.css';
import DeleteIcon from 'react-icons/lib/ti/delete';
import SearchIcon from 'react-icons/lib/io/search';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import Footer from '../../components/Footer/Footer';
import logo from '../../images/vectorlogo.png';
import OpportunityBox from '../../components/Opportunity/OpportunityBox/OpportunityBox';
import MajorSelect from '../../components/MajorSelect/MajorSelect';
import GPASelect from '../../components/GPASelect/GPASelect';
import Filter from '../../components/Filter/Filter';
import StartDate from '../../components/StartDate/StartDate';
import * as Utils from '../../components/Utils';
import ProfessorNavbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';

class Opportunities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yearSelect: [],
      gpaSelect: {},
      majorSelect: {},
      startDate: {},
      compensationSelect: [],
      searchBar: '',
      matchingSearches: [],
      searching: false,
      clickedEnter: false,
      role: '',
      csAreasSelect:[]
    };
  }

  componentDidMount() {
    if (!sessionStorage.getItem('token_id')) {
      this.setState({ role: null });
      return;
    }

    // TODO convert this into a promise and put in utils
    axios.get(`/api/role/${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        /* if (!response || response.data === "none" || !response.data) {
          alert("You must be signed in to view this.");
          window.location.href = '/';
        }
        else{
          this.setState({role: response.data});
        } */
        this.setState({ role: response.data });
      })
      .catch((error) => {
        Utils.handleTokenError(error);
      });
  }

  /*
  //These two functions are combined into the below function.
  addFilterOption(filterType, option){
    this.setState(prevState => ({[filterType]: [...prevState[filterType], option]}));
  }

  removeFilterOption(filterType, option){
    this.setState(prevState => ({[filterType]: prevState[filterType].filter(originalO => originalO !== option)}));
  }
  */

  updateFilterOption(filterType, option){
    this.setState((state) => {
    	if (state[filterType].includes(option))
    		return {[filterType]: state[filterType].filter(original => original !== option)};
      else
        return {[filterType]: [...state[filterType], option]};
    });
  }

  handleUpdateGPA(gpaObj) {
    this.setState({ gpaSelect: gpaObj });
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
      this.setState({ matchingSearches: [],
                      clickedEnter: false });
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
        {this.state.role && this.state.role === 'undergrad' && <Navbar current="opportunities" />}
        {this.state.role && this.state.role !== 'undergrad' && <ProfessorNavbar current="opportunities" />}
        {!this.state.role && (
        <div className="go-home" onClick={() => this.goHome()}>
          <FaLongArrowLeft style={{ verticalAlign: 'text-top', position: 'relative', top: '2px' }} className="black-arrow" />
        Home
        </div>
        ) /** END code for detecting role and changing navbar */}


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

        <div className="opp-container row" id="top-align">
          <div className="column column-20">
            <div className="filter-box">

              <Filter label="Filter by..." />

              <hr />

              <Filter
                filterType="yearSelect"
                label="School Year"
                updateFilterOption={this.updateFilterOption.bind(this)}
                choices= {Utils.getYears()}
                type = "checkbox"
              />

              {/*
              <div className="filter-child">
                <label htmlFor="yearField">School Year</label>
                <YearSelect
                  filterType="yearSelect"
                  updateFilterOption={this.updateFilterOption.bind(this)}
                  choices={Utils.getYears}
                  generateOptions={this.createCheckbox.bind(this)}
                  />
              </div>
              */}

              <hr />

              <div className="filter-child">
                <label htmlFor="gpaField">GPA Requirement</label>
                <GPASelect updateGPA={this.handleUpdateGPA.bind(this)} />
              </div>

              <hr />

              <div className="filter-child">
                <label htmlFor="startDateField">Start Date</label>
                <StartDate updateDate={this.handleUpdateDate.bind(this)} />
              </div>

              <hr />

              <Filter
                filterType="compensationSelect"
                label="Compensation"
                updateFilterOption={this.updateFilterOption.bind(this)}
                choices={Utils.getCompensation()}
                type = "checkbox"
              />

              <hr />

              <Filter
                filterType="csAreasSelect"
                label="CS Areas"
                updateFilterOption={this.updateFilterOption.bind(this)}
                choices={Utils.getCSAreas()}
                type="checkbox"
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
