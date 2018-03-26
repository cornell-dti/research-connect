import React, {Component} from 'react';
import axios from 'axios';
import '../ApplicationPage.css';
import * as Utils from '../components/Shared/Utils.js'

class Resume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resume: "",
            loaded: false
        };
    }

    componentWillMount() {
        axios.get('/doc/' + this.props.match.params.id)
            .then((response) => {
                this.setState(
                    {
                        resume: response.data,
                        loaded: true
                    });
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        let loaded = this.state.loaded;
        return (
            <div style={{height: "100%", width: "100%"}}>
                {loaded ? (<embed style={{height: window.innerHeight, width: window.innerWidth - 15}}
                                  src={"data:application/pdf;base64," + this.state.resume }/>) :
                    (<h1 style={{textAlign: "center"}}>Resume is loading...</h1>)}
            </div>
        );
    }
}

export default Resume;
