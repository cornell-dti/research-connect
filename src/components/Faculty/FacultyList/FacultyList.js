import React, {Component} from 'react';
import Faculty from '../Faculty'
import '../../Opportunity/OpportunityList/OpportunityList.scss'

class FacultyList extends Component {
    constructor(props) {
    super(props);
	 }
    countNodes(nodes){
      let tempCount = 0;
      let countString = "";
      for (let k in nodes){
        if (nodes[k]!=null){
          tempCount++;
        }
      }
      if (tempCount==1){
        countString = "There is 1 result"
      }else{
        countString = "There are " + tempCount.toString() +" results"
      }
      return(countString);
    }


    render() {
          let profNodes = this.props.data.map(prof => {
          /*The variable 'willshow' will be set to false if any filter excludes this faculty member */
          let willShow = true;
          const filteredOptions = this.props.filteredOptions;
          
          let departmentSelected = filteredOptions.department;
          let areaSelected = filteredOptions.area;
          let matchingSearches = filteredOptions.matchingSearches;
          /* checks if search bar filter matches a key word somewhere */
          if (filteredOptions.searchBar!="" && filteredOptions.clickedEnter){
            let matches = false
            for (let i = 0; i<matchingSearches.length; i++){
              if (matchingSearches[i]==prof._id){
                matches = true;
              }
            }
            if (!matches){
              willShow = false;
            }
          }
          /* checks if filters have been added and excludes faculty if no match*/
          if (departmentSelected && prof.department !== departmentSelected){
              willShow = false;
          }
          if (areaSelected && (prof.researchInterests.indexOf(areaSelected) === -1)) {
              willShow = false;
          }
          
          if (willShow){

            return (
              <Faculty
                key={ prof['_id'] }
                ID={ prof['_id'] }
                filteredOptions={this.props.filteredOptions }
                name={ prof['name'] }
                department={ prof['department']}
                lab={ prof['lab']}
                researchInterests = { prof['researchInterests']}
                researchDescription = { prof['researchDescription']}
                />             
            )
          }


        });
        let nodeCount = this.countNodes(profNodes);
        return (
          <div>
            <div className="node-list-div">
              <p>
                {nodeCount} matching your search criteria.
              </p>
            </div>
            {profNodes}
          </div>

        )   
              
    }
}

export default FacultyList
