import React, {Component} from 'react';
import axios from 'axios';
import '../App.css';
import Dropzone from 'react-dropzone';

var majorList = ["Africana Studies","Agricultural Sciences","American Studies","Animal Science","Anthropology","Applied Economics and Management","Archaeology","Architecture","Asian Studies","Astronomy","Atmospheric Science","Biological Engineering","Biological Sciences","Biology and Society","Biomedical Engineering","Biometry and Statistics","Chemical Engineering","Chemistry and Chemical Biology","China and Asia-Pacific Studies","Civil Engineering","Classics (Classics, Classical Civ., Greek, Latin)","College Scholar Program","Communication","Comparative Literature","Computer Science","Design and Environmental Analysis","Development Sociology","Economics","Electrical and Computer Engineering","Engineering Physics","English","Entomology","Environmental and Sustainability Sciences","Environmental Engineering","Feminist, Gender & Sexuality Studies","Fiber Science and Apparel Design","Fine Arts","Food Science","French","German","German Area Studies","Global & Public Health Sciences","Government","History","History of Architecture (transfer students only)","History of Art","Hotel Administration School of Hotel Administration","Human Biology, Health and Society","Human Development","Independent Major—Arts and Sciences","Independent Major—Engineering","Industrial and Labor Relations School of Industrial and Labor Relations","Information Science","Information Science, Systems, and Technology","Interdisciplinary Studies","International Agriculture and Rural Development","Italian","Landscape Architecture","Linguistics","Materials Science and Engineering","Mathematics","Mechanical Engineering","Music","Near Eastern Studies","Nutritional Sciences","Operations Research and Engineering","Performing and Media Arts","Philosophy","Physics","Plant Science","Policy Analysis and Management","Psychology","Religious Studies","Science and Technology Studies","Science of Earth Systems","Sociology","Spanish","Statistical Science","Urban and Regional Studies","Viticulture and Enology","Undecided"]
var gradYears = [new Date().getFullYear(), new Date().getFullYear()+1, new Date().getFullYear()+2, new Date().getFullYear()+3]


class StudentRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName : "Andy",
            lastName : "Xiao",
            gradYear : 2020,
            major : "Computer Science",
            GPA : 3.3,
            netid : "zx55", //TODO currently dummy value
            courses : ["CS 2110"],
            resume : [],
            transcript : [],
        };
    };


    onDropResume = acceptedFiles => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                var fileAsBinaryString = reader.result;
                var encodedData = window.btoa(fileAsBinaryString);
                // do whatever you want with the file content
                this.setState({resume : [encodedData]})
            };
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');

            reader.readAsBinaryString(file);
        });
        document.getElementById("resume").innerHTML = "Resume Dropped!";
    }

    onDropTranscript = acceptedFiles => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                var fileAsBinaryString = reader.result;
                var encodedData = window.btoa(fileAsBinaryString);
                // do whatever you want with the file content
                this.setState({transcript : [encodedData]})
            };
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');

            reader.readAsBinaryString(file);
        });
        document.getElementById("transcript").innerHTML = "Transcript Dropped!";
    }

    optionify(inputArray,inputName){
        var newArray = [];
        for( var i = 0; i<inputArray.length; i++){
            newArray.push(<option key={inputArray[i]} value={inputArray[i]}>
                {inputArray[i]}
            </option>);
        }
        return ( <select name={inputName} value={[inputName]} onChange={this.onChange}> <option id={inputName} key="empty" value="">Select</option> {newArray} </select>);
    }

    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        var state = this.state
        if (e.target.name != "courses") {
            this.setState({[e.target.name]: e.target.value});
            if(e.target.name=="gradYear" || e.target.name=="major") {
                var a = e.target.name;
                document.getElementById(a).innerHTML = [e.target.value];
            }
        }
        else{
            this.setState({[e.target.name]: (e.target.value).replace(/ /g, '').split(",")});
        }
    }

    onFormChange = (e) => {
        this.setState({file : e.target.value})
    }

    onSubmit = (e) => {
        e.preventDefault();
        // get our form data out of state
        const { firstName, lastName, gradYear, major, GPA, netid, courses, resume, transcript } = this.state;

        axios.post('/createUndergrad', { firstName, lastName, gradYear, major, GPA, netid, courses, resume })
            .then((result) => {
                //access the results here....
            });

        if (this.state.resume.length != 0){
            axios.post('/createTranscript', { netid, transcript })
                .then((result) => {
                    //access the results here....
                });
        }

        axios.post('/testResume', { firstName, lastName, gradYear, major, GPA, netid, courses, resume, transcript })
            .then((result) => {
                //access the results here....
            });

        axios.post('/storeResume', { firstName, lastName, gradYear, major, GPA, netid, courses, resume, transcript })
            .then((result) => {
                //access the results here....
            });
    }

    render() {
        console.log("Hello World");
        const { firstName, lastName, gradYear, major, GPA, netid, courses, resume, transcript } = this.state;
        return (
            <div>
                <form id = "studentForm" onSubmit = {this.onSubmit}>
                    <label>
                        *First Name:
                        <input type="text" name="firstName" value={firstName} id="firstName" onChange={this.onChange}/>
                    </label>
                    <br/>
                    <label>
                        *Last Name:
                        <input type="text" name="lastName" value={lastName} id="lastName" onChange={this.onChange}/>
                    </label>
                    <br/>
                    <label>
                        *Grad Year:
                        {this.optionify(gradYears,"gradYear")}
                    </label>
                    <br/>
                    <label>
                        *Major:
                        {this.optionify(majorList,"major")}
                    </label>
                    <br/>
                    <label>
                        *GPA:
                        <input type="number" step="0.01" name="GPA" value={GPA} id="GPA" onChange={this.onChange}/>
                    </label>
                    <br/>
                    <label>
                        *Relevant Courses (separate with commas):
                        <input type="text" name="courses" value={courses} id="courses" onChange={this.onChange}/>
                    </label>
                    <br/>

                    <div className="dropzone">
                        <h2>*Resume: </h2>
                        <Dropzone onDrop={this.onDropResume.bind(this)}>
                            <p>Click to drop resume</p>
                        </Dropzone>
                    </div>
                    <aside>
                        <ul>
                            <li id="resume"></li>
                        </ul>
                    </aside>

                    <br/>

                    <div className="dropzone">
                        <h2>Transcript:</h2>
                        <Dropzone onDrop={this.onDropTranscript.bind(this)}>
                            <p>Click to drop transcript</p>
                        </Dropzone>
                    </div>
                    <aside>
                        <ul>
                            <li id="transcript"></li>
                        </ul>
                    </aside>
                    <p> *Required fields</p>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }


}

export default StudentRegister;