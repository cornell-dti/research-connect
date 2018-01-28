import React, {Component} from 'react';
import axios from 'axios';
import '../App.css';

class OpportunityPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opportunity: {}
        };
    }

    //this runs before the "render and return ( ... ) " runs. We use it to get data from the backend about the opportunity
    componentWillMount() {
        //TODO make this dependent upon browser url not hardcoded
        axios.post('http://localhost:3001/getOpportunity', {
            id: this.props.match.params.id
            //this is just syntax for getting the id from the url
            //the url is outsite.com/opportunity/:id, meaning :id can be any number. So this syntax gets us that id/number
        })
            .then((response) => {
                this.setState({opportunity: response.data});
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    convertDate(dateString) {
        let dateObj = new Date(dateString);
        return dateObj.toString().slice(0, 15);
    }

    checkOpen() {
        let openDateObj = new Date(this.props.opens);
        let closesDateObj = new Date(this.props.closes);
        let nowTime = Date.now();
        if (closesDateObj.getTime() < nowTime) {
            return "Closed";
        } else if (openDateObj.getTime() > nowTime) {
            return "Not Open Yet";
        } else {
            return "Open";
        }
    }


    render() {
        return (
            <div>
                <div className='opportunityListing'>
                    <h3>{this.state.opportunity.title}</h3>
                    <h4> {this.checkOpen()}</h4>
                    <h4> Supervisor: {this.state.opportunity.supervisor}</h4>
                    <h4> Area: {this.state.opportunity.area}</h4>
                    <h4> Lab Name: {this.state.opportunity.labName}</h4>
                    <h4> PI: {this.state.opportunity.pi}</h4>
                    <h4> Description: {this.state.opportunity.projectDescription}</h4>
                    <h4> Tasks: {this.state.opportunity.undergradTasks}</h4>
                    <h4> Application Window: From {this.convertDate(this.state.opportunity.opens)}
                        to {this.convertDate(this.state.opportunity.closes)}</h4>
                    <h4> Start Date: {this.state.opportunity.startDate}</h4>
                    <h4> Weekly Hours: Between { this.state.opportunity.minHours }
                        and { this.state.opportunity.maxHours } </h4>
                    <h4> Qualifications: </h4>
                    <ul>
                        <li>Minimum GPA: {this.state.opportunity.minGPA}</li>
                        <li>Required Classes: {this.state.opportunity.requiredClasses}</li>
                        <li>Years Allowed: {this.state.opportunity.yearsAllowed}</li>
                        <li>Required minimum semesters: {this.minSemesters}</li>
                        <li>{this.state.opportunity.qualifications}</li>
                    </ul>

                    <h4>Apply Here: </h4>
                    <div>
                        {/*{Object.values(this.state.opportunity.questions)}*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default OpportunityPage;
