import React, {Component} from 'react';
import axios from 'axios';
import './Opportunities.scss';
import '../../index.css';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar'
import Footer from '../../components/Footer/Footer';
import logo from '../../images/vectorlogo.png';
import OpportunityBox from '../../components/Opportunity/OpportunityBox/OpportunityBox';
import YearSelect from '../../components/YearSelect/YearSelect';
import MajorSelect from '../../components/MajorSelect/MajorSelect';
import GPASelect from '../../components/GPASelect/GPASelect';
import StartDate from '../../components/StartDate/StartDate';
import CompensationSelect from '../../components/CompensationSelect/CompensationSelect';
import DeleteIcon from 'react-icons/lib/ti/delete';
import SearchIcon from 'react-icons/lib/io/search';
import * as Utils from "../../components/Utils";
import ProfessorNavbar from "../../components/Navbars/ProfessorNavbar/ProfessorNavbar";

class Opportunities extends Component {

	constructor(props) {
		super(props);
		this.state = {
			yearSelect: {},
			gpaSelect: {},
			majorSelect: {},
			startDate: {},
			compensationSelect: {},
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

	handleUpdateYear(yearObj) {
		this.setState({yearSelect: yearObj});
	}

	handleUpdateGPA(gpaObj) {
		this.setState({gpaSelect: gpaObj});
	}

	handleUpdateMajor(majorObj) {
		this.setState({majorSelect: majorObj});
	}

	handleUpdateDate(dateObj) {
		this.setState({startDate: dateObj});
	}

	handleUpdateCompensation(compensationObj){
		this.setState({compensationSelect: compensationObj});
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
			<div className="opportunities-wrapper">
				{this.state.role === "undergrad" ? <Navbar current={"opportunities"}/> : <ProfessorNavbar current={"opportunities"}/>}

				<div className="row search-div-container">
					<div className="search-icon-div">
						<SearchIcon style={{ height: '100%' }} size={36} />
					</div>
					<input
						onFocus={this.onFocus.bind(this)}
						onBlur={this.onBlur.bind(this)}
						className="search-bar" onKeyPress={this.handleKeyPress.bind(this)}
						onChange={this.handleUpdateSearch.bind(this)} value={this.state.searchBar}
						type="text" name="search"
						placeholder="Search keywords (e.g. psychology, machine learning, Social Media Lab)" />
					<div className="delete-div">
						{
						this.state.searchBar != "" ?
							<DeleteIcon
								onClick={this.clearSearch.bind(this)}
								className="clear-icon"
								style={{ height: '100%' }}
								size={36} />
						: ""
						}
					</div>
				</div>

				<div className="opp-container row">
					<div className="column column-20">
						<div className="filter-box">
							<div className="filter-child">
								Filter by...
							</div>

							<hr />

							<div className="filter-child">
								<label htmlFor="yearField">School Year</label>
								<YearSelect updateYear={this.handleUpdateYear.bind(this)} />
							</div>

							<hr />

							<div className="filter-child">
								<label htmlFor="gpaField">GPA Requirement</label>
								<GPASelect updateGPA={this.handleUpdateGPA.bind(this)} />
							</div>

							<hr />

							<div className="filter-child">
								<label htmlFor="startDateField">Start Date</label>
								<StartDate updateDate={this.handleUpdateDate.bind(this)}/>
							</div>

							<hr />

							<div className="filter-child">
								<label htmlFor="compensationField">Compensation</label>
								<CompensationSelect updateCompensation={this.handleUpdateCompensation.bind(this)}/>
							</div>

						</div>
					</div>

					<div className="column opportunities-list-wrapper">
						<OpportunityBox
							filteredOptions={this.state}
							url='opportunities'
							searching={this.state.clickedEnter} />
					</div>
				</div>

				<Footer/>
			</div>

		);
	}
}

export default Opportunities;
