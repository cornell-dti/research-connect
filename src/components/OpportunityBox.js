import React, { Component } from 'react';
import axios from 'axios';
import OpportunityList from './OpportunityList';

class OpportunityBox extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadOpportunitiesFromServer = this.loadOpportunitiesFromServer.bind(this);
  }

  loadOpportunitiesFromServer() {
    console.log("began");
    axios.post(this.props.url, {undergradNetId: "ac123"})
      .then(res => {
        console.log("RESULT IS", res.data);
        this.setState({ data: res.data });
      })
  }

  componentDidMount() {
    this.loadOpportunitiesFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

  render() {
    return (
      <OpportunityList filteredOptions ={this.props.filteredOptions } data={ this.state.data } />
    )
  }
}

export default OpportunityBox;
