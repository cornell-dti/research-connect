import React, { Component } from 'react';
import axios from 'axios';
import Opportunity from './Opportunity'

class OpportunityList extends Component {
  render (){
    let oppNodes = this.props.data.map(opp => {
      return (
        <Opportunity
          key={ opp ['_id'] }
          title={ opp.title }
          area={ opp.area }
          labId={ opp.labId }
          labName={ opp.labName }
          pi={ opp.pi }
          supervisor={ opp.supervisor }
          projectDescription={ opp.projectDescription }
          undergradTasks={ opp.undergradTasks}
          opens={ opp.opens }
          closes={ opp.closes }
          startDate={ opp.startDate }
          minSemesters={ opp.minSemesters }
          minHours={ opp.minHours }
          maxHours={ opp.maxHours }
          qualifications={ opp.qualifications }
          minGPA={ opp.minGPA }
          requiredClasses={ opp.requiredClasses }
          questions={ opp.questions }
          yearsAllowed={ opp.yearsAllowed }
          applications={ opp.applications }
          spots={ opp.spots }
        />
      )
    })
    return (
      <table>
        <th>Title</th>
        <th>Area</th>
        <th>Lab Name</th>
        <th>PI</th>
        <tbody>{ oppNodes }</tbody>
      </table>
    )
  }
}

export default OpportunityList
