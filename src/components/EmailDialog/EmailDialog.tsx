import React, { ChangeEvent } from 'react';
// @ts-ignore
import Modal from 'react-modal';
import './EmailDialog.scss';
import axios from 'axios';

const customStyles = {
  content: {
    top: '60%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
  },
};

type Props = {
  opp: {
    _id: string;
    title: string;
    supervisor: string;
    creatorNetId: string;
  };
  app: {
    firstName: string;
    lastName: string;
    undergradNetId: string;
    status: string;
  };
  statusText: string;
  buttonText: string;
};
type State = { modalIsOpen: boolean; emailContent: string };

class EmailDialog extends React.Component<Props, State> {
  state: State = {
    modalIsOpen: false,
    emailContent: '',
  };

  subtitle!: HTMLHeadingElement | null;

  openModal() {
    this.setState({ modalIsOpen: true });
    axios.get(`/api/messages/${this.props.opp._id}`, {
      // @ts-ignore
      studentFirstName: this.props.app.firstName,
      studentLastName: this.props.app.lastName,
      opportunityTitle: this.props.opp.title,
      yourFirstName: this.props.opp.supervisor,
      yourLastName: this.props.opp.supervisor,
      yourEmail: this.props.opp.creatorNetId,
    })
      .then((response: any) => {
        this.setState({
          emailContent: response.data[this.props.buttonText.toLowerCase()],
        });
      });
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.subtitle!.style.color = '#f00';
  };

  closeModal = () => this.setState({ modalIsOpen: false });

  getStatusAction(str: string): string {
    if (str === 'accept') {
      return 'accepted';
    } if (str === 'reject') {
      return 'rejected';
    } if (str === 'interview') {
      return 'interviewing';
    }
    return '';
  }

  sendEmail() {
    axios.post('/api/messages/send', {
      opportunityId: this.props.opp._id,
      labAdminNetId: this.props.opp.creatorNetId,
      undergradNetId: this.props.app.undergradNetId,
      message: this.state.emailContent,
      status: this.getStatusAction(this.props.statusText.toLowerCase()),
    }).then(() => {
      window.location.href = 'professorView';
    });
  }

  getDisabled = (): boolean | undefined => {
    const action = this.props.buttonText.toLowerCase();
    const { status } = this.props.app;
    if (status === 'accepted' || status === 'rejected') {
      return true;
    }
    if (status === 'interviewing') {
      if (action === 'interview') {
        return true;
      }
      return false;
    }
    return undefined;
  }

  handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ emailContent: event.target.value });
  }

  render() {
    return (
      <div>
        <button
          type="button"
          className="button"
          disabled={this.getDisabled()}
          onClick={this.openModal}
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
            <h2 ref={(subtitle) => { this.subtitle = subtitle; }}>Email Student</h2>
            <label>Message</label>
            <textarea className="email-text" value={this.state.emailContent} onChange={this.handleChange} />
            <button type="button" className="submit-button" onClick={this.sendEmail.bind(this)}>Submit</button>
            <button type="button" className="close-button" onClick={this.closeModal}>Close</button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default EmailDialog;
