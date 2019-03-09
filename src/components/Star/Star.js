import React, { Component } from 'react';
import PropTypes from 'prop-types';
import yellowstar from '../../images/yellowstar.png';
import greystar from '../../images/greystar.png';

class Star extends Component {
  render(){
    if(sessionStorage.getItem('token_id')) {
      let star = this.props.starred ? yellowstar : greystar;
      return (<img className="logo" src={star} onClick={this.props.update}/>);
    }
    return null;
  }
}

Star.propTypes = {
  starred: PropTypes.bool,
  update: PropTypes.func
};

export default Star;
