import React, { Component, ChangeEvent } from 'react';
import '../Opportunity/OpportunityList/OpportunityList.scss';
import '../Opportunity/Opportunity.scss';
import './Faculty.scss';
import Star from '../Star/Star';

type Props = {
  ID: string;
  name: string;
  photoId: string;
  starred: boolean;
  department: string;
  lab: string;
  researchDescription: string;
  researchStatus: string;
  bio: string;
  updateStar: (id: string) => void;
}

class Faculty extends Component<Props> {
  star = (e: ChangeEvent) => {
    e.stopPropagation();
    this.props.updateStar(this.props.ID);
  };

  convertDescription(str: string) {
    // if string is empty
    if (!str) {
      return '';
    }
    if (str.length > 250) {
      str = `${str.slice(0, 250)}... `;
      return (
        <h6>
          {str}
          <span className="viewDetails">View Details</span>
        </h6>
      );
    }
    return <h6>{`${str} `}</h6>;
  }

  clickRow() {
    document.location.href = (`/faculty/${this.props.ID}`);
  }

  render() {
    return (
      <div className="opportunity-card" onClick={this.clickRow.bind(this)}>
        <div className="row opp-box-row">
          <div className="column column-10">
            <img alt={this.props.name} src={this.props.photoId} width="75px" />
          </div>
          <div className="column column-90">
            <h4>
              { this.props.name }
              <Star
                update={this.star}
                starred={this.props.starred}
              />
            </h4>
            {this.props.lab !== null && this.props.lab !== '' && this.props.lab !== undefined
              ? (<h5>{this.props.lab}</h5>)
              : <span />}

            <h6>
              {this.props.researchStatus
                ? this.convertDescription(`Undergrad Research Status: ${this.props.researchStatus}`)
                : this.convertDescription('Undergrad Research Status: No info available. '
                  + "If you're very interested in this professor's work, email them to "
                  + 'find out if they are currently open to working with undergrads.')}
            </h6>
            <div>
              {this.props.researchDescription && this.props.researchDescription.length > 0
                ? this.convertDescription(this.props.researchDescription)
                : this.convertDescription(this.props.bio)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Faculty;
