import React, { Component } from 'react';
import axios from 'axios';
import Faculty from '../Faculty';
import '../../Opportunity/OpportunityList/OpportunityList.scss';
import { Professor } from '../../../types';

type Props = { data: Professor[]; filteredOptions: any; };
type State = { starredFac: string[] };

class FacultyList extends Component<Props, State> {
  state: State = { starredFac: [] };

  getStarredFac() {
    axios.get(`/api/undergrads/star?type=faculty&token_id=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        const { data } = response;
        this.setState({ starredFac: data });
      }).catch((error) => console.log(error));
  }

  updateStar = (opId: string) => {
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
    } as const;
    const profs: { [key: string]: JSX.Element[] } = {
      yes: [], no: [], maybe: [], unknown: [],
    };
    // sort the faculty by researchStatus so that those with a research status show first
    this.props.data.sort((a, b) => (a.researchStatus.toLowerCase() > b.researchStatus.toLowerCase()) ? -1 : 1);

    this.props.data.forEach((prof) => {
      profs[prof.accepting].push(
        <Faculty
          key={prof._id}
          ID={prof._id}
          name={prof.name}
          department={prof.department}
          lab={prof.lab}
          photoId={prof.photoId}
          bio={prof.bio}
          researchDescription={prof.researchDescription}
          researchStatus={prof.researchStatus}
          starred={this.state.starredFac.includes(prof._id)}
          updateStar={this.updateStar}
        />,
      );
    });
    Object.keys(profs).forEach((status) => {
      if (profs[status].length === 0) {
        profs[status] = [<span></span>];
      }
    });
    return (
      <div>
        <div className="node-list-div">
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
