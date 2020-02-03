import React, { Component } from 'react';
import axios from 'axios';
import '../ApplicationPage/ApplicationPage.scss';
import './Doc.scss';

class Resume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resume: '',
      loaded: false,
      loadText: 'Resume is loading...',
    };
  }

  componentWillMount() {
    axios.get(`/api/docs/${this.props.match.params.id}?token=${sessionStorage.getItem('token_id')}`)
      .then((response) => {
        console.log('response!');
        console.log(response);
        this.setState(
          {
            resume: response.data,
            loaded: true,
          },
        );
        console.log(response.data);
      })
      .catch((error) => {
        this.setState({
          loadText: error.response.data,
        });
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
