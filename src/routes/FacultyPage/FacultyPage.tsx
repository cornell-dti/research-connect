import React, { Component, ReactElement } from 'react';
import './FacultyPage.scss';
import axios from 'axios';
import '../OpportunityPage/OpportunityPage.scss';

import * as ReactGA from 'react-ga';
// @ts-ignore
import Linkify from 'react-linkify';
import VariableNavbar from '../../components/Navbars/VariableNavbar';
import * as Utils from '../../components/Utils';
import Footer from '../../components/Footer/Footer';
import Star from '../../components/Star/Star';

/**
 * @param props should be awards=this.state.profInfo.awards
 */
const ListItems = (props: { pub?: boolean; items: string[] }): ReactElement => {
  if (!props.items || props.items.length === 0 || !Array.isArray(props.items)) {
    return (
      <React.Fragment>
        {props.pub
          ? 'Check the professor\'s website at the top of this page or Google Scholar to find papers they\'ve written.'
          : 'Not listed'}
      </React.Fragment>
    );
  }
  // remove � characters when mapping
  return (
    <React.Fragment>
      {props.items.map((item) => <p key={item}>{item.replace(/\uFFFD/g, '')}</p>)}
    </React.Fragment>
  );
};

type AcceptingMessageProps = {
  acceptingStatus: 'yes' | 'no' | 'maybe' | 'unknown';
  researchStatus?: string[];
}

function AcceptingMessage({ acceptingStatus, researchStatus }: AcceptingMessageProps) {
  const status = [];
  if (acceptingStatus === 'yes') {
    status.push(
      <p>
        <b>Accepting: </b>
        This professor is currently open to working with undergrads this
        semester.
        If you meet the qualifications below, then apply by emailing the
        professor.
        See the sidebar on the right for email writing tips.
        <b>
          Please note that this may change if the professor reaches their capacity
          for the number of undergrads they can take this semester.
        </b>
      </p>,
    );
  } else if (acceptingStatus === 'no') {
    status.push(
      <p>
        <b>Not Accepting: </b>
        This professor does not plan to work with undergrads this semester,
        {'so it\'s not worth asking to do research with them. This could change in future semesters.'}
      </p>,
    );
  } else if (acceptingStatus === 'maybe') {
    status.push(
      <p>
        <b>Possibly Accepting: </b>
        This professor indicated that they may work with undergrads
        {'this semester, but there\'s also a chance that they won\'t work with any.'}
        You can still email the professor if their work seems interesting. See
        the sidebar on the right for email writing tips.
      </p>,
    );
  } else {
    status.push(
      <p>
        <b>Unknown: </b>
        We have no information on whether this professor plans to
        work with undergrads this semester. You can still email the professor
        if their work seems interesting. See the sidebar on the right for
        email writing tips.
      </p>,
    );
  }
  if (researchStatus && researchStatus.length > 0) {
    // status.push(<span>Undergrad Research Status: </span>);
    status.push(researchStatus);
  }
  status.push(<p>Last updated: January 2020.</p>);
  return <div>{status}</div>;
}

type Props = { match: { params: { id: string } } };
type State = { profInfo: any; starred: boolean; role: string | null };

class FacultyPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profInfo: {},
      starred: false,
      role: null,
    };
    ReactGA.initialize('UA-69262899-9');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  star = () => {
    const token_id = sessionStorage.getItem('token_id');
    const type = 'faculty';
    const { id } = this.props.match.params;

    axios.post('/api/undergrads/star', { token_id, type, id })
      .then((response) => {
        if (response && response.data) {
          const stars = response.data;
          this.setState({ starred: stars.includes(id) });
        }
      });
  };

  // this runs before the "render and return ( ... ) " runs. We use it to get data from the backend about the faculty member
  componentDidMount() {
    axios.get(`/api/faculty/${this.props.match.params.id}`)
      .then((response) => {
        this.setState({ profInfo: response.data });
      })
      .catch((error) => {
        Utils.handleTokenError(error);
      });
    axios.get(`/api/undergrads/star?type=faculty&token_id=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        const { data } = response;
        this.setState({ starred: data.includes(this.props.match.params.id) });
      });

    if (!sessionStorage.getItem('token_id')) {
      this.setState({ role: null });
    } else {
      axios.get(`/api/role/${sessionStorage.getItem('token_id')}`)
        .then((response) => {
          // if they don't have a role or it's just not showing up for some reason, go to home page
          // remove this line if you want anybody to be able to view opportunity page
          if (!response || response.data === 'none' || !response.data) {
            this.setState({ role: null });
          } else {
            this.setState({ role: response.data });
          }
        })
        .catch((error) => Utils.handleTokenError(error));
    }
  }

  separateInterests = (list: string[]) => {
    let separated = '';
    if (list != null) {
      for (let i = 0; i < list.length; i++) {
        if (i === (list.length - 1)) {
          separated += list[i];
        } else {
          separated += list[i];
          separated += ', ';
        }
      }
    }
    return separated;
  };

  render() {
    const noInfoMessage = 'No description provided';
    return (
      <div>
        <VariableNavbar role={this.state.role} current="facultysearch" />
        <div className="opportunities-page-wrapper">
          <div className={`wallpaper ${!this.state.role ? 'wallpaper-no-sign-in' : ''}`} />

          <div className="row opportunity-row">
            <div className="column opp-details-column">
              <div className="row opp-title-card">
                <div className="column column-20">
                  <img alt="faculty" src={this.state.profInfo.photoId} width="150px" />
                </div>
                <div className="column column-5" />
                <div className="column column-75">
                  <h3>
                    <b>{this.state.profInfo.name}</b>
                    <Star
                      update={this.star}
                      starred={this.state.starred}
                    />
                  </h3>

                  <p>
                    {`${this.state.profInfo.title} in ${this.state.profInfo.department} at `}
                    {this.state.profInfo.labName ? this.state.profInfo.labName : ' Cornell'}
                  </p>
                  <p>
                    Areas of Interest:
                    {' '}

                    {(this.state.profInfo.researchInterests && this.state.profInfo.researchInterests.length !== 0)
                      ? this.separateInterests(this.state.profInfo.researchInterests) : 'None found'}
                  </p>
                  <div className="row">
                    <div className="column column-60">
                      <h6>
                        Office:
                        {' '}
                        {this.state.profInfo.office ? this.state.profInfo.office : 'Unknown'}
                      </h6>
                    </div>


                    <div className="column column-60">
                      <h6>
                        Email:
                        {' '}
                        <a
                          href={this.state.profInfo.email ? `mailto:${this.state.profInfo.email}` : ''}
                        >
                          {this.state.profInfo.email ? this.state.profInfo.email : 'Unknown'}
                        </a>
                      </h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="column column-60">
                      <h6>
                        Phone:
                        {' '}
                        {this.state.profInfo.phone ? this.state.profInfo.phone : 'Unknown'}
                        {' '}

                      </h6>
                    </div>


                    <div className="column column-60">
                      <h6>
                        Website:
                        {' '}
                        <b>
                          <a
                            href={this.state.profInfo.labPage ? this.state.profInfo.labPage : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {this.state.profInfo.labPage ? 'View page' : 'None'}
                          </a>
                        </b>
                      </h6>
                    </div>
                  </div>
                </div>

              </div>

              <div className="row">
                <div className="opp-details-card">
                  <div className="opp-details-section">
                    <div className="header">Doing Research With This Professor</div>
                    <p>
                      <AcceptingMessage
                        acceptingStatus={this.state.profInfo.accepting}
                        researchStatus={this.state.profInfo.researchStatus}
                      />
                    </p>
                  </div>
                  {(this.state.profInfo.researchStatus === '' && this.state.profInfo.accepting !== 'yes') ? ''
                    : (
                      <div className="opp-details-section">
                        <div className="header">Qualifications</div>
                        <Linkify properties={{ target: '_blank' }}>
                          <p>
                            {this.state.profInfo.qualifications
                              ? this.state.profInfo.qualifications
                              : 'This professor did not explicitly specify any qualifications, '
                              + 'but that does not mean that there are none.'}
                          </p>
                        </Linkify>
                      </div>
                    )}
                </div>
              </div>

              <div className="row">
                <div className="opp-details-card">
                  <div className="opp-details-section">
                    <div className="header">About</div>
                    <p>
                      {this.state.profInfo.researchDescription && this.state.profInfo.researchDescription.length > 0
                        ? this.state.profInfo.researchDescription : noInfoMessage}
                    </p>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Bio</div>
                    <p>
                      {this.state.profInfo.bio && this.state.profInfo.bio.length > 0 ? this.state.profInfo.bio
                        : 'No bio provided'}
                    </p>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Teaching</div>
                    <p>
                      {this.state.profInfo.teaching ? this.state.profInfo.teaching : noInfoMessage}
                    </p>
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Awards</div>
                    <ListItems items={this.state.profInfo.awards} />
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Education</div>
                    <ListItems items={this.state.profInfo.education} />
                  </div>
                  <div className="opp-details-section">
                    <div className="header">Publications</div>
                    <ListItems items={this.state.profInfo.publications} pub />
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="opp-qualifications">
                <div className="opp-qual-title">
                  <div>Finding Research & Email Writing Tips</div>
                </div>

                <hr />

                <div className="opp-qual-section">
                  <h6 className="header">How Do I Find Research?</h6>
                  One way is by writing emails to professors whose work seems interesting (see below for template).
                  {'You could also go to the professor\'s office and ask them about their research and'}
                  then express your interest in working with them. See our
                  {' '}
                  <a href="/guide">{' "How to Find Research" '}</a>
                  {' '}
                  section for more info.
                </div>

                <div className="opp-qual-section">
                  <h6 className="header">What to Write?</h6>
                  1st Paragraph: Your name, year, major, and some expression of interest in a
                  specific paper or topic of theirs. Use their papers, website link (top of page) or
                  other info on this page to understand their research and mention those details.
                  <br />
                  {'2nd Paragraph: Say you\'re interested in opportunities in their lab, talk about'}
                  your experience in this area if applicable.
                  <br />
                  {'3rd Paragraph: Include a link to your resume (and transcript if you\'d like).'}
                </div>

                <hr />

                <div className="opp-qual-section">
                  <h6 className="header">Is It Too Early To Reach Out For [Summer/Fall/Spring] Research?</h6>
                  No; worst case scenario they tell you to ping them in a month or so
                  {'and now you\'ve demonstrated interest.'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default FacultyPage;
