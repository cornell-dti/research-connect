import React, {Component} from 'react';
import Navbar from '../components/StudentNavbar'
import Footer from '../components/Footer';
import '../EditProfile.css';
import '../index.css';
import Pencil from 'react-icons/lib/fa/pencil';
import ExternalLink from 'react-icons/lib/fa/external-link-square';
import Delete from 'react-icons/lib/ti/delete';
import Check from 'react-icons/lib/fa/check';
import Add from 'react-icons/lib/md/add-circle';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          year: 'Sophomore',
          major: 'Computer Science',
          gpa: 3.9,
          relevantCourses: ['CS 2110', 'CS 3410', 'INFO 1300'],
          relevantSkills: ['Java', 'Python', 'HTML', 'CSS','Javascript', 'Excel'],
          editYear: false,
          editMajor: false,
          editGPA: false,
          editCourses: false,
          editSkills: false,
          invalidYear: false,
          invalidMajor: false,
          invalidGPA: false,
          newCourse: "",
          newSkill: ""
        };

        this.displayCourses = this.displayCourses.bind(this);
        this.displaySkills = this.displaySkills.bind(this);
    }

    handleChange(event){
      if (event.target.id=="year"){
        this.setState({year: event.target.value});
      }
      else if (event.target.id=="major"){
        this.setState({major: event.target.value});
      }
      else if (event.target.id=="gpa"){
        this.setState({gpa: event.target.value});
      }
      else if (event.target.id=="new-course"){
        this.setState({newCourse: event.target.value});
      }
      else if (event.target.id=="new-skill"){
        this.setState({newSkill: event.target.value});
      }
    }
    handleEditYear(event){
          var validateYear = ["Freshman", "Sophomore", "Junior", "Senior"]
          if (validateYear.indexOf(this.state.year)==-1){
            this.setState({invalidYear: true});
          }else{
            this.setState({invalidYear: false});
              this.setState({editYear: !this.state.editYear});
          }

    }
    handleEditMajor(event){
      if (this.state.major==""){
        this.setState({invalidMajor: true});
      }else{
        this.setState({invalidMajor: false});
        this.setState({editMajor: !this.state.editMajor});
      }

    }

    handleEditGPA(event){
      if (this.state.gpa==""){
        this.setState({invalidGPA: true});
      }else{
        this.setState({invalidGPA: false});
        this.setState({editGPA: !this.state.editGPA});
      }
    }

    handleEditSkills(event){
        this.setState({editSkills: !this.state.editSkills});
    }

    handleEditCourses(event){
      this.setState({editCourses: !this.state.editCourses});
    }
    handleDeleteCourse(data, e){
      var currentCourses = this.state.relevantCourses;
      var index = currentCourses.indexOf(data);
      currentCourses.splice(index, 1);

      this.setState({relevantCourses: currentCourses});

    }
    addCourse(){
      if (this.state.newCourse!=""){
        var currentCourses = this.state.relevantCourses;
        currentCourses.push(this.state.newCourse);
        this.setState({relevantCourses: currentCourses});
        this.setState({newCourse: ""});
      }
    }
    handleDeleteSkill(data, e){
      var currentSkills = this.state.relevantSkills;
      var index = currentSkills.indexOf(data);
      currentSkills.splice(index, 1);

      this.setState({relevantSkills: currentSkills});
    }

    addSkill(){
      if (this.state.newSkill!=""){
        var currentSkills = this.state.relevantSkills;
        currentSkills.push(this.state.newSkill);
        this.setState({relevantSkills: currentSkills});
        this.setState({newSkill: ""});
      }
    }
    displayCourses(){
      var list = [];
      if (this.state.editCourses){
        for(var i = 0; i < this.state.relevantCourses.length; i++){
          list.push(<div key={i} className="edit-container">
            <div className="editting">
            <p className="course editting" key={this.state.relevantCourses[i]+"edit"}>{this.state.relevantCourses[i]}</p>
            <Delete size={30} id={this.state.relevantCourses[i]} onClick={this.handleDeleteCourse.bind(this, this.state.relevantCourses[i])} className="delete-icon"/>
            </div>
            </div>
          );
        }
        return <div className="display-list" >{list}
              <input className="addTag" onChange={this.handleChange.bind(this)} id="new-course" type="text" name="new-course" key="new-course" placeholder="Add Course" value={this.state.newCourse}/>
              <Add className="add-icon" value={this.state.newCourse} size={22} onClick={this.addCourse.bind(this)}/>
            </div>;
      }else{
        for(var i = 0; i < this.state.relevantCourses.length; i++){
          list.push(<p className="display-list-item course" key={this.state.relevantCourses[i]}>{this.state.relevantCourses[i]}</p>);
        }
        return <div className="display-list">{list}</div>;
      }
    }

    displaySkills(){
      var list = [];
      if (this.state.editSkills){
        for(var i = 0; i < this.state.relevantSkills.length; i++){
          list.push(<div key={i} className="edit-container">
            <div className="editting">
            <p className="skill editting" key={this.state.relevantSkills[i]+"edit"}>{this.state.relevantSkills[i]}</p>
            <Delete size={30} id={this.state.relevantSkills[i]} onClick={this.handleDeleteSkill.bind(this, this.state.relevantSkills[i])} className="delete-icon"/>
            </div>
            </div>
          );
        }
        return <div className="display-list" >{list}
              <input className="addTag" onChange={this.handleChange.bind(this)} id="new-skill" type="text" name="new-skill" key="new-skill" placeholder="Add Skill" value={this.state.newSkill}/>
              <Add className="add-icon" value={this.state.newSkill} size={22} onClick={this.addSkill.bind(this)}/>
            </div>;
      }
      else{
        for(var i = 0; i < this.state.relevantSkills.length; i++){
          list.push(<p className="display-list-item skill" key={this.state.relevantSkills[i]}>{this.state.relevantSkills[i]}</p>);
        }
        return <div className="display-list">{list}</div>;
      }
    }
    render() {
        return (
            <div>
            <Navbar current={"editprofile"}/>
              <div className="profile-page-wrapper container">
              <div className="row">
              <div className="title-box-prof column column-50 column-offset-25">
               <h4>Rachel Nash</h4>

               <h6>rsn55@cornell.edu</h6>
               {this.state.editYear ?
                 <div className="input-div">
                 <input className="year edit-input" type="text" name="year" id="year"
                        value={this.state.year} onChange={this.handleChange.bind(this)}/>
                        <Check  size={25} onClick={this.handleEditYear.bind(this)} className="check-icon"/>
                        {this.state.invalidYear ? "Invalid Year": ""}
                        </div>
                :

               <h5>{this.state.year}<Pencil size={20} className="pencil-icon" onClick={this.handleEditYear.bind(this)}/></h5>

                }
                {this.state.editMajor ?
                  <div className="input-div">
                  <input className="major edit-input" type="text" name="major" id="major"
                         value={this.state.major} onChange={this.handleChange.bind(this)}/>
                         <Check  size={25} onClick={this.handleEditMajor.bind(this)} className="check-icon"/>
                         {this.state.invalidMajor ? "Required": ""}
                         </div>
                 :

                <h5>{this.state.major} <Pencil size={20} className="pencil-icon" onClick={this.handleEditMajor.bind(this)}/></h5>

                 }

              </div>
              </div>


              <div className="row">
              <div className="qual-box column  column-50 column-offset-25">
              <div className="row red-box">
              <h5>Qualifications</h5>
              </div>
              <hr/>
              <div className="row qual-row trans-resume">
                <h5>Resume:</h5>
                <input type="button" className="button viewLink"
                       value="View"/>
                <input type="button" className="button uploadLink"
                              value="Upload New"/>
                  </div>
                <hr/>
                <div className="row qual-row trans-resume">
                <h5>Transcript:</h5>
                <input type="button" className="button viewLink"
                       value="View"/>
                <input type="button" className="button uploadLink"
                              value="Upload New"/>
                  </div>
                <hr/>
                <div className="row qual-row">
                {this.state.editGPA ?
                  <div className="input-div gpa-edit">
                  <h5>GPA: </h5>
                  <input className="gpa edit-input" type="text" name="gpa" id="gpa"
                         value={this.state.gpa} onChange={this.handleChange.bind(this)}/>
                  <Check size={25} onClick={this.handleEditGPA.bind(this)} className="check-icon"/>
                  {this.state.invalidGPA ? <p className="gpa-error">Required</p>: ""}
                  </div>
                 :
                 <div className="gpa-div">
                 <h5>GPA: <span className="clear-offset"></span> {this.state.gpa} <Pencil size={20} className="pencil-icon" onClick={this.handleEditGPA.bind(this)}/> </h5>
                </div>
                 }



                  </div>

                <hr/>
                <div className="row relevant-row">

                <div className="column column-49">
                {this.state.editCourses?
                  <h5>Relevant Courses <Check size={23}   className="check-icon" onClick={this.handleEditCourses.bind(this)}/> </h5>
                  :
                <h5>Relevant Courses <Pencil size={20}   className="pencil-icon" onClick={this.handleEditCourses.bind(this)}/> </h5>
              }
                {this.displayCourses()}
                </div>

                <div className="vl"></div>

                <div className="column column-49">
                {this.state.editSkills?
                  <h5>Relevant Skills <Check size={23}   className="check-icon" onClick={this.handleEditSkills.bind(this)}/> </h5>
                  :
                <h5>Relevant Skills <Pencil size={20}   className="pencil-icon" onClick={this.handleEditSkills.bind(this)}/> </h5>
              }
                {this.displaySkills()}

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

export default EditProfile;
