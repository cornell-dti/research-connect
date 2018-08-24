import React, { Component } from 'react';
import axios from 'axios';
import FacultyList from './FacultyList';
import {getParameterByName} from "./Shared/Utils";

class FacultyBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			profCount: 0
		};
		this.loadFacultyFromServer = this.loadFacultyFromServer.bind(this);

	}
	countProfs(val){
    this.setState({
      profCount: val
    })
		
  }

	loadFacultyFromServer() {
		axios.get('localhost:3001/api/faculty')
			// + '?netId=' + sessionStorage.getItem('token_id') + '&netIdPlain=' + sessionStorage.getItem('netId') + "&labId=" + getParameterByName("labId", window.location.href))
			.then(res => {
				this.setState({ data: res.data });
				console.log(res.data);
			})
	}

	componentDidMount() {
		this.loadFacultyFromServer();
		// setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	}

	render() {
		return (
			<FacultyList countProfs={this.countProfs.bind(this)} filteredOptions ={this.props.filteredOptions } data={ this.state.data } />
		)
	}
}

export default FacultyBox;
