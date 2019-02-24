import React, { Component } from 'react';
import '../App/App.scss';
import './StudentDashboard.scss';
import axios from 'axios';
import { css } from 'react-emotion';
import { ClipLoader } from 'react-spinners';
import User from 'react-icons/lib/fa/user';
import Newspaper from 'react-icons/lib/fa/newspaper-o';
import Inbox from 'react-icons/lib/fa/inbox';
import Edit from 'react-icons/lib/fa/edit';
import * as Utils from '../../components/Utils';
import DashboardAction from '../../components/DashboardAction/DashboardAction';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';


class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: '',
    };
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
    const override = css`
	    display: block;
	    margin: 0 auto;
	    border-color: red;
		`;

    if (this.state.loading) {
      return (
        <div className="sweet-loading">
          <ClipLoader
            className={override}
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

    return (
      <div>
        <Navbar current="studentDashboard" />

        <div className="student-dash-container">
          <div className="row">
            <div className="column column-50">
              <div className="dashboard-header">
Welcome back {this.state.name}!
              </div>

              <DashboardAction
                icon={edit}
                iconColor="#A5CCFE"
                text="View opportunities"
                href='/opportunities' />
                <DashboardAction
                icon={ user }
                iconColor="#FEABCD"
                text="Edit your profile"
                href='/editprofile' />
              <DashboardAction
                icon={newspaper}
                iconColor="#91D781"
                text="Contact Us"
                href="https://docs.google.com/forms/d/e/1FAIpQLSelEuVftvCr9ndS2Cby0Zli2V89PIuqk2FxPzekd5MpSS9HGA/viewform"
              />
              {/* <DashboardAction */}
              {/* icon={ edit } */}
              {/* iconColor="#A5CCFE" */}
              {/* text="Edit profile" */}
              {/* href='/editprofile' /> */}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default StudentDashboard;
