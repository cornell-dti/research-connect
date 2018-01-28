import React, {Component} from 'react';

class YearSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yearSelect: this.props.yearSelect
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({yearSelect: {
            "Freshman" : this.freshman.checked,
            "Sophomore" : this.sophomore.checked,
            "Junior" : this.junior.checked,
            "Senior" : this.senior.checked
        }
        }, function() {
            this.props.updateYear(this.state.yearSelect);
        });
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input  ref={(node) => {this.freshman = node}}  onChange={this.handleChange} type="checkbox" name="Freshman" value="Freshman"/>Freshman
                <input  ref={(node) => {this.sophomore = node}} onChange={this.handleChange} type="checkbox" name="Sophomore" value="Sophomore"/>Sophomore
                <input  ref={(node) => {this.junior = node}} onChange={this.handleChange} type="checkbox" name="Junior" value="Junior"/>Junior
                <input  ref={(node) => {this.senior = node}} onChange={this.handleChange} type="checkbox" name="Senior" value="Senior"/>Senior
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

export default YearSelect;