import React, {Component} from 'react';
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
        countString = "There is 1 result"
      } else{
        countString = "There are " + tempCount.toString() +" results"
      }
      return(countString);
    }


    render() {
        let oppNodes = this.props.data.map(opp => {
        /*The variable 'willshow' will be set to false if any filter excludes this opportunity */
        let willShow = true;
        const filteredOptions = this.props.filteredOptions;
        /**
         * filter for years allowed. Saying if the Freshman option is checked (hence the .Freshman, since it's a checkbox
         so that value must either be true or false) and if this row has freshman in its array of years allowed, then
         we return true and should show this opportunity
         */
        let froshSelected = filteredOptions.yearSelect.Freshman;
        let sophSelected = filteredOptions.yearSelect.Sophomore;
        let juniorSelected = filteredOptions.yearSelect.Junior;
        let seniorSelected = filteredOptions.yearSelect.Senior;
        let matchingSearches = filteredOptions.matchingSearches;
        let yearsAllowed = opp.yearsAllowed;
        let csSelected = filteredOptions.majorSelect.cs;
        let bioSelected = filteredOptions.majorSelect.biology;
        let minGPA = filteredOptions.gpaSelect.val;
        let season = filteredOptions.startDate.season;
        let year = filteredOptions.startDate.year;

        if (filteredOptions.searchBar!="" && filteredOptions.clickedEnter){
          let matches = false
          for (let i = 0; i<matchingSearches.length; i++){
            if(matchingSearches[i]==opp._id){
              matches = true;
            }
          }
          if (!matches){
            willShow = false;
          }
        }

        if (!((froshSelected && yearsAllowed.indexOf("freshman") != -1) ||
          (sophSelected && yearsAllowed.indexOf("sophomore") != -1) ||
          (juniorSelected && yearsAllowed.indexOf("junior") != -1) ||
          (seniorSelected && yearsAllowed.indexOf("senior") != -1) ||
          (!froshSelected && !sophSelected && !juniorSelected && !seniorSelected)))  {
            willShow = false;
          }
          /**
           * Similar to above, checks if the cs box is checked in the majorSelect component (a bunch of major checkboxes)
           * and also checks to see if this opportunity is in the cs area.
           * */
        
          if (!((csSelected && opp.areas.indexOf("Computer Science") != -1) ||
            (bioSelected && opp.areas.indexOf("Biology") != -1) ||
            (!csSelected && !bioSelected))) {
              willShow = false;

          }
          if ((minGPA!=null)&&(minGPA < opp.minGPA)){
              willShow = false;
          }
          if ((season!=null)&&((season!=opp.startSeason) || (year!=opp.startYear))){
              willShow = false;
          }
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
