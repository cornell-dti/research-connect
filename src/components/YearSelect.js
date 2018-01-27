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
<<<<<<< HEAD
                <input  ref={(node) => {this.freshman = node}}  onChange={this.handleChange} type="checkbox" name="Freshman" value="Freshman"/>Freshman
                <input  ref={(node) => {this.sophomore = node}} onChange={this.handleChange} type="checkbox" name="Sophomore" value="Sophomore"/>Sophomore
                <input   ref={(node) => {this.junior = node}} onChange={this.handleChange} type="checkbox" name="Junior" value="Junior"/>Junior
                <input  ref={(node) => {this.senior = node}} onChange={this.handleChange} type="checkbox" name="Senior" value="Senior"/>Senior
=======
                <input checked ref={(node) => {this.freshman = node}}  onChange={this.handleChange} type="checkbox" name="Freshman" value="Freshman"/>Freshman
                <input checked ref={(node) => {this.sophomore = node}} onChange={this.handleChange} type="checkbox" name="Sophomore" value="Sophomore"/>Sophomore
                <input checked ref={(node) => {this.junior = node}} onChange={this.handleChange} type="checkbox" name="Junior" value="Junior"/>Junior
                <input checked ref={(node) => {this.senior = node}} onChange={this.handleChange} type="checkbox" name="Senior" value="Senior"/>Senior
>>>>>>> dc9fcfbe6063d1ea7fcefec4373db0e263aa6c43

                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

export default YearSelect;