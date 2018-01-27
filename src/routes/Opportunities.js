import React, {Component} from 'react';
import axios from 'axios';
import logo from '../logo.svg';
import '../App.css';
import OpportunityBox from '../components/OpportunityBox';
import YearSelect from '../components/YearSelect'

class Opportunities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearSelect: {},
            yearSelectNode: {}
        };
    }

    //just used to print out the state
    test() {
        console.log("ran");
        console.log(this.state);
    }

    //will be called by the year component whenever the year checkboxes are updated
    handleUpdateYear(yearObj) {
        this.setState({yearSelect: yearObj}, () => {
            console.log("upyear");
            console.log(this.state.yearSelect);
        });
    }



    render() {
        return (
            <div>
                <button onClick={this.test.bind(this)}/>
                <YearSelect updateYear={this.handleUpdateYear.bind(this)} />
                <OpportunityBox filteredOptions = {this.state}
                    url='http://localhost:3001/getOpportunitiesListing'
                />
                {/*TODO change the url to get the address bar */}
            </div>
        );
    }
}

export default Opportunities;
