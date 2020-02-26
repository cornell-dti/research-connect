import React, { Component } from 'react';
import axios from 'axios';
import Opportunity from '../Opportunity';
import './OpportunityList.scss';
import { Opportunity as OpportunityType } from '../../../types';
import * as Utils from '../../Utils';

type Props = {
  data: OpportunityType[];
  filteredOptions: any;
  searching: boolean;
};
type State = { starredOps: {}[]; role?: string };

class OpportunityList extends Component<Props, State> {
  constructor(props: Props) {
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
      });
  }

  updateStar = (opId: string) => {
    const token_id = sessionStorage.getItem('token_id');
    const type = 'opportunity';
    const id = opId;
    axios.post('/api/undergrads/star', { token_id, type, id })
      .then((response) => {
        if (response && response.data) {
          const starredVals = response.data;
          this.setState({ starredOps: starredVals });
        }
      });
  };

  countNodes(nodes: any[]) {
    const tempCount = nodes.filter((node) => !(!node)).length;
    if (tempCount === 0) {
      return 'There are no results';
    }
    if (tempCount === 1) {
      return 'There is 1 result';
    }
    return `There are ${tempCount} results`;
  }

  union(arr1: string[], arr2: string[]) {
    return arr1.filter((i) => arr2.indexOf(i) > -1);
  }

  checkboxFilter(filterSelected: string[], filterAllowed: string[]): boolean {
    return (filterSelected.length === 0 || this.union(filterSelected, filterAllowed).length !== 0);
  }

  async setUserRole() {
    // @ts-ignore
    this.setState({ role: await Utils.getUserRole() });
  }

  componentDidMount() {
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
      opportunityWillShow = opportunityWillShow
        && (startDate === '' || oppStartDate === ' ' || startDate === oppStartDate);

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
            key={opp._id}
            title={opp.title}
            projectDescription={opp.projectDescription}
            undergradTasks={opp.undergradTasks}
            opens={opp.opens}
            closes={opp.closes}
            startSeason={opp.startSeason}
            startYear={opp.startYear}
            prereqsMatch={opp.prereqsMatch}
            opId={opp._id}
            starred={starred}
            updateStar={this.updateStar}
            role={this.state.role}
          />
        );
      }
      return null;
    });

    return (
      <div>
        { oppNodes }
      </div>
    );
  }
}

export default OpportunityList;
