import React, { Component } from 'react';
import axios from 'axios';
import '../ApplicationPage/ApplicationPage.scss';
import './Doc.scss';

type Props = { match: { params: { id: string } } };
type State = { resume: string; loaded: boolean; loadText: string };

class Resume extends Component<Props, State> {
  state: State = {
    resume: '',
    loaded: false,
    loadText: 'Resume is loading...',
  };

  componentDidMount() {
    axios.get(`/api/docs/${this.props.match.params.id}?token=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        this.setState({ resume: response.data, loaded: true });
      })
      .catch((error) => {
        this.setState({ loadText: error.response.data });
      });
  }

  render() {
    const { loaded } = this.state;
    return (
      <div style={{ height: '100%', width: '100%' }}>
        {loaded ? (
          <embed
            style={{ height: window.innerHeight, width: window.innerWidth - 15 }}
            src={`data:application/pdf;base64,${this.state.resume}`}
          />
        )
          : (<h1 style={{ textAlign: 'center' }}>{this.state.loadText}</h1>)}
      </div>
    );
  }
}

export default Resume;
