import React, {Component} from 'react';
import axios from 'axios';
// import '../ApplicationPage.css';

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
			<div className="">
				
			</div>
		);
	}
}

export default OpportunityPage;
