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
            files : []
        };
    };


    onDrop = acceptedFiles => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                var fileAsBinaryString = reader.result;
                var encodedData = window.btoa(fileAsBinaryString);
                // do whatever you want with the file content
                this.setState({files : [encodedData]})
            };
            reader.onabort = () => console.log('file reading was aborted');
            reader.onerror = () => console.log('file reading has failed');

            reader.readAsBinaryString(file);
        });
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
        const { firstName, lastName, gradYear, major, GPA, netid, courses,files } = this.state;

        axios.post('/createUndergrad', { firstName, lastName, gradYear, major, GPA, netid, courses, files })
            .then((result) => {
                //access the results here....
            });

        axios.post('/testResume', { firstName, lastName, gradYear, major, GPA, netid, courses, files })
            .then((result) => {
                //access the results here....
            });

        axios.post('/storeResume', { firstName, lastName, gradYear, major, GPA, netid, courses, files })
            .then((result) => {
                //access the results here....
            });
    }

    previewFile() {
        var preview = document.querySelector('img');
        var file    = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();

        reader.addEventListener("load", function () {
            preview.src = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    render() {
        console.log("Hello World");
        const { firstName, lastName, gradYear, major, GPA, netid, courses,file } = this.state;
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
                            <Dropzone onDrop={this.onDrop.bind(this)}>
                                <p>Try dropping some files here, or click to select files to upload.</p>
                            </Dropzone>
                        </div>
                        <aside>
                            <h2>Dropped files</h2>
                            <ul>
                                {
                                    this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                                }
                            </ul>
                        </aside>
                        /* <form enctype="multipart/form-data" method="post" name="fileinfo">
                            <label>File to stash:</label>
                            <input type="file" name="file" onChange={this.onFormChange}/><br/>
                            <input type="submit" id="formInput" value="Stash the file!"/>
                        </form> */
                        <br/>
                        <p> *Required fields</p>
                        <input type="submit" value="Submit" />
                    </form>
            </div>
        );
    }

    /*
    updateAndSend(){
        var serialize = require('form-serialize');
        var form = document.querySelector('#studentForm');
        var obj = serialize(form, { hash: true });
        console.log("PAY ATTENTION HERE");
        console.log(obj);
        // this.setState({
        //     firstName : obj.firstName,
        // lastName : obj.lastName,
        // gradYear : obj.gradYear,
        // major : obj.major,
        // GPA : obj.GPA,
        // netid : "zx55 TODO", //TODO current dummy content
        // courses : obj.courses
        // }, () => {
        //     axios.post('http://localhost:3001/createUndergrad', this.state)
        //
        // });
        this.state.firstName = obj.firstName;
        this.state.lastName = obj.lastName;
        this.state.gradYear = obj.gradYear;
        this.state.major = obj.major;
        this.state.GPA = obj.GPA;
        this.state.netid = "zx55 TODO"; //TODO current dummy content
        this.state.courses = obj.courses;

        axios.post('http://localhost:3001/createUndergrad',{

            firstName : this.state.firstName,
            lastName : this.state.lastName,
            gradYear : this.state.gradYear,
            major : this.state.major,
            GPA : this.state.GPA,
            netid : this.state.netid, //TODO current dummy content
            courses : this.state.courses
        })
    }
    */


}

export default StudentRegister;
