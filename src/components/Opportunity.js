import React, {Component} from 'react';
import '../index.css';
import { BrowserRouter as Router } from 'react-router-dom'

class Opportunity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            area: [], //required, area(s) of research (molecular bio, bioengineering, electrical engineering, computer science, etc.)
            labName: '',    //required
            labId: '',  //required
            pi: '', //required
            supervisor: '', //can be null
            projectDescription: '', //required, add min length that you see fit
            undergradTasks: '',  //what the undergrad would be doing, can be null
            opens: {type: Date, default: new Date()},   //if no date is sent use new Date()
            closes: {type: Date, default: null},  //null if rolling
            startDate: '', //null if start asap, string b/c it will prob be something like Fall 2018
            minSemesters: 0,   //can be null, indicating no min. minimum number of semesters they're expected to work in the lab
            minHours: 0, //can be null, indicating no minimum
            maxHours: 0, //can be null, indicating no max
            qualifications: '', //can be null/empty
            minGPA: 0, //0 if no minimum gpa required
            requiredClasses: [], //can be empty
            questions: [],    //can be empty
            yearsAllowed: [],  //required, do they accept freshman, sophomores, juniors, and/or seniors
            //applications: 0,   //number of people who've submitted, default 0, they don't submit this
            spots: 0
        };
    }

    contains(needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;

        if (!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function (needle) {
                var i = -1, index = -1;

                for (i = 0; i < this.length; i++) {
                    var item = this[i];

                    if ((findNaN && item !== item) || item.toLowerCase() === needle.toLowerCase()) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, needle) > -1;
    };

    /**
     * takes the filteredOptions passed all the way down from Opportunities.js through the props
     * and compare the fileredOptions to the years allowed passed through props by the opportunity list that has all the info about opportunities
     * @return {boolean} based on the filter paramterse, whether or not each opportunity should show
     */
    shouldShow() {
        const filteredOptions = this.props.filteredOptions;
        //filter for years allowed
        if (filteredOptions.yearSelect.Freshman && this.props.yearsAllowed.indexOf("freshman") != -1 ||
            filteredOptions.yearSelect.Sophomore && this.props.yearsAllowed.indexOf("sophomore") != -1 ||
            filteredOptions.yearSelect.Junior && this.props.yearsAllowed.indexOf("junior") != -1 ||
            filteredOptions.yearSelect.Senior && this.props.yearsAllowed.indexOf("senior") != -1) {
            return true;
        }
        return false;
    }

    clickRow(rowObj) {
        console.log(this.props.opId);
        this.props.history.push('/opportunity/' + this.props.opID);
    }

    convertDate(dateString){
      var dateObj = new Date(dateString);
      return dateObj.toString().slice(0,15);
    }
    checkOpen(){
      var openDateObj = new Date(this.props.opens);
      var closesDateObj = new Date(this.props.closes);
      var nowTime = Date.now()
      if (closesDateObj.getTime() < nowTime){
        return "Closed";
      }else if (openDateObj.getTime() > nowTime){
        return "Not Open Yet";
      }else{
        return "Open";
      }
    }

    render() {
        return (
            <div>
            <tr onClick={this.clickRow.bind(this)}  style={{display: this.shouldShow() ? "" : "none"}}>
                <td>{ this.props.title }</td>
                <td>{ this.props.area }</td>
                <td>{ this.props.labName }</td>
                <td>{ this.props.pi }</td>
                <td>{ this.props.supervisor }</td>
                <td>{ this.props.projectDescription }</td>
                <td>{ this.props.undergradTasks }</td>
                <td>{ this.props.opens }</td>
                <td>{ this.props.closes }</td>
                <td>{ this.props.startDate }</td>
                <td>{ this.props.minSemesters }</td>
                <td>{ this.props.minHours }</td>
                <td>{ this.props.maxHours }</td>
                <td>{ this.props.qualifications }</td>
                <td>{ this.props.minGPA }</td>
                <td>{ this.props.requiredClasses }</td>
                {/*<td>{ this.props.questions }</td>*/}
                <td>{ this.props.yearsAllowed }</td>
                <td>{ this.props.spots }</td>
            </tr>
            <div className='opportunityListing'>
                <h3>{this.props.title}</h3>
                <h4> {this.checkOpen()}</h4>
                <h4> Supervisor: {this.props.supervisor}</h4>
                <h4> Area: {this.props.area}</h4>
                <h4> Lab Name: {this.props.labName}</h4>
                <h4> PI: {this.props.pi}</h4>
                <h4> Description: {this.props.projectDescription}</h4>
                <h4> Tasks: {this.props.undergradTasks}</h4>
                <h4> Application Window: From {this.convertDate(this.props.opens)} to {this.convertDate(this.props.closes)}</h4>
                <h4> Start Date: {this.props.startDate}</h4>
                <h4> Weekly Hours: Between { this.props.minHours } and { this.props.maxHours } </h4>
                <h4> Qualifications: </h4>
                <ul>
                  <li>Minimum GPA: {this.props.minGPA}</li>
                  <li>Required Classes: {this.props.requiredClasses}</li>
                  <li>Years Allowed: {this.props.yearsAllowed}</li>
                  <li>Required minimum semesters: {this.minSemesters}</li>
                  <li>{this.props.qualifications}</li>
                  </ul>

                <h4>Apply Here: </h4>
              <div>
              {Object.values(this.props.questions)}
              </div>
                </div>
            </div>


        )
    }
}

export default Opportunity;
