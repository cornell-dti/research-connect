import React, { Component, ChangeEvent, KeyboardEvent } from 'react';
import ReactGA from 'react-ga';
import axios from 'axios';
import '../../index.css';
// @ts-ignore
import DeleteIcon from 'react-icons/lib/ti/delete';
// @ts-ignore
import SearchIcon from 'react-icons/lib/io/search';
import Footer from '../../components/Footer/Footer';
import FacultyBox from '../../components/Faculty/FacultyBox/FacultyBox';
import OpportunityBox from '../../components/Opportunity/OpportunityBox/OpportunityBox';
import * as Utils from '../../components/Utils';
import '../Opportunities/Opportunities.scss';
import '../OpportunityPage/OpportunityPage.scss';

import './FacultySearch.scss';
import VariableNavbar from '../../components/Navbars/VariableNavbar';
import { researchInterestsList } from '../../components/constants';
import { Professor } from '../../types';

type State = {
  area: string;
  searchBar: string;
  clickedEnter: boolean;
  role: string | null;
  data: Professor[];
  opportunitiesOptions: any
};

class FacultySearch extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      area: '',
      searchBar: '',
      clickedEnter: false,
      role: '',
      data: [],
      opportunitiesOptions: {
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
      },
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  getFaculty = () => {
    const searchText = this.state.clickedEnter ? this.state.searchBar : '';
    axios.get('/api/faculty', {
      params: {
        department: 'tech',
        limit: 0,
        area: this.state.area,
        search: searchText,
      },
    }).then((res) => this.setState({ data: res.data }));
  };

  componentDidMount() {
    // if they're not signed in...
    if (!sessionStorage.getItem('token_id')) {
      this.setState({ role: null });
    } else {
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`)
        .then((response) => {
          if (!response || response.data === 'none' || !response.data) {
            this.setState({ role: null });
          } else {
            this.setState({ role: response.data });
          }
        })
        .catch((error) => {
          Utils.handleTokenError(error);
        });
    }
    this.getFaculty();
  }

  handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (event.target.name === 'area') {
      this.setState({ area: event.target.value }, () => {
        this.getFaculty();
      });
    }
  }

  handleUpdateSearch = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchBar: e.target.value });
    if (!e.target.value) {
      this.setState({ clickedEnter: false }, () => {
        this.getFaculty();
      });
    }
  };

  handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this.setState({ clickedEnter: true }, () => {
        this.getFaculty();
      });
    }
  };

  clearSearch = () => {
    this.setState(
      { searchBar: '', clickedEnter: false },
      () => this.getFaculty(),
    );
  };

  generateAreaOptions = () => {
    const areas = researchInterestsList;
    if (areas.length === 0) {
      return [];
    }
    return areas.map((area) => <option value={area.trim()} key={area}>{area}</option>);
  };

  render() {
    const headerStyle = {
      color: 'black',
      fontSize: '40px',
      fontWeight: 'bold',
    } as const;
    return (
      <div className="opportunities-wrapper">
        <VariableNavbar role={this.state.role} current="facultysearch" />

        <div className="row search-div-container">
          <div className="search-icon-div">
            <SearchIcon style={{ height: '100%' }} size={36} />
          </div>
          <input
            className="column column-70 search-bar"
            onKeyPress={this.handleKeyPress}
            onChange={this.handleUpdateSearch}
            value={this.state.searchBar}
            type="text"
            name="search"
            placeholder="Search by keywords, departments, interest, name, etc."
            aria-label="Search"
          />

          <div className="column column-10 delete-div">
            {this.state.searchBar !== ''
              ? (
                <DeleteIcon
                  onClick={this.clearSearch}
                  className="clear-icon"
                  size={30}
                />
              )
              : ''}
          </div>
        </div>

        <div className="opp-container row" id="noAlign">

          <div className="column column-20">
            <div className="filter-box">
              <div className="filter-child">
                <label>Filter Faculty By....</label>
              </div>
              <hr id="noHrMargin" />
              <div className="filter-child">
                <label>Research Area</label>
                <select onChange={this.handleChange} name="area" className="select-wrapper">
                  <option value="">All</option>
                  {this.generateAreaOptions()}
                </select>
              </div>
              <br />
            </div>
          </div>
          <div className="column column-80 opportunities-list-wrapper">
            <div className="row">
              <div className="column column-70">
                <div className="opp-list-container">
                  <span style={headerStyle}>Formal Research Opportunity Listings</span>
                  <OpportunityBox
                    filteredOptions={this.state.opportunitiesOptions}
                    url="opportunities"
                    searching={this.state.opportunitiesOptions.searching}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="column column-70">
                <div className="opp-list-container">
                  <span style={headerStyle}>Research Opportunities By Professor</span>
                  <FacultyBox filteredOptions={this.state} data={this.state.data} />
                </div>
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </div>

    );
  }
}

export default FacultySearch;
