import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from 'axios';

const customStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)',
		width									: '50%'
	}
};

class EmailDialog extends React.Component {
	constructor() {
		super();

		this.state = {
			modalIsOpen: false,
			emailContent: ''
		};

		this.openModal = this.openModal.bind(this);
		this.afterOpenModal = this.afterOpenModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState({modalIsOpen: true});
		axios.get('/messages/' + this.props.opp._id, {
			'studentFirstName': this.props.app.firstName,
			'studentLastName': this.props.app.lastName,
			'opportunityTitle': this.props.opp.title,
			'yourFirstName': this.props.opp.supervisor,
			'yourLastName': this.props.opp.supervisor,
			'yourEmail': this.props.opp.creatorNetId
		})
		.then((response) => {
			console.log(response);
			this.setState({ 
				emailContent: response.data[this.props.buttonText.toLowerCase()],
			});
			console.log(this.state.emailContent);
		})
		.catch(function (error) {
			console.log(error);
		})
	}

	afterOpenModal() {
		// references are now sync'd and can be accessed.
		this.subtitle.style.color = '#f00';
	}

	closeModal() {
		this.setState({modalIsOpen: false});
	}

	getStatusAction(str) {
		if (str === 'accept') {
			return 'accepted';
		} else if (str === 'reject') {
			return 'rejected';
		} else if (str === 'interview') {
			return 'interviewing';
		} else {
			return '';
		}
	}

	sendEmail() {
		axios.post('/messages/send', {
			'opportunityId': this.props.opp._id,
			'labAdminNetId': this.props.opp.creatorNetId,
			'undergradNetId': this.props.app.undergradNetId,
			'message': this.state.emailContent,
			'status': this.getStatusAction(this.props.buttonText.toLowerCase())
		}).then(function (response) {
        //handle success
        console.log(response);
    })
		.catch(function (error) {
			console.log(error);
		})
		window.location.href = '/professorView';
	}

	getDisabled() {
		let action = this.props.buttonText.toLowerCase();
		let status = this.props.app.status;
		if (status === 'accepted' || status === 'rejected') {
			return true;
		}
		if (status === 'interviewing') {
			if (action === 'interview') {
				return true;
			} else {
				return false;
			}
		}
	}

	handleChange(event) {
    this.setState({emailContent: event.target.value});
    console.log(this.state.emailContent);
  }

	render() {
		return (
			<div>
				<button className="button"
				   disabled={ this.getDisabled() } 
				   onClick={ this.openModal }
				>
				   { this.props.buttonText }
				</button>
				<Modal
					ariaHideApp={false}
					isOpen={this.state.modalIsOpen}
					onAfterOpen={this.afterOpenModal}
					onRequestClose={this.closeModal}
					style={customStyles}
					contentLabel="Modal Content"
				>
					<div className="modal">
						<h2 ref={subtitle => this.subtitle = subtitle}>Email Student</h2>
						<label>Message</label>
						<textarea className="email-text" value={ this.state.emailContent } onChange={ this.handleChange.bind(this) } />
						<button className="submit-button" onClick={this.sendEmail.bind(this)}>Submit</button>
						<button className="close-button" onClick={this.closeModal}>Close</button>
					</div>
				</Modal>
			</div>
		);
	}
}

export default EmailDialog;