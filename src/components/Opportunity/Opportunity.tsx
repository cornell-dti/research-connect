import React, { Component, ChangeEvent } from 'react';
import '../../index.css';
import './Opportunity.scss';
// @ts-ignore
import CheckBox from 'react-icons/lib/fa/check-square-o';
// @ts-ignore
import CrossCircle from 'react-icons/lib/fa/exclamation-circle';
import * as Utils from '../Utils';
import Star from '../Star/Star';

type Props = {
  opId: string;
  title: string;
  projectDescription: string;
  undergradTasks: string;
  prereqsMatch: boolean;
  starred: boolean;
  opens: string;
  closes: string;
  startSeason?: string;
  startYear?: string;
  role?: string;
  updateStar: (id: string) => void;
};

class Opportunity extends Component<Props> {
  star = (e: ChangeEvent) => {
    e.stopPropagation();
    this.props.updateStar(this.props.opId);
  };

  clickRow = () => {
    document.location.href = (`/opportunity/${this.props.opId}`);
  };

  convertDescription(str1: string, str2: string) {
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

  static undergradIsViewingPage(role?: string) {
    return role === Utils.roleStringForUndergrads;
  }

  handleShowingStar(role?: string) {
    if (Opportunity.undergradIsViewingPage(role)) {
      return (
        <Star
          update={this.star}
          starred={this.props.starred}
        />
      );
    }
    return '';
  }

  handleShowingPrereqs(role?: string) {
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
          </div>

          <div className="column column-25">
            <div style={{ textAlign: 'right' }}>
              {'For '}
              {this.props.startSeason && this.props.startYear
                ? `${this.props.startSeason} ${this.props.startYear}`
                : 'any time'}
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
