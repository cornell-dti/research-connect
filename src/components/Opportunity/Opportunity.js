import React, { Component } from 'react';
import '../../index.css';
import './Opportunity.scss';
import CheckBox from 'react-icons/lib/fa/check-square-o';
import CrossCircle from 'react-icons/lib/fa/exclamation-circle';
import OpportunityJSON from './Opportunity.json';
import * as Utils from '../Utils';
import Star from '../Star/Star';

class Opportunity extends Component {
  constructor(props) {
    super(props);
    this.state = OpportunityJSON;
  }

  contains(needle) {
    const findNaN = isNaN(needle);
    let indexOf;
    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
    } else {
      indexOf = (needle) => this.findIndex((item) => (findNaN && isNaN(item)) || item.toLowerCase() === needle.toLowerCase());
    }
    return indexOf.call(this, needle) > -1;
  }

  star(e) {
    e.stopPropagation();
    this.props.updateStar(this.props.opId);
  }

  clickRow() {
    document.location.href = (`/opportunity/${this.props.opId}`);
  }

  convertDescription(str1, str2) {
    const maxChars = 100;
    if (str1.length === 0) {
      if (str2.length > maxChars) {
        str2 = `${str2.slice(0, maxChars)}... `;
        return (
          <h6>
            {str2}
            <span className="viewDetails">View Details</span>
            {' '}

          </h6>
        );
      }
      return (
        <h6 className="smallTasks">
          {`${str2}`}
          {' '}
        </h6>
      );
    }
    if (str1.length > maxChars) {
      str1 = `${str1.slice(0, maxChars)}... `;
      return (
        <div className="description-div">
          {str1}
          <span className="viewDetails">View Details</span>
        </div>
      );
    }
    return (
      <div className="description-div">
        {`${str1}`}
        {' '}
      </div>
    );
  }

  checkPrereqs() {
    if (!sessionStorage.getItem('token_id')) {
      return null;
    }
    if (this.props.prereqsMatch === true) {
      return (
        <div>
          <CheckBox className="greenCheck" size={27} />
          {' '}
          <span className="checkText">All Prereqs Met</span>
        </div>
      );
    }
    return (
      <div>
        <CrossCircle className="cal" size={27} />
        {' '}
        <span className="checkText">Prereqs Missing</span>
      </div>
    );
  }

  checkOpen() {
    const openDateObj = new Date(this.props.opens);
    const closesDateObj = new Date(this.props.closes);
    const nowTime = Date.now();
    if (closesDateObj.getTime() < nowTime) {
      return 'Closed';
    } if (openDateObj.getTime() > nowTime) {
      return 'Not Open Yet';
    }
    return 'Open';
  }

  static undergradIsViewingPage(role) {
    return role === Utils.roleStringForUndergrads;
  }

  handleShowingStar(role) {
    if (Opportunity.undergradIsViewingPage(role)) {
      return (
        <Star
          update={this.star.bind(this)}
          starred={this.props.starred}
        />
      );
    }
    return '';
  }

  handleShowingPrereqs(role) {
    if (Opportunity.undergradIsViewingPage(role)) {
      return this.checkPrereqs();
    }
    return '';
  }

  render() {
    return (
      <div className="opportunity-card" onClick={this.clickRow.bind(this)}>
        <div className="row opp-box-row">
          <div className="column column-75">
            <div className="title">
              { this.props.title }
              { this.handleShowingStar(this.props.role) }
            </div>
            {/* <div>For {this.props.startSeason && this.props.startYear ? this.props.startSeason + ' ' + this.props.startYear : 'any time'} </div> */}
          </div>

          <div className="column column-25">
            <div style={{ textAlign: 'right' }}>
              {'For '}
              {this.props.startSeason && this.props.startYear ? `${this.props.startSeason} ${this.props.startYear}` : 'any time'}
              {this.handleShowingPrereqs(this.props.role)}
            </div>
          </div>
        </div>
        { this.convertDescription(this.props.projectDescription, this.props.undergradTasks) }
      </div>
    );
  }
}

export default Opportunity;
