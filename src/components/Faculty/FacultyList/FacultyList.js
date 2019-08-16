import React, {Component} from 'react';
import Faculty from '../Faculty';
import '../../Opportunity/OpportunityList/OpportunityList.scss';
import axios from 'axios';

class FacultyList extends Component {
  constructor(props) {
    super(props);
    this.state = {starredFac : []};
  }

  getStarredFac(){
    console.log("SENDING API REQUEST TO GET ALL STARRED FACULTY");
    axios.get(`/api/undergrads/star?type=faculty&token_id=${sessionStorage.getItem('token_id')}`)
    .then((response) => {
      let data = response.data;
      this.setState({starredFac: data});
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  updateStar(opId){
    let token_id = sessionStorage.getItem('token_id');
    let type = "faculty";
    let id = opId;
    axios.post('/api/undergrads/star', { token_id, type, id })
    .then((response) => {
      if (response && response.data) {
        let starredVals = response.data;
        this.setState({starredFac: starredVals})
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  countNodes(nodes) {
    let tempCount = 0;
    let countString = '';
    for (let k in nodes) {
      if (nodes[k] != null) {
        tempCount++;
      }
    }
    if (tempCount === 1) {
      countString = 'There is 1 result';
    } else {
      countString = 'There are ' + tempCount.toString() + ' results';
    }
    return (countString);
  }

  componentDidMount(){
    console.log("component mounted");
    this.getStarredFac();
  }

  render() {
    let profNodes = this.props.data.map((prof) => {
      // if (idx > this.props.numShowing){
      //   return;
      // }
      /*The variable 'willshow' will be set to false if any filter excludes this faculty member */
      let willShow = true;
      const filteredOptions = this.props.filteredOptions;

      let departmentSelected = filteredOptions.department;
      let areaSelected = filteredOptions.area;
      let matchingSearches = filteredOptions.matchingSearches;
      /* checks if search bar filter matches a key word somewhere
       * EDIT: doesn't the backend have a function for this?
        * */
      // if (filteredOptions.searchBar != '' && filteredOptions.clickedEnter) {
      //   let matches = false;
      //   for (let i = 0; i < matchingSearches.length; i++) {
      //     if (matchingSearches[i] == prof._id) {
      //       matches = true;
      //     }
      //   }
      //   if (!matches) {
      //     willShow = false;
      //   }
      // }
      /* checks if filters have been added and excludes faculty if no match*/
      // if (departmentSelected && prof.department !== departmentSelected) {
      //   willShow = false;
      // }
      // if (areaSelected &&
      //     (prof.researchInterests.indexOf(areaSelected) === -1)) {
      //   willShow = false;
      // }

      if (willShow) {

        return (
            <Faculty
                key={prof['_id']}
                ID={prof['_id']}
                filteredOptions={this.props.filteredOptions}
                name={prof['name']}
                department={prof['department']}
                lab={prof['lab']}
                photoId={prof['photoId']}
                bio={prof['bio']}
                researchInterests={prof['researchInterests']}
                researchDescription={prof['researchDescription']}
                starred={this.state.starredFac.includes(prof['_id'])}
                updateStar={this.updateStar.bind(this)}
            />
        );
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
    );
  }
}

export default FacultyList;
