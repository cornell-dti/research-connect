import React, {Component} from 'react';

import '../Opportunities.css';

class StartDate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      startDate: this.props.startDate,
			currentVal: "Select"
		};
	}

  handleChange(e) {
    if (e.target.value.toString()=="Select"){
      console.log("select");
      this.setState({startDate: {
        "season": null,
        "year": null
      },
      "currentVal": e.target.value.toString()}, function() {
        this.props.updateDate(this.state.startDate);
      });
    }else{
    let tmp = e.target.value.toString().split(" ");
    console.log(tmp);
    this.setState({startDate: {
      "season": tmp[0],
      "year": tmp[1]
    },
    "currentVal": e.target.value.toString()}, function() {
      this.props.updateDate(this.state.startDate);
    });
  }
  }



	render() {
		return (
			<form onSubmit={this.handleSubmit}>
      <select className="opp-filter-select" value={this.state.currentVal} onChange={this.handleChange.bind(this)}>
        <option value="Select" >Select</option>
                <option value="Fall 2017" >Fall 2017</option>
          <option value="Spring 2018" >Spring 2018</option>
        <option value="Summer 2018" >Summer 2018</option>
        <option value="Fall 2018" >Fall 2018</option>
          <option value="Spring 2019" >Spring 2019</option>
            <option value="Summer 2019" >Summer 2019</option>

      </select>
			</form>
		);
	}
}

export default StartDate;
