import React from 'react';
import yellowstar from '../../images/yellowstar.png';
import greystar from '../../images/greystar.png';
import './Star.scss';

function Star(props: { starred: boolean; update: (event: any) => void }) {
  if (sessionStorage.getItem('token_id')) {
    const star = props.starred ? yellowstar : greystar;
    return <img className="star" src={star} onClick={props.update} alt="favorite button" />;
  }
  return null;
}

export default Star;
