import React, { Component } from 'react';
import '../App/App.scss';
import './StudentDashboard.scss';
import axios from 'axios';
import { css } from '@emotion/styled';
import { ClipLoader } from 'react-spinners';
// http://react-icons.github.io/react-icons/fa.html
import User from 'react-icons/lib/fa/user';
import UserTimes from 'react-icons/lib/fa/graduation-cap';
import Newspaper from 'react-icons/lib/fa/newspaper-o';
import Inbox from 'react-icons/lib/fa/inbox';
import Edit from 'react-icons/lib/fa/edit';
import * as Utils from '../../components/Utils';
import DashboardAction from '../../components/DashboardAction/DashboardAction';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import * as ReactGA from 'react-ga';


class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: '',
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);

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
    // const override = css`
	  //   display: block;
	  //   margin: 0 auto;
	  //   border-color: red;
		// `;

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

    const newspaper = <Newspaper />;
    const edit = <Edit />;
    const user = <User />;
    const userTie = <UserTimes />;

    return (
      <div>
        <Navbar current="studentDashboard" />

        <div className="student-dash-container">
          <div className="row">
            <div className="column column-50">
              <div className="dashboard-header">
Welcome back
                {' '}
                {this.state.name}
!
              </div>

              <DashboardAction
                icon={edit}
                iconColor="#A5CCFE"
                text="View Opportunities"
                href="/opportunities"
              />
              <DashboardAction
                icon={userTie}
                iconColor="#F5FEAB"
                text="View & Email Faculty"
                href="/faculty"
              />
              <DashboardAction
                icon={user}
                iconColor="#FEABCD"
                text="Edit Your Profile"
                href="/editprofile"
              />
              <DashboardAction
                icon={newspaper}
                iconColor="#91D781"
                text="Contact Us"
                href="https://docs.google.com/forms/d/e/1FAIpQLSelEuVftvCr9ndS2Cby0Zli2V89PIuqk2FxPzekd5MpSS9HGA/viewform"
              />

            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default StudentDashboard;
