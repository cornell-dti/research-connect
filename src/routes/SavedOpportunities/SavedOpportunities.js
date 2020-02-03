import React, { Component } from 'react';
import '../App/App.scss';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import Starred from '../../components/StarredItems/Starred';

class SavedOpportunities extends Component {
  constructor(props) {
    super(props);
  }

  display(t, l) {

  }

  render() {
    return (
      <div>
        <Navbar current="savedops" />
        <div className="student-dash-container">
          <div className="row">
            <div className="column column-10" />
            <div className="column column-80">
              <div className="dashboard-header">
                Your Saved Opportunities
              </div>
              <Starred type="opportunity" display={this.display} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default SavedOpportunities;
