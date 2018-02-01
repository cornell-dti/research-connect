import React, {Component} from 'react';
import axios from 'axios';
import '../App.css';

class CreateOppForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creatorNetId: '',
            title: '',
            area: [], //required, area(s) of research (molecular bio, bioengineering, electrical engineering, computer science, etc.)
            labName: '',    //required
            labId: '',  //required
            pi: '', //required
            supervisor: '', //can be null

            numQuestions: 0

        };

        this.handleChange = this.handleChange.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        if (event.target.name == "labName") {
            this.setState({labName: event.target.value});
        } else if (event.target.name == "netID") {
            this.setState({creatorNetId: event.target.value});
        } else if (event.target.name == "title") {
            this.setState({title: event.target.value});
        } else if (event.target.name == "area") {
            this.setState({area: event.target.value});
        } else if (event.target.name == "pi") {
            this.setState({pi: event.target.value});
        } else if (event.target.name == "supervisor") {
            this.setState({supervisor: event.target.value});
        }


    }

    handleSubmit(event) {
        alert('NetID:' + this.state.creatorNetId + ' labName: ' + this.state.labName);
        event.preventDefault();
    }

    addQuestion(event) {
        this.setState({numQuestions: this.state.numQuestions + 1});

    }

    deleteLastQuestion(event) {
        this.setState({numQuestions: this.state.numQuestions - 1});
    }

    makeBoxes() {
        var questionBoxes = [];
        for (var i = 0; i < this.state.numQuestions; i++) {
            questionBoxes.push(<input type="text"/>);
            questionBoxes.push(<br />);

        }
        return (
            <div>
                {questionBoxes}
            </div>
        );
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label className="createOppLabel">
                        Your NetID:
                        <input type="text" name="netID" value={this.state.creatorNetId} onChange={this.handleChange}/>
                    </label>
                    <br/>
                    <select>
                        <option></option>
                    </select>
                    <label className="createOppLabel">
                        Lab Page:
                        <input type="text" name="labName" value={this.state.labName} onChange={this.handleChange}/>
                    </label>
                    <br/>
                    <label className="createOppLabel">
                        Title:
                        <input type="text" name="title" value={this.state.title} onChange={this.handleChange}/>
                    </label>
                    <br/>
                    <label className="createOppLabel">
                        Area:
                        <input type="text" name="area" value={this.state.area} onChange={this.handleChange}/>
                    </label>
                    <br/>
                    <label className="createOppLabel">
                        PI:
                        <input type="text" name="pi" value={this.state.pi} onChange={this.handleChange}/>
                    </label>
                    <br/>
                    <label className="createOppLabel">
                        Supervisor:
                        <input type="text" name="supervisor" value={this.state.supervisor}
                               onChange={this.handleChange}/>
                    </label>
                    <br/>
                    <input type="button" value="Add a question" onClick={this.addQuestion}/>
                    <br/>
                    {this.makeBoxes()}
                    {this.state.numQuestions != 0 ? <input type="button" value="Delete a question"
                                                           onClick={this.deleteLastQuestion.bind(this)}/> : '' }
                    <br/>
                    <input type="submit" value="Submit"/>

                </form>
                <form ref='storeResume'
                      id='storeResume'
                      action='http://localhost:3001/storeResume'
                      method='post'
                      encType="multipart/form-data">
                    <input type="file" name="resume"/>
                    <input type='submit' value='Upload!'/>
                </form>
            </div>
        );
    }
}

export default CreateOppForm;
