import React, { Component } from 'react';
import Opportunity from '../Opportunity';
import './OpportunityList.scss';
import axios from 'axios';
import * as Utils from '../../Utils';

class OpportunityList extends Component {
  constructor(props) {
    super(props);
    this.state = {starredOps : []};
    this.setUserRole();
    Utils.updateMultipleChoiceFilter.bind(this);
  }

  getStarredOps(){
    console.log("SENDING API REQUEST TO GET ALL STARRED OPS");
    axios.get(`/api/undergrads/star?type=opportunity&token_id=${sessionStorage.getItem('token_id')}`)
    .then((response) => {
      let data = response.data;
      this.setState({starredOps: data});
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  updateStar(opId){
    let token_id = sessionStorage.getItem('token_id');
    let type = "opportunity";
    let id = opId;
    axios.post('/api/undergrads/star', { token_id, type, id })
    .then((response) => {
      if (response && response.data) {
        let starredVals = response.data;
        this.setState({starredOps: starredVals})
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  countNodes(nodes) {
    const tempCount = nodes.filter(node => !(!node)).length;
      return tempCount === 1 ? 'There is 1 result' : tempCount === 0 ? 
      'There are no results' : `There are ${tempCount} results`;
  }

  union(arr1, arr2) {
    return arr1.filter(i => arr2.indexOf(i) > -1);
  }

  checkboxFilter(filterSelected, filterAllowed) {
    return (filterSelected.length === 0 || this.union(filterSelected, filterAllowed).length !== 0);
  }

  async setUserRole(){
    this.setState({role: await Utils.getUserRole()})
  }

  componentDidMount(){
    console.log("component mounted");
    this.getStarredOps();

  }

  render() {
    if (!this.props.data) return null;

    const oppNodes = this.props.data.map((opp) => {
      let opportunityWillShow = true; // set to false if any filter excludes this opportunity
      const filteredOptions = this.props.filteredOptions;

      const matchingSearches = filteredOptions.matchingSearches;
      if (filteredOptions.searchBar !== '' && filteredOptions.clickedEnter) {
        let matches = false;
        for (let i = 0; i < matchingSearches.length; i++) {
          if (matchingSearches[i] === opp._id) {
            matches = true;
          }
        }
        opportunityWillShow = matches;
      }

      const minGPA = filteredOptions.gpaSelect;
      opportunityWillShow = opportunityWillShow && (!opp.minGPA || minGPA < opp.minGPA);

      let startDate = filteredOptions.startDate;
      let oppStartDate = opp.startSeason + " " + opp.startYear;
      opportunityWillShow = opportunityWillShow && (startDate === "" || oppStartDate === " " || startDate === oppStartDate);

      // multiple/checkbox choices
      const yearsSelected = filteredOptions.yearSelect;
      const yearsAllowed = opp.yearsAllowed;
      opportunityWillShow = opportunityWillShow && this.checkboxFilter(yearsSelected, yearsAllowed);

      const csAreasSelected = filteredOptions.csAreasSelect;
      const csAreasAllowed = opp.areas;
      opportunityWillShow = opportunityWillShow && this.checkboxFilter(csAreasSelected, csAreasAllowed);

      const compensationsSelected = filteredOptions.compensationSelect;
      const compensationsAllowed = opp.compensation;
      opportunityWillShow = opportunityWillShow && this.checkboxFilter(compensationsSelected, compensationsAllowed);
      // end multiple/checkbox choices

      if (opportunityWillShow) {
        let starred = this.state.starredOps.includes(opp._id);
        return (
          <Opportunity
            filteredOptions={this.props.filteredOptions}
            key={opp._id}
            title={opp.title}
            area={opp.areas}
            labId={opp.labId}
            labName={opp.labName}
            pi={opp.pi}
            supervisor={opp.supervisor}
            projectDescription={opp.projectDescription}
            undergradTasks={opp.undergradTasks}
            opens={opp.opens}
            closes={opp.closes}
            startSeason={opp.startSeason}
            startYear={opp.startYear}
            minSemesters={opp.minSemesters}
            minHours={opp.minHours}
            maxHours={opp.maxHours}
            qualifications={opp.qualifications}
            minGPA={opp.minGPA}
            requiredClasses={opp.requiredClasses}
            questions={opp.questions}
            additionalInformation={opp.additionalInformation}
            yearsAllowed={opp.yearsAllowed}
            prereqsMatch={opp.prereqsMatch}
            spots={opp.spots}
            opId={opp._id}
            starred={starred}
            updateStar={this.updateStar.bind(this)}
            role={this.state.role}
          />
        );
      }
    });

    const nodeCount = this.countNodes(oppNodes);
    const searchCrit = this.props.searching ? (
      <p>
        {nodeCount} {' '} matching your search criteria.
      </p>
    ) :  <p>
    {nodeCount} {' '} 
  </p>;

    console.log("rendered again");
    console.log(this.state.starredOps);
    return (
      <div>
        <div className="node-list-div">
          { searchCrit }

        </div>
        { oppNodes }
      </div>
    );
  }
}

export default OpportunityList;
