import React, { Component } from 'react';
import './ApplicationBox.scss';
import '../../../index.css';
import Calendar from 'react-icons/lib/fa/calendar-check-o';
import Info from 'react-icons/lib/fa/info-circle';
import * as Utils from '../../Utils';

class ApplicationBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  clickRow() {
    window.location.href = `/application/${this.props.data.id}`;
  }

  render() {
    // console.log(this.props.data.status === '');
    return (
      <div className="prof-application-box" onClick={this.clickRow.bind(this)} style={{ display: this.props.show ? '' : 'none' }}>
        <div className="row">
          <div className="column column-60 left-column">
            <div className="name">
              { Utils.capitalizeFirstLetter(this.props.data.lastName) }
              ,
              {' '}
              { Utils.capitalizeFirstLetter(this.props.data.firstName) }
            </div>
            <div className="email">
              { this.props.data.undergradNetId }
              @cornell.edu
            </div>
            <div className="grad-year">
              { Utils.gradYearToString(this.props.data.gradYear) }
              ,
              {' '}
              { this.props.data.major }
            </div>
            <div className="gpa">
              GPA:
              { this.props.data.gpa }
            </div>
            <div className="courses">
              Relevant Coursework:
              { this.props.data.courses.join(', ') }
            </div>
          </div>

          <div className="column right-column">
            <div className="status">
              <Info style={{ verticalAlign: 'top' }} className="info-icon" />
              {' '}
              Status:
              {' '}
              { this.props.data.status ? Utils.capitalizeFirstLetter(this.props.data.status) : 'Applied' }
            </div>
            <div className="date-applied">
              <Calendar style={{ verticalAlign: 'text-top' }} className="cal-icon" />
              {' '}
              Date Applied:
              {' '}
              { Utils.convertDate(this.props.data.timeSubmitted) }
            </div>
            <div className="opportunity">
              Opportunity:
              {' '}
              { this.props.opportunity.title }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApplicationBox;
