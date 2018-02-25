import React, {Component} from 'react';
import YearSelect from '../../components/YearSelect'
import MajorSelect from '../../components/MajorSelect'
import GPASelect from '../../components/GPASelect'
import '../../index.css';

class FilterBox extends Component {
	constructor(props) {
		super(props);
		this.state = {};
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

	render() {
		console.log(this.props.data);
		return (
			<div className="filter-box">
				<div className="">
					<h2>Filters</h2>

					<hr />

					<h3>Major</h3>

					<MajorSelect updateMajor={this.handleUpdateMajor.bind(this)} />

					<h3>School Year</h3>

					<YearSelect updateYear={this.handleUpdateYear.bind(this)} />


					<h3>Minimum GPA</h3>

					<GPASelect updateGPA={this.handleUpdateGPA.bind(this)}/>
				</div>
			</div>

		)
	}
}

export default FilterBox;
