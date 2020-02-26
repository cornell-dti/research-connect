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
      }).catch((error) => console.log(error));
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
      }).catch((error) => console.log(error));
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
    this.props.data.forEach((prof) => {
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
          starred={this.state.starredFac.includes(prof._id)}
          updateStar={this.updateStar.bind(this)}
        />,
      );
    });
    Object.keys(profs).forEach((status) => {
      if (profs[status].length === 0) {
        profs[status] = [<p>No professors matching this criteria.</p>];
      }
    });
    return (
      <div>
        <div className="node-list-div">
          <p>Information last updated January 2020.</p>
        </div>
        <div style={headerStyle}>Professors Recruiting Undergrads This Semester</div>
        {profs.yes}
        <br />
        <div style={headerStyle}>Professors Maybe Recruiting Undergrads This Semester</div>
        {profs.maybe}
        <br />
        <div style={headerStyle}>Professors Not Recruiting Undergrads This Semester</div>
        {profs.no}
        <br />
        <div style={headerStyle}>Unknown Whether Professor Is Recruiting Undergrads This Semester</div>
        {profs.unknown}
      </div>
    );
  }
}

export default FacultyList;
