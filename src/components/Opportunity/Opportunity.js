import React, { Component } from 'react';
import axios from 'axios';
import '../../index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import './Opportunity.scss';
import CheckBox from 'react-icons/lib/fa/check-square-o';
import CrossCircle from 'react-icons/lib/fa/exclamation-circle';
import OpportunityJSON from './Opportunity.json';
import * as Utils from '../Utils.js';
import Star from '../../components/Star/Star';

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
      indexOf = needle => this.findIndex(item => findNaN && isNaN(item) || item.toLowerCase() === needle.toLowerCase());
    }
    return indexOf.call(this, needle) > -1;
  }

  star(e){
    e.stopPropagation();
    this.props.updateStar(this.props.opId);
  }

  clickRow(rowObj) {
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
    if(!sessionStorage.getItem('token_id')){
      return null;
    }
    if (this.props.prereqsMatch === true) {
      return (
        <div>
          <CheckBox className="greenCheck" size = {27} />
          {' '}
          <span class = "checkText">All Prereqs Met</span>
        </div>
      );
    }
    return (
      <div>
        <CrossCircle className="cal" size = {27} />
        {' '}
        <span class = "checkText">Prereqs Missing</span>
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

  checkEdit() {
    const lab = false;
    axios.get(`/api/role/${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        if (!response || response.data == 'none' ||
            !response.data || response.data == 'undergrad') {
          return false;
        }
        return true;
      });
  }

  render() {
    return (
      <div className="opportunity-card" onClick={this.clickRow.bind(this)}>
        <div className="row opp-box-row">
          <div className="column column-75">
            <div className="title">
              { this.props.title }
              <Star
                update={this.star.bind(this)}
                starred={this.props.starred}
              /></div>
            {/*<div>For {this.props.startSeason && this.props.startYear ? this.props.startSeason + ' ' + this.props.startYear : 'any time'} </div>*/}
          </div>

          <div className="column column-25">
            <div style={{textAlign: "right"}}>For {this.props.startSeason && this.props.startYear ? this.props.startSeason + ' ' + this.props.startYear : 'any time'} </div>
            {this.checkPrereqs()}
          </div>
        </div>
        { this.convertDescription(this.props.projectDescription, this.props.undergradTasks) }
      </div>
    );
  }
}

export default Opportunity;
