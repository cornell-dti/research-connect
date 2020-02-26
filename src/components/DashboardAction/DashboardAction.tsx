import React, { Component } from 'react';
import './DashboardAction.scss';
import { FaAngleRight as AngleRight } from 'react-icons/fa';

type Props = { icon: JSX.Element; iconColor: string; text: string; href: string; };

class DashboardAction extends Component<Props> {
  performAction = () => {
    window.location.href = this.props.href;
  };

  render() {
    return (
      <div className="dash-action-wrapper" onClick={this.performAction}>
        <div className="dash-action-content">
          <div className="icon-wrapper" style={{ color: this.props.iconColor }}>
            { this.props.icon }
          </div>
          <div className="text-wrapper">
            { this.props.text }
          </div>
          <div className="angle-wrapper">
            <AngleRight size={42} />
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardAction;
