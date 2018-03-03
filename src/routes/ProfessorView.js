import React, {Component} from 'react';
import '../App.css';
import '../ProfessorView.css';
import ApplicationList from '../components/ProfessorView/ApplicationList';
import YearSelect from '../components/YearSelect'
import MajorSelect from '../components/MajorSelect'
import GPASelect from '../components/GPASelect'
import StartDate from '../components/StartDate'

class ProfessorView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			yearSelect: {

			},
			gpaSelect: {

			},
			majorSelect: {

			},
			startDate: {

			}
		};
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
	handleUpdateDate(majorObj) {
		this.setState({startDate: majorObj});
	}

	render() {
		return (
			<div>
				<div className='header'></div>
				<div className='professor-view-container'>
					<div className='row'>
						<div className="column column-20">
							<div className="filter-box">

							<h3>Filters</h3>

							<hr />

							<label htmlFor="depField">Area of Interest</label>
							<MajorSelect updateMajor={this.handleUpdateMajor.bind(this)} />

							<hr />
							<label htmlFor="yearField">School Year</label>
							<YearSelect updateYear={this.handleUpdateYear.bind(this)} />

							<hr />
							<label htmlFor="gpaField">GPA Requirement</label>
							<GPASelect updateGPA= {this.handleUpdateGPA.bind(this)}/>
						</div>
						</div>
						<div className='column'>
							<div className='application-list-container'>
								<div className='application-list-header'>Viewing: Applications for All Labs</div>
								<ApplicationList filter={ this.state } />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfessorView;
