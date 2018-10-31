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
        countString = "Here is a top opportunity for you"
      } else{
        countString = "Here are " + tempCount.toString() +" good opportunities for you"
      }
      return(countString);
    }

    filterOpps(opp){
      axios.get('/api/undergrads/' + (sessionStorage.getItem('token_id')))
      .then(res => {
          let info = res.data[0];
          let uGradYear =  Utils.gradYearToString(info.gradYear);
          let uGradMajor = info.major;
          let uGradGPA = info.gpa;
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
          if ((uGradMajor === "Computer Science" && opp.areas.indexOf("Computer Science") == -1)){
            hasOptionsCS = false; 
          } 
          if (
            (uGradMajor === "Biology" && opp.areas.indexOf("Biology") != -1)) {
              hasOptionsBio = false;
          }
          if ((uGradGPA < opp.minGPA)){
              hasMinGPA = false;
          }
          if (hasMinGPA && (hasOptionsBio||hasOptionsCS)&&hasOptionsYear){
            return (
              <Opportunity
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
    }
    render() {
      //FIX THIS!!!
      let oppNodes = this.props.data.map(opp => {
      

        });
        let nodeCount = this.countNodes(oppNodes);
     
        return (
            <div className="node-list-div">
              { oppNodes }
          </div>

        )
    }
}

export default OpportunityList
