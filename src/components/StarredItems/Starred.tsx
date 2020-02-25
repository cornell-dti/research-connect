import React, { Component } from 'react';
import axios from 'axios';
import Faculty from '../Faculty/Faculty';
import Opportunity from '../Opportunity/Opportunity';
import './Starred.scss';
import { Opportunity as OpportunityType, Professor } from '../../types';

type Props = {
  type: string; // enum for getting starred items API call
  limit?: number; // limit of showable starred items
  label?: string;
  filteredOptions?: any;
};
type Data = OpportunityType | Professor;
type State<D extends Data = Data> = { starred: D[]; data: D[] };

class Starred extends Component<Props, State> {
  state: State = { starred: [], data: [] };

  loadData() {
    // line below is necessary because backend has different naming conventions,
    // api/undergrads uses opportunity
    // api/opportunities
    const wrapper = this.props.type === 'opportunity' ? 'opportunities' : 'faculty';

    axios.get(`/api/undergrads/star?type=${this.props.type}&token_id=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        const { data }: { data: OpportunityType[] } = response;
        axios.get(`/api/${wrapper}`)
          .then((res) => {
            const all: Data[] = res.data;
            // @ts-ignore
            const onlyStarred = all.filter((i) => data.includes(i._id));
            this.setState({ data: onlyStarred, starred: data });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateStar(id: string) {
    const token_id = sessionStorage.getItem('token_id');
    const { type } = this.props;

    axios.post('/api/undergrads/star', { token_id, type, id })
      .then((response) => {
        if (response && response.data) {
          const { data } = response;
          this.setState({ starred: data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  genOppCards() {
    const oppNodes = (this.state.data as OpportunityType[]).map((opp) => {
      // @ts-ignore
      const starred = (this.state.starred as OpportunityType[]).includes(opp._id);
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
    return this.props.limit ? oppNodes.slice(0, this.props.limit) : oppNodes;
  }

  genFacCards() {
    const profNodes = (this.state.data as Professor[]).map((prof) => {
      // @ts-ignore
      const starred = (this.state.starred as Professor[]).includes(prof._id);
      return (
        <Faculty
          key={prof._id}
          ID={prof._id}
          filteredOptions={this.props.filteredOptions}
          name={prof.name}
          department={prof.department}
          lab={prof.lab}
          photoId={prof.photoId}
          bio={prof.bio}
          researchInterests={prof.researchInterests}
          researchDescription={prof.researchDescription}
          starred={starred}
          updateStar={this.updateStar.bind(this)}
        />
      );
    });
    return this.props.limit ? profNodes.slice(0, this.props.limit) : profNodes;
  }

  display() {
    if (this.props.label) {
      return (
        <div>
          <p className="labelheader">
            {this.props.label}
            <a href={`/saved${this.props.type}`} className={`${this.props.type}link`}>
              {`VIEW ALL ${this.state.starred.length} >`}
            </a>
          </p>
        </div>
      );
    }
    return null;
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    let nodes;

    if (this.props.type === 'opportunity') {
      nodes = this.genOppCards();
    } else if (this.props.type === 'faculty') {
      nodes = this.genFacCards();
    }

    return (
      <div className="wrapper">
        { this.display() }
        <div className="node-list-div">
          {nodes}
        </div>
      </div>
    );
  }
}

export default Starred;
