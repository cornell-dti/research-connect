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

  render() {
    if (!this.props.data) {
      return (<div />);
    }
    const oppNodes = this.props.data.map((opp) => {
      /* The variable 'willshow' will be set to false if any filter excludes this opportunity */
      let willShow = true;
      const filteredOptions = this.props.filteredOptions;
      /**
				 * filter for years allowed. Saying if the Freshman option is checked (hence the .Freshman, since it's a checkbox
				 so that value must either be true or false) and if this row has freshman in its array of years allowed, then
				 we return true and should show this opportunity
				 */
      const froshSelected = filteredOptions.yearSelect.Freshman;
      const sophSelected = filteredOptions.yearSelect.Sophomore;
      const juniorSelected = filteredOptions.yearSelect.Junior;
      const seniorSelected = filteredOptions.yearSelect.Senior;
      const matchingSearches = filteredOptions.matchingSearches;
      const yearsAllowed = opp.yearsAllowed;
      const csSelected = filteredOptions.majorSelect.cs;
      const bioSelected = filteredOptions.majorSelect.biology;
      const minGPA = filteredOptions.gpaSelect.val;
      const season = filteredOptions.startDate.season;
      const year = filteredOptions.startDate.year;
      const moneySelected = filteredOptions.compensationSelect.Money;
      const creditSelected = filteredOptions.compensationSelect.Credit;
      const compensations = opp.compensation;

      if (filteredOptions.searchBar != '' && filteredOptions.clickedEnter) {
        const matches = matchingSearches.some(search => search == opp._id);
        if (!matches) {
          willShow = false;
        }
      }

      if (!((froshSelected && yearsAllowed.indexOf('freshman') != -1)
					|| (sophSelected && yearsAllowed.indexOf('sophomore') != -1)
					|| (juniorSelected && yearsAllowed.indexOf('junior') != -1)
					|| (seniorSelected && yearsAllowed.indexOf('senior') != -1)
					|| (!froshSelected && !sophSelected && !juniorSelected && !seniorSelected))) {
        willShow = false;
      }

      /**
					* Similar to above, checks if the cs box is checked in the majorSelect component (a bunch of major checkboxes)
					* and also checks to see if this opportunity is in the cs area.
					* */
      if (!((csSelected && opp.areas.indexOf('Computer Science') != -1)
						|| (bioSelected && opp.areas.indexOf('Biology') != -1)
						|| (!csSelected && !bioSelected))) {
        willShow = false;
      }

      if ((minGPA != null) && (minGPA < opp.minGPA)) {
        willShow = false;
      }

      if ((season != null) && ((season != opp.startSeason) || (year != opp.startYear))) {
        willShow = false;
      }

      if (!((moneySelected && compensations.indexOf('pay') != -1)
					|| (creditSelected && compensations.indexOf('credit') != -1)
					|| (!moneySelected && !creditSelected))) {
        willShow = false;
      }

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
