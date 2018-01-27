import React, {Component} from 'react';

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
                <input checked ref={(node) => {this.freshman = node}}  onChange={this.handleChange} type="checkbox" name="Freshman" value="Freshman"/>Freshman
                <input checked ref={(node) => {this.sophomore = node}} onChange={this.handleChange} type="checkbox" name="Sophomore" value="Sophomore"/>Sophomore
                <input checked ref={(node) => {this.junior = node}} onChange={this.handleChange} type="checkbox" name="Junior" value="Junior"/>Junior
                <input checked ref={(node) => {this.senior = node}} onChange={this.handleChange} type="checkbox" name="Senior" value="Senior"/>Senior

                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

export default YearSelect;
