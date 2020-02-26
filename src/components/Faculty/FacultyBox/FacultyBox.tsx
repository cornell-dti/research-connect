import React, { Component } from 'react';
import axios from 'axios';
import FacultyList from '../FacultyList/FacultyList';
import { Professor } from '../../../types';

type Props = { data: Professor[]; filteredOptions: any; };

class FacultyBox extends Component<Props> {
  componentDidMount() {
    axios.get('/api/faculty?department=tech')
      .then((res) => {
        // sort the faculty by researchStatus so that those with a research status show first
        const data = res.data as Professor[];
        data.sort((a, b) => (a.researchStatus > b.researchStatus ? 1 : -1));
        this.setState({ data });
      });
  }

  render() {
    return <FacultyList filteredOptions={this.props.filteredOptions} data={this.props.data} />;
  }
}

export default FacultyBox;
