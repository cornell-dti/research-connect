import React, { Component } from 'react';
import axios from 'axios';
import Faculty from '../Faculty';
import '../../Opportunity/OpportunityList/OpportunityList.scss';

class FacultyList extends Component {
  constructor(props) {
    super(props);
    this.state = { starredFac: [] };
  }

  getStarredFac() {
    axios.get(`/api/undergrads/star?type=faculty&token_id=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        const { data } = response;
        this.setState({ starredFac: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateStar(opId) {
    const token_id = sessionStorage.getItem('token_id');
    const type = 'faculty';
    const id = opId;
    axios.post('/api/undergrads/star', { token_id, type, id })
      .then((response) => {
        if (response && response.data) {
          const starredVals = response.data;
          this.setState({ starredFac: starredVals });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  countNodes(nodes) {
    let tempCount = 0;
    let countString = '';
    for (const k in nodes) {
      if (nodes[k] != null) {
        tempCount += 1;
      }
    }
    if (tempCount === 1) {
      countString = 'There is 1 result';
    } else {
      countString = `There are ${tempCount.toString()} results`;
    }
    return (countString);
  }


  componentDidMount() {
    this.getStarredFac();
  }

  render() {
    const headerStyle = {
      color: 'black',
      fontSize: '24px',
      fontWeight: 'bolder',
    };
    const profs = {
      yes: [], no: [], maybe: [], unknown: [],
    };
    // sort the faculty by researchStatus so that those with a research status show first
    this.props.data.sort((a, b) => (a.researchStatus.toLowerCase() > b.researchStatus.toLowerCase()) ? -1 : 1);

    this.props.data.forEach((prof) => {
      // const { filteredOptions } = this.props;
      // let departmentSelected = filteredOptions.department;
      // let areaSelected = filteredOptions.area;
      // let matchingSearches = filteredOptions.matchingSearches;
      profs[prof.accepting].push(
        <Faculty
          key={prof._id}
          ID={prof._id}
          filteredOptions={this.props.filteredOptions}
          name={prof.name}
          department={prof.department}
          lab={prof.lab}
          photoId={prof.photoId}
          bio={prof.bio}
          researchInterests={prof.researchInterests}
          researchDescription={prof.researchDescription}
          researchStatus={prof.researchStatus}
          starred={this.state.starredFac.includes(prof._id)}
          updateStar={this.updateStar.bind(this)}
        />,
      );
    });
    Object.keys(profs).forEach((status) => {
      if (profs[status].length === 0) {
        profs[status] = [<span></span>];
      }
    });
    const nodeCount = this.countNodes(profs);
    return (
      <div>
        <div className="node-list-div">
          {/* <p> */}
          {/*  {nodeCount} matching your search criteria. */}
          {/* </p> */}
          <p>Information last updated January 2020.</p>
        </div>
        <div style={headerStyle}>CS Professors Who May Consider Working With Undergrads This Semester</div>
        {profs.yes}
        {profs.maybe}
        {profs.unknown}
        <br />
        <div style={headerStyle}>CS Professors Not Working With Undergrads This Semester</div>
        {profs.no}
      </div>
    );
  }
}

export default FacultyList;
