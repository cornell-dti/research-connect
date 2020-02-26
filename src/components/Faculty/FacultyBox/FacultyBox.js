import React, { Component } from 'react';
import axios from 'axios';
import FacultyList from '../FacultyList/FacultyList';

class FacultyBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      profCount: 0,
    };
    this.loadFacultyFromServer = this.loadFacultyFromServer.bind(this);
  }

  countProfs(val) {
    this.setState({
      profCount: val,
    });
  }

  loadFacultyFromServer() {
    axios.get('/api/faculty?department=tech')
      .then((res) => {
        // sort the faculty by researchStatus so that those with a research status show first
        res.data.sort((a, b) => (a.researchStatus > b.researchStatus) ? 1 : -1);
        console.log("data here: ");
        console.log(res.data);
        this.setState({ data: res.data });
      });
  }

  componentDidMount() {
    console.log('component did mount');
    // this.loadFacultyFromServer();
  }

  render() {
    return (
      <FacultyList countProfs={this.countProfs.bind(this)} filteredOptions={this.props.filteredOptions} data={this.props.data} numShowing={this.props.numShowing} />
    );
  }
}

export default FacultyBox;
