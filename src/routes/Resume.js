import React, {Component} from 'react';
import axios from 'axios';
import '../ApplicationPage.css';
import * as Utils from '../components/Shared/Utils.js'

class Resume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resume: <p>Resume is loading...</p>
        };
    }

    componentWillMount() {
        axios.get('/resume/' + this.props.match.params.id)
            .then((response) => {
                this.setState({
                    resume: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        return (
            <div style={{height: "100%", width: "100%"}}>
                <embed style={{height: "100%", width: "100%"}} src={"data:application/pdf;base64," + this.state.resume }/>
            </div>
        );
    }
}

export default Resume;
