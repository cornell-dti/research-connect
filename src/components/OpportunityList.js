import React, {Component} from 'react';
import Opportunity from './Opportunity'

class OpportunityList extends Component {
    render() {
        let oppNodes = this.props.data.map(opp => {
            return (
                <Opportunity filteredOptions={this.props.filteredOptions }
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
                    //applications={ opp.applications }
                    spots={ opp.spots }
                />
            )
        });
        return (
            <table><thead><tr>
                <th>Title</th>
                <th>Area</th>
                <th>Lab Name</th>
                <th>PI</th>
                <th>Supervisor</th>
                <th>Project Description</th>
                <th>Undergrad Tasks</th>
                <th>Opens</th>
                <th>Closes</th>
                <th>Start Date</th>
                <th>Min Semesters</th>
                <th>Min Hours</th>
                <th>Max Hours</th>
                <th>Qualifications</th>
                <th>Min GPA</th>
                <th>Required Classes</th>
                <th>Questions</th>
                <th>Years Allowed</th>
                <th>Spots</th></tr></thead>
                <tbody>{ oppNodes }</tbody>
            </table>
        )
    }
}

export default OpportunityList
