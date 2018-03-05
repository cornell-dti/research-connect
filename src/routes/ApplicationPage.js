import React, {Component} from 'react';
import axios from 'axios';
// import '../ApplicationPage.css';
import * as Utils from '../components/Shared/Utils.js'

class OpportunityPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			application: []
		};
	}

	componentWillMount() {
		axios.post('/getApplications', {
			'id': '5a3c0f1df36d280c875969ed'
		})
		.then((response) => {
			for (var opp in response.data) {
				for (var app in opp) {
					var curApp = response.data[opp][app];
					if (curApp !== undefined) {
						curApp.opportunity = opp;
						if (curApp.id === this.props.match.params.id) {
							this.setState({ application: curApp });
						}
					}
				}
			}

			console.log(this.state.application);
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	render() {
		return (
			<div className="applicaton-page-container">
				<div className="header"></div>

				<div className="row">
					<div className="column column-75">
							<div className="row">
								<div className="column column-75">
									<div className="name">{ this.state.application.firstName }, { this.state.application.lastName }</div>
									<div className="email">{ this.state.application.undergradNetId }@cornell.edu</div>
									<div className="grad-year">{ Utils.gradYearToString(this.state.application.gradYear) }, { this.state.application.major }</div>
								</div>

								<div className="column">
									<div className="status">Status: { this.state.application.status }</div>
									<div className="date-applied">Date Applied: { Utils.convertDate(this.state.application.timeSubmitted) }</div>
									<div className="opportunity">Opportunity: { this.state.application.opportunity }</div>
								</div>
							</div>

							<div className="row">
								<div className="column">
								</div>
							</div>
					</div>
				</div>
				
			</div>
		);
	}
}

export default OpportunityPage;
