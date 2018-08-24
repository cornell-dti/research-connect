import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';
import Navbar from '../components/StudentNavbar'
import Footer from '../components/Footer';
import FacultyBox from '../components/FacultyBox';
import * as Utils from "../components/Shared/Utils";
import ProfNavbar from "../components/ProfNavbar";
import '../Opportunities.css';


class FacultySearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchBar: '',
            matchingSearches: [],
            searching: false,
            clickedEnter: false,
            role: ''
        };
    }

    componentDidMount() {
        axios.get('/api/role/' + sessionStorage.getItem('token_id'))
            .then((response) => {
                if (!response || response.data === "none" || !response.data) {
                    alert("You must be signed in to view this.");
                    window.location.href = '/';
                }
                else{
                    this.setState({role: response.data});
                }
            })
            .catch(function (error) {
                Utils.handleTokenError(error);
            });
    }
    handleUpdateSearch(e) {
        this.setState({searchBar: e.target.value});
        if (e.target.value == "") {
            this.setState({matchingSearches: []});
            this.setState({clickedEnter: false});
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.setState({clickedEnter: true});
            axios.get('/api/opportunities/search' + '?search=' + this.state.searchBar)
                .then((response) => {
                    let matching = [];
                    for (let i = 0; i < response.data.length; i++) {
                        matching.push(response.data[i]._id);
                    }
                    this.setState({matchingSearches: matching});
                })
                .catch(function (error) {
                    Utils.handleTokenError(error);
                });
        }
    }

    onFocus() {
        this.setState({searching: true});
    }

    onBlur() {
        this.setState({searching: false})
    }

    clearSearch() {
        this.setState({searching: false});
        this.setState({searchBar: ""});
        this.setState({matchingSearches: []});
        this.setState({clickedEnter: false});
    }


    render() {
        return (
            <div>
                {this.state.role === "undergrad" ? <Navbar current={"opportunities"}/> : <ProfNavbar/>}

                <div className="opp-container row">

                    <div className="column column-20">
                        <div className="filter-box">
                            <h4>Filters</h4>
                            <hr />
                            <label >Area(s) of Interest</label>
                            <input />
                            <br/>
                            <hr />
                            <label >Department</label>
                            <input/>
                            <br/>
                            <hr />
                            <label >Show:</label>
                            <input type="checkbox" name="acceptOnline"/>
                            <span>Faculty Accepting on Research Connect</span>
                            <br/>
                            <input type="checkbox" name="acceptEmail" />
                            <span>Faculty Accepting by Email</span>

                            <br/>

                           

                        </div>
                    </div>
                    <div className="column column-80">
                        <FacultyBox/>
                        <div className="row search-div-container">

                            <input onFocus={this.onFocus.bind(this)} onBlur={this.onBlur.bind(this)}
                                   className="column column-70 search-bar" onKeyPress={this.handleKeyPress.bind(this)}
                                   onChange={this.handleUpdateSearch.bind(this)} value={this.state.searchBar}
                                   type="text" name="search"
                                   placeholder="Search by keywords, departments, interest, name, etc."/>

                            <div className="column column-10 delete-div">
                                {this.state.searchBar != "" ?
                                    <DeleteIcon onClick={this.clearSearch.bind(this)} className="clear-icon" size={30}/>
                                    : ""}
                            </div>
                        </div>
                        <div className="row">
                            <div className="column column-70">
                                <div className="opp-list-container">
                                    
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
