import React, {Component} from 'react';
import './DashboardAction.scss';
import AngleRight from 'react-icons/lib/fa/angle-right';

class DashboardAction extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	performAction() {
		console.log('here');
		window.location.href = this.props.href;
	}

	render() {
		return (
			<div className="dash-action-wrapper" onClick={ this.performAction.bind(this) }>
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
