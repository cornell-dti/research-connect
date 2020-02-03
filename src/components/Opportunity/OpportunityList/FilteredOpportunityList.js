import React, { Component } from 'react';
import axios from 'axios';
import * as Utils from '../../Utils';
import Opportunity from '../Opportunity';
import './OpportunityList.scss';

class FilteredOpportunityList extends Component {
  countNodes(nodes) {
    let tempCount = 0;
    let countString = '';
    for (const k in nodes) {
      if (nodes[k] != null) {
        tempCount += 1;
      }
    }
    if (tempCount === 1) {
      countString = 'Here is a top opportunity for you';
    } else {
      countString = `Here are ${tempCount.toString()} good opportunities for you`;
    }
    return (countString);
  }

  filterOpps(opp) {
    axios.get(`/api/undergrads/token/${sessionStorage.getItem('token_id')}`)
      .then((res) => {
        const info = res.data[0];
        const uGradYear = Utils.gradYearToString(info.gradYear);
        const uGradMajor = info.major;
        const uGradGPA = info.gpa;
        let hasOptionsYear = true;
        let hasOptionsCS = true;
        let hasOptionsBio = true;
        let hasMinGPA = true;
        if ((uGradYear === 'Freshman' && yearsAllowed.indexOf('freshman') === -1)
          || (uGradYear === 'Sophomore' && yearsAllowed.indexOf('sophomore') === -1)
          || (uGradYear === 'Junior' && yearsAllowed.indexOf('junior') === -1)
          || (uGradYear === 'Senior' && yearsAllowed.indexOf('senior') === -1)) {
          hasOptionsYear = false;
        }
        if ((uGradMajor === 'Computer Science' && opp.areas.indexOf('Computer Science') === -1)) {
          hasOptionsCS = false;
        }
        if (
          (uGradMajor === 'Biology' && opp.areas.indexOf('Biology') !== -1)) {
          hasOptionsBio = false;
        }
        if ((uGradGPA < opp.minGPA)) {
          hasMinGPA = false;
        }
        if (hasMinGPA && (hasOptionsBio || hasOptionsCS) && hasOptionsYear) {
          return (
            <Opportunity
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

        return '';
      });
  }

  render() {
    // FIX THIS!!!
    // Once you get a way to get the request, have a while loop that either goes until oppNodes.length = 5
    // Or you're out of requests.
    const opps = loadOpportunitiesFromServer();
    const filteredOpps = [];
    let x = 0;
    while (filteredOpps.length <= 5 || x < opps.length) {
      const saveOpp = filterOpps(opps[x]);
      if (saveOpp !== '') {
        filteredOpps[x] = saveOpp;
        x += 1;
      }
    }
    return (
      <div className="node-list-div">
        { oppNodes }
      </div>

    );
  }
}

export default FilteredOpportunityList;
