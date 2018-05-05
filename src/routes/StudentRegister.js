import React, {Component} from 'react';
import axios from 'axios';
import '../App.css';
import Navbar from '../components/StudentNavbar';
import Footer from '../components/Footer';
import '../App.css';
import Dropzone from 'react-dropzone';
import '../StudentRegister.css';

var majorList = ["Africana Studies", "Agricultural Sciences", "American Studies", "Animal Science", "Anthropology", "Applied Economics and Management", "Archaeology", "Architecture", "Asian Studies", "Astronomy", "Atmospheric Science", "Biological Engineering", "Biological Sciences", "Biology and Society", "Biomedical Engineering", "Biometry and Statistics", "Chemical Engineering", "Chemistry and Chemical Biology", "China and Asia-Pacific Studies", "Civil Engineering", "Classics (Classics, Classical Civ., Greek, Latin)", "College Scholar Program", "Communication", "Comparative Literature", "Computer Science", "Design and Environmental Analysis", "Development Sociology", "Economics", "Electrical and Computer Engineering", "Engineering Physics", "English", "Entomology", "Environmental and Sustainability Sciences", "Environmental Engineering", "Feminist, Gender & Sexuality Studies", "Fiber Science and Apparel Design", "Fine Arts", "Food Science", "French", "German", "German Area Studies", "Global & Public Health Sciences", "Government", "History", "History of Architecture (transfer students only)", "History of Art", "Hotel Administration School of Hotel Administration", "Human Biology, Health and Society", "Human Development", "Independent Major—Arts and Sciences", "Independent Major—Engineering", "Industrial and Labor Relations School of Industrial and Labor Relations", "Information Science", "Information Science, Systems, and Technology", "Interdisciplinary Studies", "International Agriculture and Rural Development", "Italian", "Landscape Architecture", "Linguistics", "Materials Science and Engineering", "Mathematics", "Mechanical Engineering", "Music", "Near Eastern Studies", "Nutritional Sciences", "Operations Research and Engineering", "Performing and Media Arts", "Philosophy", "Physics", "Plant Science", "Policy Analysis and Management", "Psychology", "Religious Studies", "Science and Technology Studies", "Science of Earth Systems", "Sociology", "Spanish", "Statistical Science", "Urban and Regional Studies", "Viticulture and Enology", "Undecided"]
var gradYears = [new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2, new Date().getFullYear() + 3]


class StudentRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            gradYear: "",
            major: "",
            GPA: "",
            netId: "",
            email: "",
            courses: [],
            file: null,
            resume: null,
            transcript: null,
            firstNameValid: false,
            lastNameValid: false,
            gradYearValid: false,
            majorValid: false,
            GPAValid: false,
            resumeValid: false,
            triedSubmitting: false

        };
    };

    optionify(inputArray, inputName) {
        var newArray = [];
        for (var i = 0; i < inputArray.length; i++) {
            newArray.push(<option key={inputArray[i]} value={inputArray[i]}>
                {inputArray[i]}
            </option>);
        }
        var placehold = "Select";
        var validName;
        if (inputName == "gradYear") {
            placehold = "Select Graduation Year";
            validName = this.state.gradYearValid
        } else if (inputName == "major") {
            placehold = "Select Major";
            validName = this.state.majorValid

        }

        return (<select className={!validName && this.state.triedSubmitting ? "error left-input" : "left-input"}
                        name={inputName} value={inputName} onChange={this.onChange}>
            <option id={inputName} key="empty" value="">{placehold}</option>
            {newArray} </select>);
    }

    onDropResume = acceptedFiles => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                var fileAsBinaryString = reader.result;
                var encodedData = window.btoa(fileAsBinaryString);
                // do whatever you want with the file content
                this.setState({resume: file})
                this.setState({resumeValid: true})
            };
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');

            reader.readAsBinaryString(file);
        });


    }

    onDropTranscript = acceptedFiles => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                var fileAsBinaryString = reader.result;
                var encodedData = window.btoa(fileAsBinaryString);
                // do whatever you want with the file content
                this.setState({transcript: file})
            };
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');

            reader.readAsBinaryString(file);
        });

    }

    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        var state = this.state
        var name = e.target.name;
        if (name != "courses") {
            var validationName = name + "Valid";
            this.setState({[name]: e.target.value});
            if (name == "gradYear" || name == "major") {
                document.getElementById(name).innerHTML = [e.target.value];

            }
            if (e.target.value != "") {
                this.setState({[validationName]: true});
            } else {
                this.setState({[validationName]: false});
            }
        }
        else {
            this.setState({[e.target.name]: (e.target.value).replace(/ /g, '').split(",")});
        }
    };


    createGpaOptions() {
        var options = [];
        for (var i = 25; i <= 43; i++) {
            options.push(<option key={i} value={(i / 10).toString()}>{(i / 10).toString()}</option>);
        }
        return (
            <select name="GPA" id="GPA"
                    className={!this.state.GPAValid && this.state.triedSubmitting ? "error gpa-select left-input" : "gpa-select left-input"}
                    value={this.state.GPA} onChange={this.onChange}>
                <option key="" value="">Select GPA</option>
                {options}
            </select>
        );
    }

    onSubmit = (e) => {
        e.preventDefault();
        // get our form data out of state
        const {
            firstName, lastName, gradYear, major, GPA, netId, email, courses, resume, transcript,
            firstNameValid,
            lastNameValid,
            gradYearValid,
            majorValid,
            GPAValid,
            resumeValid,
            triedSubmitting
        } = this.state;

        // axios.get('/api/opportunities/check/9102401rjqlfk?netId="zx55"')
        //     .then(function (response) {
        //         console.log(response);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
        if (firstNameValid && lastNameValid && gradYearValid && majorValid && GPAValid && resumeValid) {
            let oneRan = false;
            let getUrl = window.location;
            var baseUrl = getUrl.protocol + "//" + getUrl.host;
            axios.post('/api/undergrads', {firstName, lastName, gradYear, major, GPA, netId, email, courses})
                .then((result) => {
                    console.log("undergrad created, result:");
                    console.log(result);
                    //access the results here....
                    if (this.state.transcript.length != 0) {
                        axios.post('/api/docs', {netid, transcript})
                            .then((result) => {
                                if (oneRan) {
                                    window.location.replace(baseUrl + "/opportunities");
                                }
                                else {
                                    oneRan = true;
                                }
                            });
                    }

                    axios.post('/api/docs', {netid, resume})
                        .then((result) => {
                            if (oneRan) {
                                window.location.replace(baseUrl + "/opportunities");
                            }
                            else {
                                oneRan = true;
                            }
                            console.log("resume result");
                            console.log(result);
                        });
                });
        }
    };


    render() {
        const {firstName, lastName, gradYear, major, GPA, netid, courses, resume, transcript} = this.state;
        if (this.state.netid === "") {
            axios.get('/api/decrypt?token=' + sessionStorage.getItem("token_id")).then(res => {
                this.setState({netid: res.data});
                console.log("res data!");
                console.log(res.data);
            });
        }
        return (
            <div>
                <Navbar/>
                <div className="student-reg-form">
                    <h3>Student Registration</h3>
                    <form id="studentForm" onSubmit={this.onSubmit}>
                        <input
                            className={!this.state.firstNameValid && this.state.triedSubmitting ? "error left-input" : "left-input"}
                            placeholder="First Name" type="text" name="firstName" value={firstName} id="firstName"
                            onChange={this.onChange}/>

                        <input
                            className={!this.state.lastNameValid && this.state.triedSubmitting ? "error left-input" : "left-input"}
                            type="text" placeholder="Last Name" name="lastName" value={lastName} id="lastName"
                            onChange={this.onChange}/>


                        {this.optionify(gradYears, "gradYear")}

                        {this.optionify(majorList, "major")}


                        {this.createGpaOptions()}

                        <label>

                            <textarea className="left-input"
                                      placeholder="Relevant courses past and present (separate with commas, i.e. CS 1110, BIOMG 1350)"
                                      name="courses"
                                      value={courses} id="courses" onChange={this.onChange}/>
                        </label>

                        <div className="dropzone">

                            <Dropzone className="edit-drop" style={{
                                position: 'relative',
                                background: '#ededed',
                                padding: '10px',
                                width: '50%',
                                margin: '0 0 0 25%',
                                border: !this.state.resumeValid && this.state.triedSubmitting ? '3px #b31b1b solid' : '1px dashed black'
                            }} onDrop={this.onDropResume.bind(this)}>
                                <p>Click/drag to drop resume (required)</p>

                            </Dropzone>
                            <div className="uploaded-message">
                                {resume != null ? <p>Uploaded: {resume.name}</p> : ""}
                            </div>
                        </div>


                        <br/>

                        <div className="dropzone">

                            <Dropzone className="edit-drop" style={{
                                position: 'relative',
                                background: '#ededed',
                                padding: '10px',
                                width: '50%',
                                margin: '0 25%',
                                border: '1px dashed black'
                            }} onDrop={this.onDropTranscript.bind(this)}>
                                <p>Click/drag to drop transcript (optional)</p>

                            </Dropzone>
                            <div className="uploaded-message">
                                {transcript != null ? <p >Uploaded: {transcript.name}</p> : ""}
                            </div>
                        </div>

                        <br/>
                        <div className="centered">
                            <input type="submit" className="button" value="Submit"/>
                        </div>
                    </form>

                </div>
                <Footer/>
            </div>
        );
    }
}

export default StudentRegister;