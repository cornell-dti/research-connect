import React, {Component} from 'react';
import '../App/App.scss';
import './ProfessorView.scss';
import axios from 'axios';
import Navbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';
import ApplicationList from '../../components/ApplicationList/ApplicationList';
import YearSelect from '../../components/YearSelect/YearSelect';
import Footer from '../../components/Footer/Footer';
import MajorSelect from '../../components/MajorSelect/MajorSelect';
import GPASelect from '../../components/GPASelect/GPASelect';
import StartDate from '../../components/StartDate/StartDate';
import CourseSelect from '../../components/CourseSelect/CourseSelect';
import SkillSelect from '../../components/SkillSelect/SkillSelect';
import OpportunitySelect from '../../components/OpportunitySelect/OpportunitySelect';
import * as Utils from "../../components/Utils";
import { css } from 'react-emotion';
import { ClipLoader } from 'react-spinners';

class ProfessorView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			yearSelect: {},
			gpaSelect: {},
			majorSelect: {},
			startDate: {},
			courses: [],
			skills: [],
			opportunity: 'All',
			opportunities: [],
			loading: true
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

	handleUpdateCourses(courseList) {
		this.setState({courses: courseList});
	}

	handleUpdateSkills(skillList) {
		this.setState({skills: skillList});
	}

	handleUpdateOpportunity(opp) {
		this.setState({opportunity: opp});
	}

	componentWillMount() {
    axios.all([
	    axios.get('/api/role/' +  sessionStorage.getItem('token_id')),
	    axios.get('/api/applications?id=' + sessionStorage.getItem('token_id'))
	  ])
	  .then(axios.spread((role, apps) => {
	  	if (role.data !== 'grad' &&
				  role.data !== 'labtech' &&
				  role.data !== 'postdoc' &&
				  role.data !== 'staffscientist' &&
				  role.data !== 'pi') {
      	window.location.href = "/";
      }
      let opps = Object.keys(apps.data);
      opps.unshift('All');
      this.setState({opportunities: opps});
	  }));
	}

	componentDidMount() {
		this.state.loading = false;
	}

	render() {
		const override = css`
	    display: block;
	    margin: 0 auto;
	    border-color: red;
		`;

		if (this.state.loading) {
			return (
				<div className='sweet-loading'>
	        <ClipLoader
	          className={override}
	          sizeUnit={"px"}
	          size={150}
	          color={'#ff0000'}
	          loading={this.state.loading} />
	      </div> 
			);
		}

		return (
			<div>

				<Navbar current="professorView"/>

				<div className='professor-view-container'>
					<div className='row'>
						<div className="column column-20">
							<div className="filter-box">
								<div className="filter-child">
									Filter by...
								</div>

								<hr />

								<div className="filter-child">
									<label htmlFor="opportunityField">Opportunity</label>
									<OpportunitySelect opportunities={this.state.opportunities} updateOpportunity={this.handleUpdateOpportunity.bind(this)} />
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
									<label htmlFor="courseField">Required Courses</label>
									<CourseSelect updateCourses={this.handleUpdateCourses.bind(this)} />
								</div>

								<hr />

								<div className="filter-child">
									<label htmlFor="skillField">Required Skills</label>
									<SkillSelect updateSkills={this.handleUpdateSkills.bind(this)} />
								</div>
							</div>
						</div>
						<div className='column'>
							<div className='application-list-container'>
								<div className='application-list-header'>Applications For Your Lab</div>
								<ApplicationList filter={ this.state } />
							</div>
						</div>
					</div>
				</div>

				<Footer/>
			</div>
		);
	}
}

export default ProfessorView;
