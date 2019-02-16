import React, {Component} from 'react';
import * as Utils from '../../components/Utils';
import PropTypes from 'prop-types';

class Filter extends React.Component {
  constructor(props){
    super(props);
  }

  handleChange(e) {
    let option = e.target.value;
    this.props.updateFilterOption(this.props.filterType, option);
  }

  //helper method for generating select
  createCheckbox(){
    let choices = this.props.choices;
    const options = Object.keys(choices).map((value, index) => {
      return (
        <React.Fragment>
        <input onChange={this.handleChange.bind(this)}
               type="checkbox"
               value={value}
               key={index}/>
        {choices[value]}
        <br />
        </React.Fragment>
      );
    });

    return (
      <div className="checkbox-wrapper">
        { options }
      </div>
    );
  }

  createSelect(){
    let choices = this.props.choices;
    const options = Object.keys(choices).map((value, index) => {
      return (
        <option key={index} value={value}>
          {choices[value]}
        </option>
      );
    });
    return (
      <select className="select-wrapper" onChange={this.handleChange.bind(this)} >
        {options}
      </select>
    );
  }


  render(){
    let filter;

    if(this.props.type === "select"){
      filter = this.createSelect();
    }
    else if(this.props.type === "checkbox"){
      filter = this.createCheckbox();
    }

    return (
      <div className="filter-child">
        <label>{this.props.label}</label>
        {filter}
      </div>
    );

  }//end render
}//end class

Filter.propTypes = {
  filterType: PropTypes.string, //ex. for year filtering, filterType is yearSelect
  label: PropTypes.string, //example above, this would be "School Year"
  updateFilterOption: PropTypes.func, //lifts the state up
  choices: PropTypes.object, //key is stored in the database, value is label displayed
}

export default Filter;
