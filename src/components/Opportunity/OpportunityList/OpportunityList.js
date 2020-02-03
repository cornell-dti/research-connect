import React, { Component } from 'react';
import axios from 'axios';
import Opportunity from '../Opportunity';
import './OpportunityList.scss';
import * as Utils from '../../Utils';

class OpportunityList extends Component {
  constructor(props) {
    super(props);
    this.state = { starredOps: [] };
    this.setUserRole();
    Utils.updateMultipleChoiceFilter.bind(this);
  }

  getStarredOps() {
    axios.get(`/api/undergrads/star?type=opportunity&token_id=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        const { data } = response;
        this.setState({ starredOps: data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateStar(opId) {
    const token_id = sessionStorage.getItem('token_id');
    const type = 'opportunity';
    const id = opId;
    axios.post('/api/undergrads/star', { token_id, type, id })
      .then((response) => {
        if (response && response.data) {
          const starredVals = response.data;
          this.setState({ starredOps: starredVals });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  countNodes(nodes) {
    const tempCount = nodes.filter((node) => !(!node)).length;
    return tempCount === 1 ? 'There is 1 result' : tempCount === 0
      ? 'There are no results' : `There are ${tempCount} results`;
  }

  union(arr1, arr2) {
    return arr1.filter((i) => arr2.indexOf(i) > -1);
  }

  checkboxFilter(filterSelected, filterAllowed) {
    return (filterSelected.length === 0 || this.union(filterSelected, filterAllowed).length !== 0);
  }

  async setUserRole() {
    this.setState({ role: await Utils.getUserRole() });
  }

  componentDidMount() {
    console.log('component mounted');
    this.getStarredOps();
  }

  render() {
    if (!this.props.data) return null;

    const oppNodes = this.props.data.map((opp) => {
      let opportunityWillShow = true; // set to false if any filter excludes this opportunity
      const { filteredOptions } = this.props;

      const { matchingSearches } = filteredOptions;
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

      const { startDate } = filteredOptions;
      const oppStartDate = `${opp.startSeason} ${opp.startYear}`;
      opportunityWillShow = opportunityWillShow && (startDate === '' || oppStartDate === ' ' || startDate === oppStartDate);

      // multiple/checkbox choices
      const yearsSelected = filteredOptions.yearSelect;
      const { yearsAllowed } = opp;
      opportunityWillShow = opportunityWillShow && this.checkboxFilter(yearsSelected, yearsAllowed);

      const csAreasSelected = filteredOptions.csAreasSelect;
      const csAreasAllowed = opp.areas;
      opportunityWillShow = opportunityWillShow && this.checkboxFilter(csAreasSelected, csAreasAllowed);

      const compensationsSelected = filteredOptions.compensationSelect;
      const compensationsAllowed = opp.compensation;
      opportunityWillShow = opportunityWillShow && this.checkboxFilter(compensationsSelected, compensationsAllowed);
      // end multiple/checkbox choices

      if (opportunityWillShow) {
        const starred = this.state.starredOps.includes(opp._id);
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
            datePosted={opp.datePosted}
            updateStar={this.updateStar.bind(this)}
            role={this.state.role}
          />
        );
      }
      return null;
    });

    const nodeCount = this.countNodes(oppNodes);
    const searchCrit = this.props.searching ? (
      <p>
        {nodeCount}
        {' '}
        {' '}
        {' '}
        matching your search criteria.
      </p>
    ) : (
      <p>
        {nodeCount}
        {' '}
        {' '}
      </p>
    );

    return (
      <div>
        {/* <div className="node-list-div"> */}
        {/*  { searchCrit } */}

        {/* </div> */}
        { oppNodes }
      </div>
    );
  }
}

export default OpportunityList;
