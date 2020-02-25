import React, { Component } from 'react';
import axios from 'axios';
import OpportunityList from '../OpportunityList/OpportunityList';
import { getParameterByName } from '../../Utils';
import { Opportunity as OpportunityType } from '../../../types';

type Props = {
  url: string;
  filteredOptions: any;
  searching: boolean;
}
type State = { data: OpportunityType[] };

class OpportunityBox extends Component<Props, State> {
  state: State = { data: [] };

  componentDidMount() {
    const tokenId = sessionStorage.getItem('token_id');
    const netId = sessionStorage.getItem('netId');
    const labId = getParameterByName('labId', window.location.href);
    axios.get(`/api/${this.props.url}?netId=${tokenId}&netIdPlain=${netId}&labId=${labId}&date=DESC`)
      .then((res) => {
        this.setState({ data: res.data });
      });
  }

  render() {
    return (
      <OpportunityList
        filteredOptions={this.props.filteredOptions}
        data={this.state.data}
        searching={this.props.searching}
      />
    );
  }
}

export default OpportunityBox;
