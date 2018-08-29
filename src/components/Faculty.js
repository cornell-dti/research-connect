import React, {Component} from 'react';
import '../OpportunityList.css'

class Faculty extends Component {
    constructor(props) {
        super(props);
    }

    convertDescription(str){
	  if (str.length > 250) {
		str = str.slice(0,250)+"... ";
		return(<h6>{str}<span className="viewDetails">View Details</span> </h6>);
	  } else {
		return(<h6>{str} </h6>);
	  }
	}

	clickRow(rowObj) {
		// this.props.history.push({pathname: 'opportunity/' + this.props.opId});
		document.location.href = ('/faculty/' + this.props.ID);
	}

    render() {

        return (
			<div className="application-box" onClick={this.clickRow.bind(this)}>
			<div className="row opp-box-row">
 				<div className="column column-80">
				<h4>{ this.props.name }</h4>
					<h5>{this.props.department}</h5>
					<h5>{this.props.lab}</h5>
				{/* <h5>{this.props.researchInterests}</h5> */}
				</div>
 				{/*<div className="column column-20">*/}
					{/*Accepting on Research Connect*/}
				{/*</div>*/}
 			</div>

				{ this.convertDescription(this.props.researchDescription) }


			</div>
		)

    }
}

export default Faculty
