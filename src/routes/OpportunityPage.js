import React, {Component} from 'react';
import axios from 'axios';
import '../OpportunityPage.css';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';
import CheckBox from 'react-icons/lib/fa/check-square-o';
import CrossCircle from 'react-icons/lib/fa/exclamation-circle';

class OpportunityPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opportunity: {},
            questionAnswers: {},
            submitted: false

        };
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }


    handleChange(key){
      let answersCopy = JSON.parse(JSON.stringify(this.state.questionAnswers))
      answersCopy[key] = document.getElementsByName(key)[0].value;
       this.setState({
       questionAnswers: answersCopy
      });

    }
    printQuestions() {
        console.log(this.state.questionAnswers)
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
                        <textarea name={key} key={key} onChange={this.handleChange.bind(this, key)}/>
                        <br/>
                    </div>
                }
            );
            return <form onSubmit={this.handleAppSubmit.bind(this)}> {questionMapping} <input className="button" type="submit" value="Submit"/></form>;

        } else {
            return <form onSubmit={this.handleAppSubmit.bind(this)}> There are no questions. <input className="button" type="submit" value="Submit"/></form>;
        }
    }

    handleAppSubmit(){
      this.setState({submitted:true});
    }
    //this runs before the "render and return ( ... ) " runs. We use it to get data from the backend about the opportunity
    componentWillMount() {
        axios.post('/getOpportunity', {
            id: this.props.match.params.id
            //this is just syntax for getting the id from the url
            //the url is outsite.com/opportunity/:id, meaning :id can be any number. So this syntax gets us that id/number
        })
            .then((response) => {
                this.setState({opportunity: response.data});
                console.log("test");
                console.log(this.props.match.params.id);
                console.log(this.state.opportunity);
                if (!this.isEmpty(response.data)) {
                    var obj = {}
                    //get all the keys and put them in an array
                    for (let k in response.data.questions){
                        //make sure it's an actual key and not a property that all objects have by default
                        if (response.data.questions.hasOwnProperty(k)){
                            obj[k]='';
                        }
                    }

                    this.setState({questionAnswers: obj});
                  }


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

    parseArrayToList(yearsArray){

       var yearDivArray = []
       if (yearsArray){
         var trackYear = false;
      if (yearsArray.includes("freshman")){
         yearDivArray.push(<div key="f"><CheckBox className="greenCheck"/><span key="fresh"> Freshman</span></div>)
         trackYear= true;
       }
      if (yearsArray.includes("sophomore") ){
      yearDivArray.push(<div key="s"><CheckBox className="greenCheck"/><span key="soph"> Sophomore</span></div>)
      trackYear= true;
      }
      if (yearsArray.includes("junior")){
        yearDivArray.push(<div key="j"><CheckBox className="greenCheck"/><span key="junior"> Junior</span></div>)
        trackYear= true;
      }
      if (yearsArray.includes("senior")){
        yearDivArray.push(<div k="s"><CheckBox className="greenCheck"/><span key="sen"> Senior</span></div>)
        trackYear= true;
      }
      if (!trackYear){
        if (yearsArray.length==0){
            yearDivArray.push(<div key="none"><CheckBox key="no" className="greenCheck"/><span key="n"> No Preference</span></div>);
        }
        for (var i=0;i<yearsArray.length;i++){
          yearDivArray.push(<div key={i+yearsArray[0]+"div"}><CheckBox key={i+yearsArray[0]+"check"} className="greenCheck"/><span key={i+yearsArray[0]+"span"}> {yearsArray[i]}</span></div>);
        }
      }
    }


      return <ul>{yearDivArray}</ul>;
    }


    render() {
        return (
          <div>
          <Navbar/>
            <div className="opportunities-page-wrapper">
            <div className="cover-photo"></div>
                <div className="container opportunityListing">
                <div className="row first-row">

                  <div className="title-container column column-65">
                  <div className="title-box">
                    <div className="title-first-col ">
                    <h4>{this.state.opportunity.title}</h4>
                    <h6> Lab: {this.state.opportunity.labName}</h6>
                    <h6> Principal Investigator: {this.state.opportunity.pi}</h6>
                    </div>
                    <div className="title-second-col">
                      <a className="apply-button button" href="#Application">Apply</a>
                    <h6> Applications Due {this.convertDate(this.state.opportunity.closes)}</h6>
                    {/*this.checkOpen()*/}

                    </div>
                    </div>
                    <div className="about-box">
                      <h5>About the Position</h5>
                      <p> Supervisor: {this.state.opportunity.supervisor}</p>
                      <p> Qualifications: {this.state.opportunity.qualifications}</p>
                      <p> Tasks: {this.state.opportunity.undergradTasks}</p>
                      <p> Start Season: {this.state.opportunity.startSeason} {this.state.opportunity.startYear}</p>
                      <p> Must work between { this.state.opportunity.minHours+" " }
                           and { this.state.opportunity.maxHours } hours a week. </p>
                           <p> Project Description: {this.state.opportunity.projectDescription}</p>

                      <h5>About the Lab</h5>
                      <a href={this.state.opportunity.labPage}>{this.state.opportunity.labPage}</a>
                      <p>{this.state.opportunity.labDescription}</p>

                      </div>


                      <div id="Application" className="application-box">
                      <h4>Apply Here: </h4>
                      <br/>
                          { !this.state.submitted ? this.printQuestions(): <p>You have applied to this position.</p> }
                      </div>
                    </div>

                      <div className="column column-25 qualifications">
                      <div className="qual-title">
                      <h5 > Preferred Qualifications</h5>

                      </div>
                      <hr/>

                      <div className="qual-section">
                        {/* TODO: Have a checkmark next to qualifications that a candidate meets based on netID*/}
                          <h6>Year: </h6>
                          {this.parseArrayToList(this.state.opportunity.yearsAllowed)}
                          </div>
                          <hr/>
                          <div className="qual-section">
                          <h6> Major:</h6>
                            {this.parseArrayToList(this.state.opportunity.areas)}
                          </div>
                          <hr/>
                            <div className="qual-section">
                            <h6>GPA: </h6>
                          <p><CheckBox className="greenCheck"/><span> {this.state.opportunity.minGPA}</span></p>
                          </div>
                          <hr/>
                            <div className="qual-section">
                          <h6>Courses: </h6>
                          {this.parseArrayToList(this.state.opportunity.requiredClasses)}
                          </div>


                      </div>

                    </div>



                </div>
            </div>
    
            </div>
        );
    }
}

export default OpportunityPage;
