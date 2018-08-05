import React, {Component} from 'react';
import axios from 'axios';
import ProfessorMatchList from './ProfessorMatchList';
import * as Utils from "../Shared/Utils";

class ProfessorMatches extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
    }

    componentDidMount() {
        axios.get('/api/applications?id=' + '5a3c0f1df36d280c875969ed')
            .then((response) => {
                for (let opp in response.data) {
                    for (let app in opp) {
                        console.log(response.data[opp][app]);
                    }
                }
                this.setState({data: response.data});
            })
            .catch(function (error) {
                Utils.handleTokenError(error);
            });
    }

    render() {
        let oppList = [];
        for (let opp in this.state.data) {
            oppList.push(<ProfessorMatchList data={ this.state.data[opp] }/>);
        }
        return (
            <div>
                { oppList }
            </div>
        );
    }
}

export default ProfessorMatches;