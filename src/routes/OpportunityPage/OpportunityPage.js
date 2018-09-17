import React, {Component} from 'react';
import axios from 'axios';
import './OpportunityPage.scss';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar'
import ProfessorNavbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar'
import Footer from '../../components/Footer/Footer';
import CheckBox from 'react-icons/lib/fa/check-square-o';
import CrossCircle from 'react-icons/lib/fa/minus-circle';
import * as Utils from '../../components/Utils.js'

//Utils.gradYearToString(2020) == "Sophomore"


class OpportunityPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opportunity: {},
            questionAnswers: {},
            submitted: false,
            triedSubmitting: false,
            student: null,
            coverLetter: '',
            netId: 'unknown',
            role: ''
        };

        this.parseClasses = this.parseClasses.bind(this);
        this.parseMajors = this.parseMajors.bind(this);
        this.parseYears = this.parseYears.bind(this);
        this.parseGPA = this.parseGPA.bind(this);

    }

    isEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }


    handleChange(key) {
        let answersCopy = JSON.parse(JSON.stringify(this.state.questionAnswers));
        answersCopy[key] = document.getElementsByName(key)[0].value;
        this.setState({
            questionAnswers: answersCopy
        });

    }

    coverChange(event) {
        this.setState({coverLetter: event.target.value});
        let answersCopy = JSON.parse(JSON.stringify(this.state.questionAnswers));
        answersCopy['coverLetter'] = event.target.value;
        this.setState({
            questionAnswers: answersCopy
        });
    }


    handleAppSubmit = (e) => {

        e.preventDefault();
        this.setState({triedSubmitting: true});

        // get our form data out of state
        const {opportunity, questionAnswers, submitted, triedSubmitting, student, coverLetter, netId} = this.state;
        // if (coverLetter) {
            let allQsAnswered = true;
            for (let key in questionAnswers) {
                if (questionAnswers[key] == '') {
                    let allQsAnswered = false;
                }
            }
            if (allQsAnswered === true) {
                this.setState({submitted: true});
                console.log("submitting form");
                let opportunityId = opportunity._id;
                let responses = questionAnswers;
                axios.post('/api/applications', {opportunityId, netId, responses})
                    .then((result) => {
                        console.log(result);
                    }).catch(function (error) {
                    Utils.handleTokenError(error);
                });

            }

        // }
    };
    //this runs before the "render and return ( ... ) " runs. We use it to get data from the backend about the opportunity
    componentWillMount() {
        console.log(this.props.match.params.id);
        axios.get('/api/opportunities/' + this.props.match.params.id + '?netId=' + sessionStorage.getItem('token_id'))
            .then((response) => {
                this.setState({opportunity: response.data});
                this.setState({student: response.data.student});
                if (!this.isEmpty(response.data)) {
                    let obj = {};
                    //get all the keys and put them in an array
                    for (let k in response.data.questions) {
                        //make sure it's an actual key and not a property that all objects have by default
                        if (response.data.questions.hasOwnProperty(k)) {
                            obj[k] = '';
                        }
                    }

                    this.setState({questionAnswers: obj});
                }
            })
            .catch(function (error) {
                Utils.handleTokenError(error);
            });
        axios.get('/api/undergrads/' + sessionStorage.getItem('token_id'))
            .then((response) => {
                if (!this.isEmpty(response.data)) {
                    this.setState({netId: response.data[0].netId});
                }
            })
            .catch(function (error) {
                Utils.handleTokenError(error);
            });
    }

    printQuestions() {
        if (!this.isEmpty(this.state.opportunity.questions)) {
            let keys = [];
            //get all the keys and put them in an array
            for (let k in this.state.opportunity.questions) {
                //make sure it's an actual key and not a property that all objects have by default
                if (this.state.opportunity.questions.hasOwnProperty(k)) {
                    keys.push(k);
                }
            }

            //sort the keys by their number
            keys.sort((a, b) => {
                //remove the q from "q1" or "q5" based on number of question
                let aNum = a.replace("q", "");
                let bNum = b.replace("q", "");
                //if a's numb is less than b's num then return a value less than 0 indicating a comes before b.
                return aNum - bNum;
            });

            let questionMapping = keys.map((key) => {
                    return <div id={key} key={key}>
                        {this.state.opportunity.questions[key]}
                        <br/>
                        <textarea style={{"min-height": "16rem"}} name={key} key={key} onChange={this.handleChange.bind(this, key)}/>
                        <br/>
                    </div>
                }
            );
            return <form onSubmit={this.handleAppSubmit.bind(this)}> {questionMapping}
                {/*Cover Letter: Describe why you{"'"}re interested in this lab/position in particular, as well as how any*/}
                    {/*qualifications you have will help you excel in this lab. Please be concise.*/}
                {/*<textarea value={this.state.coverLetter} onChange={this.coverChange.bind(this)}*/}
                          {/*className="cover-letter"></textarea>*/}
                <input className="button" type="submit" value="Submit"/>
            </form>;

        } else {

            return <form onSubmit={this.handleAppSubmit.bind(this)}>
                {/*Cover Letter: Describe why you{"'"}re interested in this lab/position in particular, as well as how any*/}
                {/*qualifications you have will help you excel in this lab. Please be concise.*/}
                {/*<textarea value={this.state.coverLetter} onChange={this.coverChange.bind(this)} className="cover-letter"></textarea>*/}
                <input className="button" type="submit" value="Submit"/></form>;
        }
    }

    convertDate(dateString) {
        let dateObj = new Date(dateString);
        let month = dateObj.getUTCMonth() + 1;
        let day = dateObj.getUTCDay();
        let month0 = '';
        let day0 = '';
        if (month < 10) {
            month0 = '0';
        }
        if (day0 < 10) {
            day0 = '0';
        }

        return (month0 + (month).toString() + "/" + day0 + (day).toString());
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

    parseYears(yearsArray) {

        let yearDivArray = []
        if (yearsArray) {
            let trackYear = false;
            if (yearsArray.includes("freshman")) {
                if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === "Freshman") {
                    yearDivArray.push(<div key="f"><CheckBox className="greenCheck"/><span key="fresh"> Freshman</span>
                    </div>)
                }
                else {
                    yearDivArray.push(<div key="f"><CrossCircle className="cross"/><span key="fresh"> Freshman</span>
                    </div>)
                }
                trackYear = true;
            }
            if (yearsArray.includes("sophomore")) {
                if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === "Sophomore") {
                    yearDivArray.push(<div key="so"><CheckBox className="greenCheck"/><span > Sophomore</span></div>)
                }
                else {
                    yearDivArray.push(<div key="so"><CrossCircle className="cross"/><span > Sophomore</span></div>)
                }
                trackYear = true;
            }
            if (yearsArray.includes("junior")) {
                if (this.state.student  && Utils.gradYearToString(this.state.student.gradYear) === "Junior") {
                    yearDivArray.push(<div key="j"><CheckBox className="greenCheck"/><span > Junior</span></div>)
                } else {
                    yearDivArray.push(<div key="j"><CrossCircle className="cross"/><span > Junior</span></div>)

                }
                trackYear = true;
            }
            if (yearsArray.includes("senior")) {
                if (this.state.student && Utils.gradYearToString(this.state.student.gradYear) === "Senior") {
                    yearDivArray.push(<div key="se"><CheckBox className="greenCheck"/><span > Senior</span></div>)
                } else {
                    yearDivArray.push(<div key="se"><CrossCircle className="cross"/><span > Senior</span></div>)

                }
                trackYear = true;
            }
            if (trackYear) {
                return <ul>{yearDivArray}</ul>;
            }
            else {
                return <ul>
                    <div key="n"><CheckBox className="greenCheck"/><span> No Preference</span></div>
                </ul>
            }
        }

    }

    parseMajors(arrayIn) {
        let returnArray = [];
        if (arrayIn) {
            if (arrayIn.length === 0) {
                returnArray.push(<div key="none"><CheckBox key="no" className="greenCheck"/><span
                    key="n"> No Preference</span></div>);
            }
            for (let i = 0; i < arrayIn.length; i++) {
                if (this.state.student != null && this.state.student.major.indexOf(arrayIn[i]) != -1) {
                    returnArray.push(<div key={i}><CheckBox className="greenCheck"/><span > {arrayIn[i]}</span></div>);
                }
                else {
                    returnArray.push(<div key={i}><CrossCircle className="cross"/><span > {arrayIn[i]}</span></div>);

                }
            }
            return <ul>{returnArray}</ul>;
        }
    }

    parseClasses(arrayIn) {
        let returnArray = []
        if (arrayIn) {
            if (arrayIn.length === 0) {
                returnArray.push(<div key="none"><CheckBox key="no" className="greenCheck"/><span
                    key="n"> No Preference</span></div>);
            }
            for (let i = 0; i < arrayIn.length; i++) {
                if (this.state.student != null && this.state.student.courses.indexOf(arrayIn[i]) != -1) {
                    returnArray.push(<div key={i}><CheckBox className="greenCheck"/><span> {arrayIn[i]}</span></div>);
                }
                else {
                    returnArray.push(<div key={i}><CrossCircle className="cross"/><span> {arrayIn[i]}</span></div>);
                }
            }
            return <ul>{returnArray}</ul>;
        }
    }

    parseGPA(gpa) {
        //if minGPA is falsy or falls in range
        if (!this.state.minGPA || (this.state.student && this.state.opportunity && this.state.opportunity.minGPA <= this.state.student.gpa)) {
            return <p key={0}><CheckBox className="greenCheck"/><span> {this.state.opportunity.minGPA ? this.state.opportunity.minGPA : "No Preference"}</span></p>;
        }
        else {
            return <p key={1}><CrossCircle className="cross"/><span> {this.state.opportunity.minGPA}</span></p>;
        }

    }

    componentDidMount() {
        axios.get('/api/role/' + sessionStorage.getItem('token_id'))
            .then((response) => {
                //if they don't have a role or it's just not showing up for some reason, go to home page
                //remove this line if you want anybody to be able to view opportunity page
                if (!response || response.data === "none" || !response.data) {
                    alert("You must be signed in to view this.");
                    window.location.href = '/';
                }
                else {
                    this.setState({role: response.data});
                }
            })
            .catch(function (error) {
                Utils.handleTokenError(error);
            });
    }


    render() {
        const notProvidedMessage = "Not specified";
        return (
            <div>
                {this.state.role === "undergrad" ? <Navbar/> : <ProfessorNavbar/>}
                <div className="opportunities-page-wrapper">
                    <div className="cover-photo"></div>
                    <div className="container opportunityListing">
                        <div className="row first-row">

                            <div className="title-container column column-65">
                                <div className="title-box">
                                    <div className="title-first-col ">
                                        <h4>{this.state.opportunity.title}</h4>
                                        <h6> Lab: {this.state.opportunity.labName}</h6>
                                        {/*<h6> Professor: {this.state.opportunity.pi}</h6>*/}
                                    </div>
                                    <div className="title-second-col">
                                        <a className="apply-button button" href="#Application">Apply</a>
                                        <h6> Applications Due {this.convertDate(this.state.opportunity.closes)}</h6>
                                        {/*this.checkOpen()*/}

                                    </div>
                                </div>
                                <div className="about-box">
                                    <h5> Supervisor:</h5> <p>{this.state.opportunity.supervisor ? this.state.opportunity.supervisor : notProvidedMessage}</p>
                                    <h5> Qualifications:</h5> <p>{this.state.opportunity.qualifications ? this.state.opportunity.qualifications : notProvidedMessage}</p>
                                    <h5> Tasks:</h5> <p>{this.state.opportunity.undergradTasks ? this.state.opportunity.undergradTasks : notProvidedMessage}</p>
                                    <h5> Start Season:</h5>
                                    <p>{this.state.opportunity.startSeason ? this.state.opportunity.startSeason : "(Season not specified) "} {this.state.opportunity.startYear ? this.state.opportunity.startYear : "(Year not specified)"}</p>
                                    <h5> Weekly Hours:</h5> <p>{ this.state.opportunity.minHours ? this.state.opportunity.minHours + " " : "No minimum "}
                                    - { this.state.opportunity.maxHours ? this.state.opportunity.maxHours + " " : "No maximum" } hours a week. </p>
                                    <h5> Project Description:</h5> <p>{this.state.opportunity.projectDescription ? this.state.opportunity.projectDescription : notProvidedMessage}</p>
                                    <h5>Lab:</h5>
                                    {/*<a href={this.state.opportunity.labPage}>{this.state.opportunity.labName}</a>*/}
                                    <p>{this.state.opportunity.labDescription}</p>

                                </div>


                                <div id="Application" className="application-box">
                                    <h4>Apply Here: </h4>
                                    <div className="error-div">
                                        { this.state.triedSubmitting && !this.state.submitted ?
                                            <p className="app-error-message">Please answer all questions in order to
                                                submit.</p> : '' }
                                    </div>
                                    { !this.state.submitted ? this.printQuestions() :
                                        <p>You have applied to this position.</p> }

                                </div>
                            </div>

                            <div className="column column-25 qualifications">
                                <div className="qual-title">
                                    <h5 > Preferred Qualifications</h5>

                                </div>
                                <hr/>

                                <div className="qual-section">
                                    <h6>Year: </h6>
                                    {this.parseYears(this.state.opportunity.yearsAllowed)}
                                </div>
                                <hr/>
                                <div className="qual-section">
                                    <h6> Major:</h6>
                                    {this.parseMajors(this.state.opportunity.majorsAllowed)}
                                </div>
                                <hr/>
                                <div className="qual-section">
                                    <h6>GPA: </h6>
                                    { this.parseGPA(this.state.opportunity.minGPA)}
                                </div>
                                <hr/>
                                <div className="qual-section">
                                    <h6>Courses: </h6>
                                    {this.parseClasses(this.state.opportunity.requiredClasses)}
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
