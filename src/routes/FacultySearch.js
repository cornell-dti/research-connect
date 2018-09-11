import React, {Component} from 'react';
import axios from 'axios';
import '../index.css';
import Navbar from '../components/StudentNavbar'
import Footer from '../components/Footer';
import FacultyBox from '../components/FacultyBox';
import * as Utils from "../components/Shared/Utils";
import ProfNavbar from "../components/ProfNavbar";
import DeleteIcon from 'react-icons/lib/ti/delete';
import '../Opportunities.css';


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
            role: ''
        };
    this.handleChange = this.handleChange.bind(this);
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

    handleChange(event) {

            if (event.target.name === "area") {
                this.setState({area: event.target.value});
            } else if (event.target.name === "department") {
                this.setState({department: event.target.value});
            } 

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
            axios.get('/api/faculty/search' + '?search=' + this.state.searchBar)
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
                {this.state.role === "undergrad" ? <Navbar current={"facultysearch"}/> : <ProfNavbar/>}

                <div className="opp-container row">

                    <div className="column column-20">
                        <div className="filter-box">
                            <h4>Filters</h4>
                            <hr />
                            {/*<label >Area(s) of Interest</label>*/}
                            {/*<select onChange={this.handleChange} name="area">*/}
                                {/*<option value="">Select</option>*/}
                                {/*<option value="computer science">Computer Science</option>*/}
                                {/*<option value="machine learning">Machine Learning</option>*/}
                                {/*<option value="information science">Information Science</option>*/}
                                {/*<option value="business">Business</option>*/}
                                {/*<option value="test">Something Else</option>*/}
                            {/*</select>*/}
                            {/*<br/>*/}
                            {/*<br/>*/}
                            {/*<hr />*/}
                            <label >Department</label>
                            <select onChange={this.handleChange} name="department">
                                <option value="">Select</option>
                                <option value="Information Science">Information Science</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Electrical and Computer Engineering">Electrical and Computer Engineering</option>
                                <option value="Applied and Engineering Physics">Applied and Engineering Physics</option>
                                <option value="Operations Research and Information Engineering">Operations Research & Info Engineering</option>
                                <option value="Sibley School of Mechanical and Aerospace Engineering">Mechanical and Aerospace Engineering</option>
                                <option value="Smith School of Chemical and Biomolecular Engineering">Chemical and Biomolecular Engineering</option>
                                <option value="Biological and Environmental Engineering">Biological and Environmental Engineering</option>
                                <option value="Meinig School of Biomedical Engineering">Biomedical Engineering</option>
                                <option value="Civil and Environmental Engineering">Civil and Environmental Engineering</option>
                                <option value="Materials Science and Engineering">Material Science</option>
                                <option value="Earth and Atmospheric Sciences">Earth and Atmospheric Sciences</option>
                                <option value="College of Human Ecology">College of Human Ecology</option>
                                <option value="Earth and Atmospheric Sciences">Earth and Atmospheric Sciences</option>
                            </select>
                            <br/>
                            <br/>
                            {/*This currently doesn't work, will fix later... but it's v low priority*/}
                            {/*<hr />*/}
                            {/*<label >Show:</label>*/}
                            {/*<input type="checkbox" name="acceptOnline"/>*/}
                            {/*<span>Faculty Accepting on Research Connect</span>*/}
                            {/*<br/>*/}
                            {/*<input type="checkbox" name="acceptEmail" />*/}
                            {/*<span>Faculty Accepting by Email</span>*/}

                            <br/>

                           

                        </div>
                    </div>
                    <div className="column column-80">
                        
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
                                    <FacultyBox filteredOptions={this.state}
                                                    url='opportunities'/>
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
