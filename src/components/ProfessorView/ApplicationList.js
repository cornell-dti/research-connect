import React, {Component} from 'react';
import axios from 'axios';
import '../../index.css';
import ApplicationBox from './ApplicationBox';

class ApplicationList extends Component {
	constructor(props) {
		super(props);
		this.state = { data: [] };
	}

	componentDidMount() {
		axios.post('http://localhost:3001/getApplications', {
			'id': '5a3c0f1df36d280c875969ed'
			//this is just syntax for getting the id from the url
			//the url is outsite.com/opportunity/:id, meaning :id can be any number. So this syntax gets us that id/number
		})
		.then((response) => {
			for (var opp in response.data) {
				for (var app in opp) {
					console.log(response.data[opp][app]);
				}
			}
			this.setState({data: response.data});
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	
	render() {
		var apps = []
    for (var opp in this.state.data) {
    	for (var app in opp) {
    		if (this.state.data[opp][app] != undefined) {
    			apps.push(<ApplicationBox data={ this.state.data[opp][app] } />);
    		}
    	}
    }
		return (
			<div>{ apps }</div>
		)
	}
}

export default ApplicationList
