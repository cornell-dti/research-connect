import React, {Component} from 'react';
import axios from 'axios';
import * as Utils from '../../Utils.js';
import Opportunity from '../Opportunity'
import './OpportunityList.scss'

class OpportunityList extends Component {

    constructor(props) {
      super(props);
    }

    countNodes(nodes){
      let tempCount = 0;
      let countString = "";
      for (let k in nodes) {
        if (nodes[k]!=null) {
          tempCount++;
        }
      }
      if (tempCount == 1) {
        countString = "Here is one opportunity"
      } else{
        countString = "Here are " + tempCount.toString() +" good opportunities for you"
      }
      return(countString);
    }


    render() {
      axios.get('/api/undergrads/' + (sessionStorage.getItem('token_id')))
      .then(res => {
          let info = res.data[0];
          let uGradSkills = info.skills === undefined ? [] : info.skills;
          let uGradYear =  Utils.gradYearToString(info.gradYear);
          let uGradMajor = info.major;
          let uGradGPA = info.gpa;
          let uGradCourses = info.courses;
          let netId = info.netId;
          

        let oppNodes = this.props.data.map(opp => {
        /*These variables will limit what filters are applicable based on year, minGPA, major, etc. Each filter will be false 
        if the filter limits all opportunities and true otherwise*/
        let hasOptionsYear = true;
        let hasOptionsCS = true;
        let hasOptionsBio = true; 
        let hasMinGPA = true; 
        if ((uGradYear === "Freshman" && yearsAllowed.indexOf("freshman") == -1) ||
          (uGradYear === "Sophomore" && yearsAllowed.indexOf("sophomore") == -1) ||
          (uGradYear === "Junior" && yearsAllowed.indexOf("junior") == -1) ||
          (uGradYear === "Senior" && yearsAllowed.indexOf("senior") == -1) )  
          {
            hasOptionsYear = false;
          }
          /**
           * Similar to above, checks if the cs box is checked in the majorSelect component (a bunch of major checkboxes)
           * and also checks to see if this opportunity is in the cs area.
           * */
        
          if ((uGradMajor === "Computer Science" && opp.areas.indexOf("Computer Science") == -1)){
            hasOptionsCS = false; 
          } 
          if (
            (bioSelected && opp.areas.indexOf("Biology") != -1)) {
              hasOptionsBio = false;
          }
          if ((minGPA!=null)&&(minGPA < opp.minGPA)){
              willShow = false;
          }
          if ((season!=null)&&((season!=opp.startSeason) || (year!=opp.startYear))){
              willShow = false;
          }
        });
          if (willShow){
            return (
              <Opportunity
                filteredOptions={this.props.filteredOptions }
                key={ opp['_id'] }
                title={ opp.title }
                area={ opp.areas }
                labId={ opp.labId }
                labName={ opp.labName }
                pi={ opp.pi }
                supervisor={ opp.supervisor }
                projectDescription={ opp.projectDescription }
                undergradTasks={ opp.undergradTasks}
                opens={ opp.opens }
                closes={ opp.closes }
                startSeason={ opp.startSeason }
                startYear={ opp.startYear}
                minSemesters={ opp.minSemesters }
                minHours={ opp.minHours }
                maxHours={ opp.maxHours }
                qualifications={ opp.qualifications }
                minGPA={ opp.minGPA }
                requiredClasses={ opp.requiredClasses }
                questions={ opp.questions }
                additionalInformation = {opp.additionalInformation}
                yearsAllowed={ opp.yearsAllowed }
                prereqsMatch={opp.prereqsMatch}
                spots={ opp.spots }
                opId={opp._id}/>
              )
          }
      


        });
        let nodeCount = this.countNodes(oppNodes);
        let searchCrit = this.props.searching ? <p>{nodeCount} matching your search criteria.</p> : <span></span>;
        return (
          <div>
            <div className="node-list-div">
              { searchCrit }
              </div>
              { oppNodes }
          </div>

        )
    }
}

export default OpportunityList
