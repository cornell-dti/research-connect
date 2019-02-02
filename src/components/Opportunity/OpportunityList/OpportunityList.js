import React, { Component } from 'react';
import Opportunity from '../Opportunity';
import './OpportunityList.scss';

class OpportunityList extends Component {
  constructor(props) {
    super(props);
  }

  countNodes(nodes) {
    const tempCount = nodes.filter(node => !(!node)).length;
    return tempCount === 1 ? 'There is 1 result' : `There are ${tempCount} results`;
  }

  union(arr1, arr2){
    let arr3 = arr1.filter(i => arr2.indexOf(i) > -1);
    console.log(arr3.length);
    return arr3;
  }

  checkboxFilter(filterSelected, filterAllowed){
    return (filterSelected.length === 0 || this.union(filterSelected, filterAllowed).length !== 0);
  }

  render() {
    if (!this.props.data) {
      return (<div />);
    }
    const oppNodes = this.props.data.map((opp) => {
        let willShow = true; //set to false if any filter excludes this opportunity
        const filteredOptions = this.props.filteredOptions;

        let matchingSearches = filteredOptions.matchingSearches;
        if (filteredOptions.searchBar !== "" && filteredOptions.clickedEnter){
          let matches = false;
          for (let i = 0; i<matchingSearches.length; i++){
            if(matchingSearches[i] === opp._id){
              matches = true;
            }
          }
          willShow = matches;
        }

        const yearsSelected = filteredOptions.yearSelect;
        const yearsAllowed = opp.yearsAllowed;
        console.log("yearsallowed");
        console.log(yearsAllowed);
        willShow = willShow && this.checkboxFilter(yearsSelected, yearsAllowed);
        console.log(willShow);

        let minGPA = filteredOptions.gpaSelect;
        if (minGPA != '' && minGPA < opp.minGPA){
              willShow = false;
        }

        let season = filteredOptions.startDate.season;
        let year = filteredOptions.startDate.year;
        if (season && (season != opp.startSeason || year != opp.startYear)){
              willShow = false;
        }

/*
        const csAreasSelected = filteredOptions.csAreaSelect;
        const csAreas = (Object.keys(csAreasSelected)).filter(cs => csAreasSelected.cs);
        const csAreasAllowed = opp.areas;
        willShow = willShow && this.checkboxFilter(csAreas, csAreasAllowed);
*/
        const compensationsSelected = filteredOptions.compensationSelect;
        console.log(compensationsSelected);
        const compensationsAllowed = opp.compensation;
        console.log(compensationsAllowed);
        willShow = willShow && this.checkboxFilter(compensationsSelected, compensationsAllowed);

      if (willShow) {
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
          />
        );
      }
    });

    const nodeCount = this.countNodes(oppNodes);
    const searchCrit = this.props.searching ? (
      <p>
        {nodeCount}
        {' '}
matching your search criteria.
      </p>
    ) : <span />;
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
