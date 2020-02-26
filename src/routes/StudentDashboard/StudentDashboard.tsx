import React, { Component } from 'react';
import '../App/App.scss';
import './StudentDashboard.scss';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import * as ReactGA from 'react-ga';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/StudentNavbar/StudentNavbar';
import Starred from '../../components/StarredItems/Starred';

class StudentDashboard extends Component<{}, { loading: boolean; name: string }> {
  constructor(props: {}) {
    super(props);
    this.state = { loading: true, name: '' };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidMount() {
    axios.all([
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`),
      axios.get(`/api/undergrads/token/${sessionStorage.getItem('token_id')}`),
    ])
      .then(axios.spread((role, res) => {
        if (role.data !== 'undergrad') {
          window.location.href = '/';
        }
        const info = res.data[0];
        this.setState({ name: info.firstName, loading: false });
      }));
  }

  render() {
    if (this.state.loading) {
      const style = { display: 'block', margin: 0, borderColor: 'red' };
      // @ts-ignore
      const loader = <ClipLoader style={style} sizeUnit="px" size={150} color="#ff0000" loading />;
      return <div className="sweet-loading">{loader}</div>;
    }

    return (
      <div>
        <Navbar current="studentDashboard" />
        <div className="student-dash-container">
          <div className="row">
            <div className="column column-10" />
            <div className="column column-80">
              <div className="dashboard-header">
                {`Welcome back, ${this.state.name}!`}
              </div>
              <div className="bottom">
                <Starred type="opportunity" limit={3} label="Your Saved Opportunities" />
                <Starred type="faculty" limit={3} label="Your Saved Faculty" />
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
