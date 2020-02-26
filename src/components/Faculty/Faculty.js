import React, { Component } from 'react';
import '../Opportunity/OpportunityList/OpportunityList.scss';
import '../Opportunity/Opportunity.scss';
import './Faculty.scss';
import Star from '../Star/Star';

class Faculty extends Component {
  star(e) {
    e.stopPropagation();
    this.props.updateStar(this.props.ID);
  }

  convertDescription(str) {
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
                update={this.star.bind(this)}
                starred={this.props.starred}
              />
            </h4>
            <h5>{this.props.department}</h5>
            {this.props.lab !== null && this.propslab !== '' && this.props.lab !== undefined
              ? (<h5>{this.props.lab}</h5>)
              : <span />}

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
