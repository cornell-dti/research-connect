import React, { Component } from 'react';
import '../App/App.scss';
import './StudentDashboard.scss';
import axios from 'axios';
import { css } from '@emotion/styled';
import { ClipLoader } from 'react-spinners';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import * as ReactGA from 'react-ga';
import Starred from '../../components/StarredItems/Starred';

class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: ''
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  display(t, l){
    return (
      <div className="node-list-div">
        <a href={`/saved${t}`}>View all {l}</a>
      </div>
    );
  }

  componentWillMount() {
    axios.all([
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`),
      axios.get(`/api/undergrads/${sessionStorage.getItem('token_id')}`),
    ])
      .then(axios.spread((role, res) => {
        if (role.data !== 'undergrad') {
          window.location.href = '/';
        }
        const info = res.data[0];
        this.setState({ name: info.firstName });
        if (this.state.name == '') {
          console.log("Looks like we didn't load it");
        } else {
          console.log('We did load it :D');
        }
      }));
  }

  componentDidMount() {
    this.state.loading = false;
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="sweet-loading">
          <ClipLoader
            style = {{display: "block",
            margin: 0,
            borderColor: "red"}}
            sizeUnit="px"
            size={150}
            color="#ff0000"
            loading={this.state.loading}
          />
        </div>
      );
    }

    return (
      <div>
        <Navbar current="studentDashboard" />

        <div className="student-dash-container">
          <div className="row">
            <div className="column column-50">
              <div className="dashboard-header">
                Welcome back, {this.state.name}!
              </div>

              <div>
                <div>
                  Your Saved Opportunities
                </div>
                <Starred
                  type="opportunity"
                  limit={5}
                  display={this.display}
                />
              </div>
              <div>
                <div>
                  Your Saved Faculty
                </div>
                <Starred
                  type="faculty"
                  limit={5}
                  display={this.display}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default StudentDashboard;
