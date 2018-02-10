import React, {Component} from 'react';

class YearSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yearSelect: this.props.yearSelect
        };
    }

    //when the year is changed, update the state so we can send it to the parent through the updateYear function
    handleChange(e) {
        this.setState({
            yearSelect: {
                "Freshman": this.freshman.checked,
                "Sophomore": this.sophomore.checked,
                "Junior": this.junior.checked,
                "Senior": this.senior.checked
            }
        }, function () {
            //call updateYear to update the parent's state with the current state of these checkboxes
            this.props.updateYear(this.state.yearSelect);
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input ref={(node) => {
                    this.freshman = node
                }} onChange={this.handleChange.bind(this)} type="checkbox" name="Freshman" value="Freshman"/>Freshman
                <input ref={(node) => {
                    this.sophomore = node
                }} onChange={this.handleChange.bind(this)} type="checkbox" name="Sophomore" value="Sophomore"/>Sophomore
                <input ref={(node) => {
                    this.junior = node
                }} onChange={this.handleChange.bind(this)} type="checkbox" name="Junior" value="Junior"/>Junior
                <input ref={(node) => {
                    this.senior = node
                }} onChange={this.handleChange.bind(this)} type="checkbox" name="Senior" value="Senior"/>Senior
            </form>
        );
    }
}

export default YearSelect;