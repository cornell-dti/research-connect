import React, { Component } from 'react';
import '../App/App.scss';
import './ProfessorDashboard.scss';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { FaNewspaper as Newspaper, FaInbox as Inbox, FaEdit as Edit } from 'react-icons/fa';
import * as ReactGA from 'react-ga';
import DashboardAction from '../../components/DashboardAction/DashboardAction';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';

type State = {
  labId: string;
  loading: boolean;
  errorLoadingDataExists?: boolean;
  errorMessage?: string;
};

class ProfessorDashboard extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      labId: '',
      loading: true,
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidMount() {
    this.setState({
      loading: false,
      errorLoadingDataExists: false,
      errorMessage: '',
    });
    axios.all([
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`),
      axios.get(`/api/applications?id=${sessionStorage.getItem('token_id')}`),
      axios.get(`/api/labAdmins/lab/${sessionStorage.getItem('token_id')}`),
    ])
      .then(axios.spread((role, applications, lab) => {
        if (role.data !== 'grad'
          && role.data !== 'labtech'
          && role.data !== 'postdoc'
          && role.data !== 'staffscientist'
          && role.data !== 'pi') {
          window.location.href = '/';
        }
        const opportunities = Object.keys(applications.data);
        opportunities.unshift('All');
        this.setState({ labId: lab.data });
      })).catch((error) => {
        this.setState({
          errorLoadingDataExists: true,
          errorMessage: `We could not find any data for the email and netid
            associated with your account. More info: ${error}`,
        });
      });
  }

  render() {
    if (this.state.loading) {
      const loader = <ClipLoader size={150} color="#ff0000" loading />;
      return <div className="sweet-loading">{loader}</div>;
    }
    if (this.state.errorLoadingDataExists) {
      return <div>{this.state.errorMessage}</div>;
    }

    const newspaper = <Newspaper />;
    const inbox = <Inbox />;
    const edit = <Edit />;

    return (
      <div>
        <Navbar current="professorDashboard" />

        <div className="professor-dash-container">
          <div className="row">
            <div className="column column-50">
              <div className="dashboard-header">Welcome back!</div>
              <DashboardAction
                icon={newspaper}
                iconColor="#91D781"
                text="Post a new opportunity"
                href="/newopp"
              />
              <DashboardAction
                icon={inbox}
                iconColor="#E4CCF5"
                text="View applications to your lab"
                href="/professorView"
              />
              <DashboardAction
                icon={edit}
                iconColor="#A5CCFE"
                text="View or edit your opportunities"
                href={`/opportunities?labId=${this.state.labId}`}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default ProfessorDashboard;
