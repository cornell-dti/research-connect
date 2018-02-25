import React, {Component} from 'react';
import '../App.css';
import '../ProfessorView.css';
import ApplicationList from '../components/ProfessorView/ApplicationList';
import FilterBox from '../components/Shared/FilterBox';

class ProfessorView extends Component {
	constructor(props) {
		super(props);
			this.state = {
		};
	}

	render() {
		return (
			<div>
				<div className='header'></div>
				<div className='professor-view-container'>
					<div className='row'>
						<div className='filter-container column-20'>
							<FilterBox />
						</div>
						<div className='column'>
							<div className='application-list-container'>
								<h4 className='application-list-header'>Viewing: Applications for All Labs</h4>
								<ApplicationList />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfessorView;
