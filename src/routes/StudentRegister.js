import React, {Component} from 'react';
import axios from 'axios';
import '../App.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../App.css';
import '../StudentRegister.css';

var majorList = ["Africana Studies","Agricultural Sciences","American Studies","Animal Science","Anthropology","Applied Economics and Management","Archaeology","Architecture","Asian Studies","Astronomy","Atmospheric Science","Biological Engineering","Biological Sciences","Biology and Society","Biomedical Engineering","Biometry and Statistics","Chemical Engineering","Chemistry and Chemical Biology","China and Asia-Pacific Studies","Civil Engineering","Classics (Classics, Classical Civ., Greek, Latin)","College Scholar Program","Communication","Comparative Literature","Computer Science","Design and Environmental Analysis","Development Sociology","Economics","Electrical and Computer Engineering","Engineering Physics","English","Entomology","Environmental and Sustainability Sciences","Environmental Engineering","Feminist, Gender & Sexuality Studies","Fiber Science and Apparel Design","Fine Arts","Food Science","French","German","German Area Studies","Global & Public Health Sciences","Government","History","History of Architecture (transfer students only)","History of Art","Hotel Administration School of Hotel Administration","Human Biology, Health and Society","Human Development","Independent Major—Arts and Sciences","Independent Major—Engineering","Industrial and Labor Relations School of Industrial and Labor Relations","Information Science","Information Science, Systems, and Technology","Interdisciplinary Studies","International Agriculture and Rural Development","Italian","Landscape Architecture","Linguistics","Materials Science and Engineering","Mathematics","Mechanical Engineering","Music","Near Eastern Studies","Nutritional Sciences","Operations Research and Engineering","Performing and Media Arts","Philosophy","Physics","Plant Science","Policy Analysis and Management","Psychology","Religious Studies","Science and Technology Studies","Science of Earth Systems","Sociology","Spanish","Statistical Science","Urban and Regional Studies","Viticulture and Enology","Undecided"]
var gradYears = [new Date().getFullYear(), new Date().getFullYear()+1, new Date().getFullYear()+2, new Date().getFullYear()+3]


class StudentRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName : "",
            lastName : "",
            gradYear : "",
            major : "",
            GPA : "",
            netid : "", //TODO currently dummy value
            courses : [],
            file : null
        };
    };

    optionify(inputArray,inputName){
        var newArray = [];
        for( var i = 0; i<inputArray.length; i++){
            newArray.push(<option key={inputArray[i]} value={inputArray[i]}>
                {inputArray[i]}
            </option>);
        }
        var placehold = "Select";
        if (inputName=="gradYear"){
          placehold = "Select Graduation Year";
        } else if (inputName=="major"){
          placehold = "Select Major";
        }

        return ( <select name={inputName} value={inputName} onChange={this.onChange}> <option id={inputName} key="empty" value="">{placehold}</option> {newArray} </select>);
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

    createGpaOptions() {
      var options = [];
      for(var i=25; i<=43; i++){
        options.push( <option key={i} value={(i/10).toString()} >{(i/10).toString()}</option>);
      }
      console.log(this.state.GPA);
      return (
        <select name="GPA" id="GPA" className="gpa-select" value={this.state.GPA} onChange={this.onChange}>
          <option key="" value="" >Select GPA</option>
          {options}
        </select>
      );
    }

    onSubmit = (e) => {
        e.preventDefault();
        // get our form data out of state
        const { firstName, lastName, gradYear, major, GPA, netid, courses,file } = this.state;

        axios.post('http://localhost:3001/createUndergrad', { firstName, lastName, gradYear, major, GPA, netid, courses, file })
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
          <Navbar/>
            <div className="student-reg-form">
              <h3>Student Registration</h3>
                    <form id = "studentForm" onSubmit = {this.onSubmit}>
                        <input placeholder="First Name" type="text" name="firstName" value={firstName} id="firstName" onChange={this.onChange}/>
                        <br/>
                            <input type="text" placeholder="Last Name" name="lastName" value={lastName} id="lastName" onChange={this.onChange}/>
                        <br/>
                            {this.optionify(gradYears,"gradYear")}
                        <br/>
                            {this.optionify(majorList,"major")}
                        <br/>

                        {this.createGpaOptions()}

                        <label>

                            <textarea placeholder="Relevant Courses (separate with commas)" name="courses" value={courses} id="courses" onChange={this.onChange}/>
                        </label>
                        <br/>

                        <br/>
                        <input type="submit" className="button" onClick={console.log(this.state)} value="Submit" />
                    </form>

            </div>
              <Footer/>
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
