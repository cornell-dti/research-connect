import React, { Component } from 'react';
import '../App/App.scss';
import './ProfessorDashboard.scss';
import axios from 'axios';
import { css } from '@emotion/styled';
import { ClipLoader } from 'react-spinners';
import Newspaper from 'react-icons/lib/fa/newspaper-o';
import Inbox from 'react-icons/lib/fa/inbox';
import Edit from 'react-icons/lib/fa/edit';
import * as Utils from '../../components/Utils';
import DashboardAction from '../../components/DashboardAction/DashboardAction';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbars/ProfessorNavbar/ProfessorNavbar';
import * as ReactGA from 'react-ga';



class ProfessorDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      opportunities: [],
      labId: '',
      loading: true,
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);

  }

  componentWillMount() {
    axios.all([
	    axios.get(`/api/role/${sessionStorage.getItem('token_id')}`),
	    axios.get(`/api/applications?id=${sessionStorage.getItem('token_id')}`),
	    axios.get(`/api/labAdmins/lab/${sessionStorage.getItem('token_id')}`),
	  ])
	  .then(axios.spread((role, apps, lab) => {
	  	if (role.data !== 'grad'
				  && role.data !== 'labtech'
				  && role.data !== 'postdoc'
				  && role.data !== 'staffscientist'
				  && role.data !== 'pi') {
      	window.location.href = '/';
        }
        const opps = Object.keys(apps.data);
        opps.unshift('All');
	      this.setState({ apps });
	      this.setState({ opportunities: opps });
	      this.setState({ labId: lab.data });
	  }));
  }

  componentDidMount() {
    this.state.loading = false;
  }

  render() {
    console.log('rendering');
    // const override = css`
	  //   display: block;
	  //   margin: 0 auto;
	  //   border-color: red;
		// `;

    if (this.state.loading) {
      return (
        <div className="sweet-loading">
          <ClipLoader
            // className={override}
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
