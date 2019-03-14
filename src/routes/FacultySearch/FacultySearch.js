import React, {Component} from 'react';
import axios from 'axios';
import '../../index.css';
import DeleteIcon from 'react-icons/lib/ti/delete';
import SearchIcon from 'react-icons/lib/io/search';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import Footer from '../../components/Footer/Footer';
import FacultyBox from '../../components/Faculty/FacultyBox/FacultyBox';
import * as Utils from '../../components/Utils';
import ProfessorNavbar
  from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';
import ReactPaginate from 'react-paginate';
import '../Opportunities/Opportunities.scss';
import './FacultySearch.scss';
import VariableNavbar from '../../components/Navbars/VariableNavbar';

class FacultySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: '',
      area: '',
      searchBar: '',
      matchingSearches: [],
      searching: false,
      clickedEnter: false,
      role: '',
      numShowing: 20,
      data: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.getFaculty = this.getFaculty.bind(this);
    this.generateAreaOptions = this.generateAreaOptions.bind(this);
  }

  getFaculty(){
    let searchText = this.state.clickedEnter ? this.state.searchBar : "";
    axios.get("/api/faculty", {
      params: {
        department: "tech",
        limit: this.state.numShowing,
        area: this.state.area,
        search: searchText
      }
    })
    .then((res) => {
      this.setState({ data: res.data });
    });
  }

  componentDidMount() {
    // if they're not signed in...
    if (!sessionStorage.getItem('token_id')) {
      this.setState({role: null});
    } else {
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`).
          then((response) => {
            if (!response || response.data === 'none' || !response.data) {
              this.setState({role: null});
              // alert('You must be signed in to view this.');
              // window.location.href = '/';
            } else {
              this.setState({role: response.data});
            }
          }).
          catch((error) => {
            console.log("error here");
            console.log(error);
            Utils.handleTokenError(error);
          });
    }
    this.getFaculty();
  }

  handleChange(event) {
    if (event.target.name === 'area') {
      this.setState({area: event.target.value, numShowing: 20}, () => {
        this.getFaculty();
      });
    } else if (event.target.name === 'department') {
      this.setState({department: event.target.value, numShowing: 20}, () => {
        this.getFaculty();
      });
      // const currentShowing = this.state.numShowing;
      // this.setState({numShowing: currentShowing});
    }
  }

  handleUpdateSearch(e) {
    this.setState({searchBar: e.target.value});
    if (!e.target.value) {
      this.setState({matchingSearches: []});
      this.setState({clickedEnter: false}, () => {
        this.getFaculty();
      });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.setState({clickedEnter: true}, () => {
        this.getFaculty();
      });
      /** DEPRECATED SEARCH METHOD
      axios.get(`/api/faculty/search?search='${this.state.searchBar}`).
          then((response) => {
            const matching = response.data.map(d => d._id);
            this.setState({matchingSearches: matching});
          }).
          catch((error) => {
            Utils.handleTokenError(error);
          });
       */
    }
  }

  handlePageClick = data => {
    const totalShowing = this.state.numShowing + 20;
    this.setState({numShowing: totalShowing}, () => {
      this.getFaculty();
    });
  };

  onFocus() {
    this.setState({searching: true});
  }

  onBlur() {
    this.setState({searching: false});
  }

  clearSearch() {
    this.setState({searching: false});
    this.setState({searchBar: ''});
    this.setState({matchingSearches: []});
    this.setState({clickedEnter: false}, () => {
      this.getFaculty();
    });
  }

  generateAreaOptions(){
    const areas = Utils.getResearchInterestsList();
    if (areas.length === 0){
      return;
    }
    let areasOptions = [];
    areas.forEach((area) => {
      areasOptions.push(<option value={area} key={area}>{area}</option>)
    });
    return areasOptions;
  }

  render() {
    return (
        <div className="opportunities-wrapper">
          <VariableNavbar role={this.state.role} current={'facultysearch'} />

          <div className="row search-div-container">
            <div className="search-icon-div">
              <SearchIcon style={{ height: '100%' }} size={36} />
            </div>
            <input
                onFocus={this.onFocus.bind(this)}
                onBlur={this.onBlur.bind(this)}
                className="column column-70 search-bar"
                onKeyPress={this.handleKeyPress.bind(this)}
                onChange={this.handleUpdateSearch.bind(this)}
                value={this.state.searchBar}
                type="text"
                name="search"
                placeholder="Search by keywords, departments, interest, name, etc."
            />

            <div className="column column-10 delete-div">
              {this.state.searchBar != ''
                  ?
                  <DeleteIcon onClick={this.clearSearch.bind(this)}
                              className="clear-icon" size={30}/>
                  :
                  ''}
            </div>
          </div>

          <div className="opp-container row" id="noAlign">

            <div className="column column-20">
              <div className="filter-box">
                <div className='filter-child'>
                  <label>Filter by....</label>
                </div>
                {/*<h4>Filters</h4>*/}
                <hr id="noHrMargin"/>
                <div className='filter-child'>
                  <label>Research Area.</label>
                <select onChange={this.handleChange} name="area" className="select-wrapper">
                  <option value="">All</option>
                  {this.generateAreaOptions()}
                  {/*<option value="Information Science">Information Science*/}
                  {/*</option>*/}
                  {/*<option value="Computer Science">Computer Science</option>*/}
                  {/*<option value="Electrical and Computer Engineering">Electrical*/}
                    {/*and Computer Engineering*/}
                  {/*</option>*/}
                  {/*<option value="Applied and Engineering Physics">Applied and*/}
                    {/*Engineering Physics*/}
                  {/*</option>*/}
                  {/*<option*/}
                      {/*value="Operations Research and Information Engineering">Operations*/}
                    {/*Research & Info Engineering*/}
                  {/*</option>*/}
                  {/*<option*/}
                      {/*value="Sibley School of Mechanical and Aerospace Engineering">Mechanical*/}
                    {/*and Aerospace Engineering*/}
                  {/*</option>*/}
                  {/*<option*/}
                      {/*value="Smith School of Chemical and Biomolecular Engineering">Chemical*/}
                    {/*and Biomolecular Engineering*/}
                  {/*</option>*/}
                  {/*<option*/}
                      {/*value="Biological and Environmental Engineering">Biological*/}
                    {/*and Environmental Engineering*/}
                  {/*</option>*/}
                  {/*<option*/}
                      {/*value="Meinig School of Biomedical Engineering">Biomedical*/}
                    {/*Engineering*/}
                  {/*</option>*/}
                  {/*<option value="Civil and Environmental Engineering">Civil and*/}
                    {/*Environmental Engineering*/}
                  {/*</option>*/}
                  {/*<option value="Materials Science and Engineering">Material*/}
                    {/*Science*/}
                  {/*</option>*/}
                  {/*<option value="Earth and Atmospheric Sciences">Earth and*/}
                    {/*Atmospheric Sciences*/}
                  {/*</option>*/}
                  {/*<option value="College of Human Ecology">College of Human*/}
                    {/*Ecology*/}
                  {/*</option>*/}
                  {/*<option value="Earth and Atmospheric Sciences">Earth and*/}
                    {/*Atmospheric Sciences*/}
                  {/*</option>*/}
                </select>
              </div>
                {/* This currently doesn't work, will fix later... but it's v low priority */}
                {/* <hr /> */}
                {/* <label >Show:</label> */}
                {/* <input type="checkbox" name="acceptOnline"/> */}
                {/* <span>Faculty Accepting on Research Connect</span> */}
                {/* <br/> */}
                {/* <input type="checkbox" name="acceptEmail" /> */}
                {/* <span>Faculty Accepting by Email</span> */}

                <br/>


              </div>
            </div>
            <div className="column column-80 opportunities-list-wrapper">
              <div className="row">
                <div className="column column-70">
                  <div className="opp-list-container">
                    <FacultyBox
                        filteredOptions={this.state}
                        url="opportunities"
                        numShowing = {this.state.numShowing}
                        data = {this.state.data}
                    />
                    <div className="centered">
                      <input
                          type="submit"
                          className="button"
                          value="Load More"
                          onClick={this.handlePageClick.bind(this)}
                      />
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

export default FacultySearch;
