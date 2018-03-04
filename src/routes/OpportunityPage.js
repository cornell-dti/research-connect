import React, {Component} from 'react';
import axios from 'axios';
import '../OpportunityPage.css';

class OpportunityPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opportunity: {}
        };
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    printQuestions() {
        if (!this.isEmpty(this.state.opportunity.questions)) {
            let keys = [];
            //get all the keys and put them in an array
            for (let k in this.state.opportunity.questions){
                //make sure it's an actual key and not a property that all objects have by default
                if (this.state.opportunity.questions.hasOwnProperty(k)){
                    keys.push(k);
                }
            }
            //sort the keys by their number
            keys.sort((a, b) => {
                //remove the q from "q1" or "q5" based on number of question
                let aNum = a.replace("q","");
                let bNum = b.replace("q", "");
                //if a's numb is less than b's num then return a value less than 0 indicating a comes before b.
                return aNum - bNum;
            });
            let questionMapping = keys.map((key) => {
                    return <div id={key} key={key}>
                        {this.state.opportunity.questions[key]}
                        <br/>
                        <textarea />
                        <br/>
                    </div>
                }
            );
            return <form> {questionMapping} <input className="button" type="submit" value="Submit"/></form>;

        } else {
            return <form> There are no questions. <input className="button" type="submit" value="Submit"/></form>;
        }
    }

    //this runs before the "render and return ( ... ) " runs. We use it to get data from the backend about the opportunity
    componentWillMount() {
        //TODO make this dependent upon browser url not hardcoded
        axios.post('/getOpportunity', {
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
  		var dateObj = new Date(dateString);
  		var month = dateObj.getUTCMonth()+1;
  		var day = dateObj.getUTCDay();
  		var month0 = '';
  		var day0 = '';
  		if (month<10){
  		  month0 = '0';
  		}
  		if (day0<10){
  		  day0='0';
  		}

  		return(month0+ (month).toString()+"/"+day0+(day).toString());
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
            <div className="opportunities-page-wrapper">
            <div className="header"></div>
            <div className="cover-photo"></div>
                <div className="container opportunityListing">
                <div className="row first-row">

                  <div className="title-container column column-65">
                  <div className="title-box">
                    <div className="title-first-col ">
                    <h4>{this.state.opportunity.title}</h4>
                    <h6> Lab Name: {this.state.opportunity.labName}</h6>
                    <h6> PI: {this.state.opportunity.pi}</h6>
                    </div>
                    <div className="title-second-col">
                      <a className="button" href="#Application">Apply</a>
                    <h6> Applications Due {this.convertDate(this.state.opportunity.closes)}</h6>
                    {/*this.checkOpen()*/}

                    </div>
                    </div>
                    <div className="about-box">
                      <h5>About the Position</h5>
                      <h6> Supervisor: {this.state.opportunity.supervisor}</h6>
                      <p>{this.state.opportunity.qualifications}</p>
                      <p>{this.state.opportunity.undergradTasks}</p>

                      <h5>About the Lab</h5>
                      <p> {this.state.opportunity.projectDescription}</p>
                      <h5>Additional Information</h5>
                      <p> {this.state.opportunity.startDate}</p>
                      <p> Must work between { this.state.opportunity.minHours+" " }
                           and { this.state.opportunity.maxHours } hours a week. </p>
                      </div>


                      <div id="Application" className="application-box">
                      <h4>Apply Here: </h4>
                          { this.printQuestions()}
                      </div>
                    </div>

                      <div className="column column-25 qualifications">
                      <div className="qual-title">
                      <h5 > Preferred Qualifications</h5>

                      </div>
                      <hr/>

                      <div className="qual-section">
                          <h6>Graduation Years: </h6>
                          <h6>{this.state.opportunity.yearsAllowed}</h6>
                          </div>
                          <hr/>
                          <div className="qual-section">
                          <h6> Majors: {this.state.opportunity.area}</h6>
                          </div>
                          <hr/>
                            <div className="qual-section">
                          <h6>Minimum GPA: {this.state.opportunity.minGPA}</h6>
                          </div>
                          <hr/>
                            <div className="qual-section">
                          <h6>Courses Taken: </h6>
                          <h6>{this.state.opportunity.requiredClasses}</h6>
                          </div>


                      </div>

                    </div>



                </div>
            </div>
        );
    }
}

export default OpportunityPage;
