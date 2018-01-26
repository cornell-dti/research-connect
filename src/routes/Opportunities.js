import React, {Component} from 'react';
import axios from 'axios';
import logo from '../logo.svg';
import '../App.css';
import OpportunityBox from '../components/OpportunityBox';

class YearSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yearSelect: this.props.yearSelect
        };
        console.log(this.state);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({yearSelect: {
            "Freshman" : this.freshman.checked,
            "Sophomore" : this.sophomore.checked,
            "Junior" : this.junior.checked,
            "Senior" : this.senior.checked
        }
        }, () => {
            this.props.updateYear(this.state.yearSelect);
        });
    }

    handleSubmit(event) {
        var fresh = this.state.Freshman.toString();
        var soph = this.state.Sophomore.toString();
        var junior = this.state.Junior.toString();
        var senior = this.state.Senior.toString();
        alert('Freshman: ' + fresh + ' Sophomore: ' + soph + ' Junior: ' + junior + ' Senior: ' + senior);

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input ref={(node) => {this.freshman = node}}  onChange={this.handleChange} type="checkbox" name="Freshman" value="Freshman"/>Freshman
                <input ref={(node) => {this.sophomore = node}} onChange={this.handleChange} type="checkbox" name="Sophomore" value="Sophomore"/>Sophomore
                <input ref={(node) => {this.junior = node}} onChange={this.handleChange} type="checkbox" name="Junior" value="Junior"/>Junior
                <input ref={(node) => {this.senior = node}} onChange={this.handleChange} type="checkbox" name="Senior" value="Senior"/>Senior

                <input type="submit" value="Submit"/>
            </form>
        );
    }
}


class Opportunities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearSelect: {},
            yearSelectNode: {}
        };
    }

    test() {
        console.log("ran");
        console.log(this.state);
    }

    //will be called by the year component whenever the year checkboxes are updated
    handleUpdateYear(yearObj) {
        this.setState({yearSelect: yearObj}, () => {
            console.log("upyear");
            console.log(this.state.yearSelect);
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.test.bind(this)}/>
                <YearSelect updateYear={this.handleUpdateYear.bind(this)} />
                <OpportunityBox filteredOptions = {this.state}
                    url='http://localhost:3001/getOpportunitiesListing'
                />
                {/*TODO change the url to get the address bar */}
            </div>
            // <NameForm />
            // <div className="App">
            //   <header className="App-header">
            //     <img src={logo} className="App-logo" alt="logo" />
            //     <h1 className="App-title">Welcome to React</h1>
            //   </header>
            //   <p className="App-intro">
            //     To get started, edit <code>src/App.js</code> and save to reload.
            //   </p>
            // </div>
        );
    }
}

export default Opportunities;
