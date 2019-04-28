import React, { Component } from 'react';
import '../App/App.scss';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import Starred from '../../components/StarredItems/Starred';

class SavedFaculty extends Component {
  constructor(props) {
    super(props);
  }

  display(t,l){
    return;
  }

  render() {
    return (
      <div>
        <Navbar current="studentDashboard" />
        <div className="student-dash-container">
          <div className="row">
          <div className="column column-10"></div>
            <div className="column column-80">
              <div className="dashboard-header">
                Your Saved Faculty
              </div>
              <Starred type="faculty" display={this.display}/>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default SavedFaculty;
