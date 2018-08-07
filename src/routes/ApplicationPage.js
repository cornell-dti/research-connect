import React, {Component} from 'react';
import axios from 'axios';
import Navbar from '../components/ProfNavbar';
import '../ApplicationPage.css';
import EmailDialog from '../components/Shared/EmailDialog.js';
import Footer from '../components/Footer';
import * as Utils from '../components/Shared/Utils.js'
import ExternalLink from 'react-icons/lib/fa/external-link';
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left';


class ApplicationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            application: [],
            opportunity: [],
            resumeId: ""
        };
    }

    componentWillMount() {
        //'netId': sessionStorage.getItem('netId')
        //'netId': 'prk57' // TODO change back to above
        axios.get('/api/applications?id=' + sessionStorage.getItem('token_id') + '&netId=' + 'prk57')
            .then((response) => {
                console.log("response.data!");
                console.log(response.data);
                for (let opp in response.data) {
                    for (let app in response.data[opp].applications) {
                        let curApp = response.data[opp].applications[app];
                        let curOpp = response.data[opp].opportunity;
                        if (curApp !== undefined) {
                            if (curApp.id === this.props.match.params.id) {
                                this.setState({application: curApp, opportunity: curOpp});
                                console.log(this.state.opportunity);
                                console.log(this.state.application);
                                axios.get('/api/undergrads/la/' + this.state.application.undergradNetId + '?tokenId=' + sessionStorage.getItem('token_id'))
                                    .then((response) => {
                                        // document.location.href ='/doc/' + response.data.resumeId;
                                        this.setState({"resumeId": response.data.resumeId});
                                        let transcriptIdText = response.data.transcriptId != null ? "" : response.data.transcriptId;
                                        this.setState({"transcriptId": transcriptIdText})
                                    }).catch(function (error) {
                                    Utils.handleTokenError(error);
                                });
                            }
                        }
                    }
                }
            }).catch(function (error) {
            Utils.handleTokenError(error);
        });
    }

    toDivList(lst) {
        let i = 0;
        let res = [];
        for (i in lst) {
            res.push(
                <div key={ i }>
                    { lst[i] }
                </div>
            );
        }
        return res;
    }

    renderTranscript() {
        console.log("transcriptid: " + this.state.transcriptId);
        if (!this.state.transcriptId) {
            return null;
        }
        else {
            return (
                <div>
                    <div className="app-qual-section">
                        <div className="resume-link">
                            <a href={this.state.transcriptId} target="_blank"><h6 className="no-margin">View Transcript
                                <ExternalLink
                                    className="red-link"/>
                            </h6></a>
                        </div>

                    </div>
                    < hr/>
                </div>
            )
        }
    }

    render() {
        let questionsAndResponses = [];
        const responses = this.state.application.responses;
        const questions = this.state.opportunity.questions;
        let c = 0;
        for (let question in responses) {
            questionsAndResponses.push(
                <div className="question-and-response" key={ c++ }>
                    <div className='question'>{ questions[question] ? questions[question] : "Cover Letter"}</div>
                    <div className='response'>{ responses[question] }</div>
                </div>
            );
        }

        return (
            <div>
                <Navbar/>
                <div className="application-page-container">
                    <div className="button-bar-container">
                        <div className="return-to-apps">
                            <FaLongArrowLeft className="black-arrow"/><a href="/professorView">Return to View All
                            Applications</a>
                        </div>
                        <div className="row button-bar">
                            <div className="column column-33 left-button">
                                <EmailDialog buttonText="Mark as Accepted" opp={ this.state.opportunity }
                                             app={ this.state.application }/>
                            </div>

                            <div className="column column-33 center-button">
                                <EmailDialog buttonText="Edit & Send Interview Email" opp={ this.state.opportunity }
                                             app={ this.state.application }/>
                            </div>

                            <div className="column column-33 right-button">
                                <EmailDialog buttonText="Mark as Rejected" opp={ this.state.opportunity }
                                             app={ this.state.application }/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column column-75">
                            <div className="row application-page-info">
                                <div className="column">
                                    <div className="row app-page-info-top-row">
                                        <div className="column app-info-left">
                                            <div
                                                className="name">{ this.state.application.firstName }, { this.state.application.lastName }</div>
                                            <div
                                                className="email">{ this.state.application.undergradNetId }@cornell.edu
                                            </div>
                                        </div>
                                        <div className="column app-info-right">
                                            <div className="date-applied">Date
                                                Applied: { Utils.convertDate(this.state.application.timeSubmitted) }</div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="column app-info-left">
                                            <div
                                                className="grad-year">{ Utils.gradYearToString(this.state.application.gradYear) }</div>
                                            <div className="major">{ this.state.application.major }</div>
                                        </div>
                                        <div className="column app-info-right">
                                            <div className="status">Status: { this.state.application.status }</div>
                                            <div className="opportunity">Position Applied
                                                To: { this.state.opportunity.title }</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row application-page-responses">
                                <div className="column">
                                    <div className="responses-header">Application Responses</div>
                                    { questionsAndResponses }
                                </div>
                            </div>
                        </div>
                        <div className="column column-25">
                            <div className="app-qualifications">
                                <div className="app-qual-title">
                                    <h5>Qualifications</h5>
                                </div>

                                <hr/>

                                <div className="app-qual-section">
                                    <div className="resume-link">
                                        <a href={"/doc/" + this.state.resumeId} target="_blank"><h6
                                            className="no-margin">
                                            View Resume <ExternalLink className="red-link"/></h6></a>
                                    </div>
                                </div>

                                <hr />
                                {this.renderTranscript()}

                                <div className="app-qual-section">
                                    <h6>GPA</h6>
                                    { this.state.application.gpa }
                                </div>

                                <hr/>

                                <div className="app-qual-section">
                                    <h6>Relevant Courses</h6>
                                    { this.toDivList(this.state.application.courses) }
                                </div>

                                <hr/>

                                <div className="app-qual-section">
                                    <h6>Skills</h6>
                                    { this.toDivList(this.state.application.skills) }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default ApplicationPage;
