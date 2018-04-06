import React, {Component} from 'react';
import axios from 'axios';
import ProfessorMatchList from './ProfessorMatchList';

class ProfessorMatches extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        axios.get('/applications?id=' + '5a3c0f1df36d280c875969ed')
        .then((response) => {
            for (var opp in response.data) {
                for (var app in opp) {
                    console.log(response.data[opp][app]);
                }
            }
            this.setState({data: response.data});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        var oppList = [];
        for (var opp in this.state.data) {
            oppList.push(<ProfessorMatchList data={ this.state.data[opp] } />);
        }
        return (
            <div>
                { oppList }
            </div>
        );
    }
}

export default ProfessorMatches;