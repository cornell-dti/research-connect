import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';


class Starred extends React.Component {
  constructor(props){
    super(props);
    this.state = {starred: [], data : []};
  }

  getStarred(){
    axios.get(`/api/undergrads/star?type=${this.props.type}&token_id=${sessionStorage.getItem('token_id')}`)
    .then((response) => {
      let data = response.data;
      this.setState({starred: data});
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  updateStar(id){
    let token_id = sessionStorage.getItem('token_id');
    let type = this.props.type;
    let id = id;

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
      if(starred){
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
      }
    });
    return oppNodes;
  }

  genFacCards(){
    let profNodes = this.state.data.map((prof, idx) => {
      let starred = this.state.starred.includes(prof['_id']);
      if(starred){
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
      }
    });
    return profNodes;
  }

  componentDidMount(){
    this.getStarred();
  }

  render() {
    let nodes;

    if(type == "opportunity"){
      nodes = this.genOppCards();
    }
    else if(type == "faculty"){
      nodes = this.genFacCards();
    }
    nodes = nodes.slice(0, this.props.max);
    let nodeCount = this.countNodes(nodes);

    return (
      <div>
        <div className="node-list-div">
          <p>
            {nodeCount} matching your search criteria.
          </p>
        </div>
        {nodes}
      </div>
    );
  }//end render
}//end class

Starred.propTypes = {
  type: PropTypes.string, //enum for getting starred items API call
  max: PropTypes.number, //limit of showable starred items
};

export default Starred;
