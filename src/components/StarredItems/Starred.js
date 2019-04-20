import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Faculty from '../Faculty/Faculty';
import Opportunity from '../Opportunity/Opportunity';

class Starred extends React.Component {
  constructor(props){
    super(props);
    this.state = {starred: [], data: []};
  }

  loadData(){
    // line below is necessary because backend has different naming conventions,
    // api/undergrads uses opportunity
    // api/opportunities 
    let wrapper = this.props.type === "opportunity" ? "opportunities" : "faculty";

    axios.get(`/api/undergrads/star?type=${this.props.type}&token_id=${sessionStorage.getItem('token_id')}`)
    .then((response) => {
      let data = response.data;
      axios.get(`/api/${wrapper}`)
      .then((res) => {
        let all = res.data;
        console.log(data);
        console.log(all);
        let onlyStarred = all.filter(i => data.includes(i._id))
        this.setState({data: onlyStarred, starred: data});
        console.log("got up to here");
      });
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  updateStar(id){
    let token_id = sessionStorage.getItem('token_id');
    let type = this.props.type 

    axios.post('/api/undergrads/star', { token_id, type, id })
    .then((response) => {
      if (response && response.data) {
        let data = response.data;
        this.setState({starred: data});
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  genOppCards() {
    const oppNodes = this.state.data.map((opp) => {
      let starred = this.state.starred.includes(opp._id);
      return (
        <Opportunity
          title={opp.title}
          projectDescription={opp.projectDescription}
          prereqsMatch={opp.prereqsMatch}
          opId={opp._id}
          opens={opp.opens}
          closes={opp.closes}
          undergradTasks={opp.undergradTasks}
          starred={starred}
          updateStar={this.updateStar.bind(this)}
        />
      );
    });
    return oppNodes.slice(0, this.props.limit);
  }

  genFacCards(){
    let profNodes = this.state.data.map((prof) => {
      let starred = this.state.starred.includes(prof['_id']);
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
          starred={starred}
          updateStar={this.updateStar.bind(this)}
        />
      );
    });
    return profNodes.slice(0, this.props.limit);
  }

  // genFacDisplay(l){
  //   let start = l === 1 ? 'There is 1 starred faculty ' : `There are ${l} starred faculty `;
  //   let end = `out of ${this.state.starred.length} starred faculty`;
  //   return `${start}displayed ${end}`;
  // }

  // genOppDisplay(l){
  //   let start = l === 1 ? 'There is 1 starred opportunity ' : `There are ${l} starred opportunities `;
  //   let count = this.state.starred.length;
  //   let end = count === 1 ? `out of ${count} starred opportunity` : `out of ${count} starred opportunities `;
  //   return `${start}displayed ${end}`;
  // }

  componentWillMount(){
    this.loadData();
  }

  render() {
    let nodes;

    if(this.props.type === "opportunity"){
      nodes = this.genOppCards();
      // display = this.genOppDisplay(nodes.length);
    }
    else if(this.props.type === "faculty"){
      nodes = this.genFacCards();
      // display = this.genFacDisplay(nodes.length);
    }

    return (
      <div>
        <div className="node-list-div">
          <p>View all {this.state.starred.length}</p>
        </div>
        {nodes}
      </div>
    );
  }//end render
}//end class

Starred.propTypes = {
  type: PropTypes.string, //enum for getting starred items API call
  limit: PropTypes.number, //limit of showable starred items
};

export default Starred;
