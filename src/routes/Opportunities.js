import React, {Component} from 'react';
import axios from 'axios';
import logo from '../logo.svg';
import '../App.css';
import '../opportunities.css';
import OpportunityBox from '../components/OpportunityBox';
import YearSelect from '../components/YearSelect'
import MajorSelect from '../components/MajorSelect'
import GPASelect from '../components/GPASelect'

class Opportunities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearSelect: {

            },
            gpaSelect: {

            },
            majorSelect: {

            }
        };
    }



    //will be called by the year component whenever the year checkboxes are updated
    handleUpdateYear(yearObj) {
        this.setState({yearSelect: yearObj});
    }
    handleUpdateGPA(gpaObj) {
        this.setState({gpaSelect: gpaObj});
    }

    handleUpdateMajor(majorObj) {
        this.setState({majorSelect: majorObj});
    }


    render() {
        return (
            <div>
            <div className="header">
            </div>
            <div className="searchDiv">
            <input type="text" name="search" placeholder="Search"/>
            </div>

            <div className="horizontal-flex">
              <div className="filter-flex">
                <h2>Filters</h2>
                <h3>Department</h3>
                <h3>Area of Interest</h3>
                  <MajorSelect updateMajor={this.handleUpdateMajor.bind(this)} />
                <h3>School Year</h3>
                  <YearSelect updateYear={this.handleUpdateYear.bind(this)} />
                <h3>Start/End Dates</h3>
                <h3>Minimum GPA</h3>
                <GPASelect updateGPA= {this.handleUpdateGPA.bind(this)}/>
              </div>
              <div className="opp-flex">
                <OpportunityBox filteredOptions = {this.state}
                    url='http://localhost:3001/getOpportunitiesListing'
                />
                </div>
                  </div>

            </div>

        );
    }
}

export default Opportunities;
