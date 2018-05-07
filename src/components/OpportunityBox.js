import React, { Component } from 'react';
import axios from 'axios';
import OpportunityList from './OpportunityList';

class OpportunityBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			oppCount: 0
		};
		this.loadOpportunitiesFromServer = this.loadOpportunitiesFromServer.bind(this);

	}
	countOpps(val){
    this.setState({
      oppCount: val
    })
		console.log(val);
  }

	loadOpportunitiesFromServer() {
		axios.get('/api/' + this.props.url + '?netId=' + sessionStorage.getItem('token_id') + '&netIdPlain=' + sessionStorage.getItem('netId'))
			.then(res => {
				this.setState({ data: res.data });
			})
	}

	componentDidMount() {
		this.loadOpportunitiesFromServer();
		// setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	}

	render() {
		return (
			<OpportunityList countOpps={this.countOpps.bind(this)} filteredOptions ={this.props.filteredOptions } data={ this.state.data } />
		)
	}
}

export default OpportunityBox;
