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
            netid: "",
            courses: [],
            file: null
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
        if (inputName == "gradYear") {
            placehold = "Select Graduation Year";
        } else if (inputName == "major") {
            placehold = "Select Major";
        }

        return (<select name={inputName} value={inputName} onChange={this.onChange}>
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
                this.setState({resume: [encodedData]})
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
                this.setState({transcript: [encodedData]})
            };
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');

            reader.readAsBinaryString(file);
        });
        document.getElementById("transcript").innerHTML = "Transcript Dropped!";
    }

    onChange = (e) => {
        // Because we named the inputs to match their corresponding values in state, it's
        // super easy to update the state
        var state = this.state
        if (e.target.name != "courses") {
            this.setState({[e.target.name]: e.target.value});
            if (e.target.name == "gradYear" || e.target.name == "major") {
                var a = e.target.name;
                document.getElementById(a).innerHTML = [e.target.value];
            }
        }
        else {
            this.setState({[e.target.name]: (e.target.value).replace(/ /g, '').split(",")});
        }
    }

    onFormChange = (e) => {
        this.setState({file: e.target.value})
    }

    createGpaOptions() {
        var options = [];
        for (var i = 25; i <= 43; i++) {
            options.push(<option key={i} value={(i / 10).toString()}>{(i / 10).toString()}</option>);
        }
        return (
            <select name="GPA" id="GPA" className="gpa-select" value={this.state.GPA} onChange={this.onChange}>
                <option key="" value="">Select GPA</option>
                {options}
            </select>
        );
    }

    onSubmit = (e) => {
        e.preventDefault();
        // get our form data out of state
        const {firstName, lastName, gradYear, major, GPA, netid, courses, resume, transcript} = this.state;

        // axios.get('/api/opportunities/check/9102401rjqlfk?netId="zx55"')
        //     .then(function (response) {
        //         console.log(response);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

        let oneRan = false;
        let getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;
        axios.post('/api/undergrads', {firstName, lastName, gradYear, major, GPA, netid, courses})
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
                        <input placeholder="First Name" type="text" name="firstName" value={firstName} id="firstName"
                               onChange={this.onChange}/>
                        <br/>
                        <input type="text" placeholder="Last Name" name="lastName" value={lastName} id="lastName"
                               onChange={this.onChange}/>
                        <br/>
                        {this.optionify(gradYears, "gradYear")}
                        <br/>
                        {this.optionify(majorList, "major")}
                        <br/>

                        {this.createGpaOptions()}

                        <label>

                            <textarea placeholder="Relevant courses taken and taking (separate with commas)"
                                      name="courses"
                                      value={courses} id="courses" onChange={this.onChange}/>
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
                        <br/>
                        <input type="submit" className="button" value="Submit"/>
                    </form>

                </div>
                <Footer/>
            </div>
        );
    }
}

export default StudentRegister;
