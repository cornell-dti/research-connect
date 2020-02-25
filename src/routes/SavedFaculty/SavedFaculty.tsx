import React from 'react';
import '../App/App.scss';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import Starred from '../../components/StarredItems/Starred';

export default () => (
  <div>
    <Navbar current="savedfac" />
    <div className="student-dash-container">
      <div className="row">
        <div className="column column-10" />
        <div className="column column-80">
          <div className="dashboard-header">Your Saved Faculty</div>
          <Starred type="faculty" display={() => {}} />
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
