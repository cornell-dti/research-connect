import React from 'react';
import PropTypes from 'prop-types';
import yellowstar from '../../images/yellowstar.png';
import greystar from '../../images/greystar.png';
import './Star.scss';

function Star(props) {
  if (sessionStorage.getItem('token_id')) {
    const star = props.starred ? yellowstar : greystar;
    return <img className="star" src={star} onClick={props.update} alt="favorite button" />;
  }
  return null;
}

Star.propTypes = {
  starred: PropTypes.bool.isRequired,
  update: PropTypes.func,
};

export default Star;
