import React, {Component} from 'react';
import '../App.css';
import '../Opportunities.css';
import OpportunityBox from '../components/OpportunityBox';
import YearSelect from '../components/YearSelect'
import MajorSelect from '../components/MajorSelect'
import GPASelect from '../components/GPASelect'

class Opportunities extends Component {

	constructor(props) {
		super(props);
		this.state = {
			yearSelect: {

			},
			gpaSelect: {

			},
			majorSelect: {

			}
		};
	}

	//will be called by the year component whenever the year checkboxes are updated
	handleUpdateYear(yearObj) {
		this.setState({yearSelect: yearObj});
	}
	handleUpdateGPA(gpaObj) {
		this.setState({gpaSelect: gpaObj});
	}

	handleUpdateMajor(majorObj) {
		this.setState({majorSelect: majorObj});
	}


	render() {
		return (
			<div>

				<div className="header"></div>

				<div className="opp-container">

					<div className="row">
						<div className="column column-100 search-div-container">
							<div className="search-div">
								<input type="text" name="search" placeholder="Search keywords (e.g. psychology, machine learning, Social Media Lab)"/>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="column-20">
							<div className="filter-box">
								<h2>Filters</h2>
								<hr />
								<h3>Department</h3>
								<MajorSelect updateMajor={this.handleUpdateMajor.bind(this)} />
								<h3>School Year</h3>
								<YearSelect updateYear={this.handleUpdateYear.bind(this)} />
								<h3>Minimum GPA</h3>
								<GPASelect updateGPA= {this.handleUpdateGPA.bind(this)}/>
							</div>
						</div>

						<div className="column">
							<div className="opp-list-container">
								<OpportunityBox filteredOptions = {this.state}
								url='http://localhost:3001/getOpportunitiesListing' />
							</div>
						</div>
					</div>

				</div>

			</div>

		);
	}
}

export default Opportunities;
