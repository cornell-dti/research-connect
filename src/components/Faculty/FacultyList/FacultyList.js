import React, {Component} from 'react';
import Faculty from '../Faculty';
import '../../Opportunity/OpportunityList/OpportunityList.scss';
import axios from 'axios';

class FacultyList extends Component {
  constructor(props) {
    super(props);
    this.state = {starredFac : []};
  }

  getStarredFac(){
    axios.get(`/api/undergrads/star?type=faculty&token_id=${sessionStorage.getItem('token_id')}`)
    .then((response) => {
      let data = response.data;
      this.setState({starredFac: data});
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  updateStar(opId){
    let token_id = sessionStorage.getItem('token_id');
    let type = "faculty";
    let id = opId;
    axios.post('/api/undergrads/star', { token_id, type, id })
    .then((response) => {
      if (response && response.data) {
        let starredVals = response.data;
        this.setState({starredFac: starredVals})
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  countNodes(nodes) {
    let tempCount = 0;
    let countString = '';
    for (let k in nodes) {
      if (nodes[k] != null) {
        tempCount++;
      }
    }
    if (tempCount === 1) {
      countString = 'There is 1 result';
    } else {
      countString = 'There are ' + tempCount.toString() + ' results';
    }
    return (countString);
  }


  componentDidMount(){
    this.getStarredFac();
  }

  render() {
    const headerStyle = {
      color: "black",
      fontSize: "24px",
      fontWeight: "bolder",
    };
    let profs = {"yes": [], "no": [], "maybe": [], "unknown": []};
    this.props.data.forEach((prof) => {
      const filteredOptions = this.props.filteredOptions;
      // let departmentSelected = filteredOptions.department;
      // let areaSelected = filteredOptions.area;
      // let matchingSearches = filteredOptions.matchingSearches;
      profs[prof.accepting].push(
        <Faculty
          key={prof['_id']}
          ID={prof['_id']}
          filteredOptions={this.props.filteredOptions}
          name={prof['name']}
          department={prof['department']}
          lab={prof['lab']}
          photoId={prof['photoId']}
          bio={prof['bio']}
          researchInterests={prof['researchInterests']}
          researchDescription={prof['researchDescription']}
          starred={this.state.starredFac.includes(prof['_id'])}
          updateStar={this.updateStar.bind(this)}
        />)
    });
    Object.keys(profs).forEach((status) => {
      if (profs[status].length === 0){
        profs[status] = [<p>No professors matching this criteria.</p>]
      }
    });
    let nodeCount = this.countNodes(profs);
    return (
      <div>
        <div className="node-list-div">
          {/*<p>*/}
          {/*  {nodeCount} matching your search criteria.*/}
          {/*</p>*/}
          <p>Information last updated January 2020.</p>
        </div>
        <div style={headerStyle}>Professors Recruiting Undergrads This Semester</div>
        {profs["yes"]}
        <br />
        <div style={headerStyle}>Professors Maybe Recruiting Undergrads This Semester</div>
        {profs["maybe"]}
        <br />
        <div style={headerStyle}>Professors Not Recruiting Undergrads This Semester</div>
        {profs["no"]}
        <br />
        <div style={headerStyle}>Unknown Whether Professor Is Recruiting Undergrads This Semester</div>
        {profs["unknown"]}
      </div>
    );
  }
}

export default FacultyList;