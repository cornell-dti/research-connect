import React, { Component } from 'react';
import './Star.scss';
import PropTypes from 'prop-types';

class Star extends Component {
  render(){
    if(sessionStorage.getItem('token_id')) {
        return (
            this.props.starred ? 
            <input type="checkbox" class="star" onClick={this.props.update} checked/> :
            <input type="checkbox" class="star" onClick={this.props.update} />
        );
    }
    return null;
  }
}

Star.propTypes = {
  starred: PropTypes.bool,
  update: PropTypes.func
};

export default Star;
