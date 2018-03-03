import React, {Component} from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class ProfessorMatchList extends Component {
	getResponses(application) {
		let res = '';
		for (const [question, response] of Object.entries(application.responses)) {
		  res = res + question + ': ' + response + ', ';
		}
	}

	render() {
		const data = this.props.data
	  const columns = [{
	    Header: 'Courses',
	    id: 'courses',
	    accessor: 'courses',
	    filterMethod: (filter, row) =>
          String(row[filter.id]).toUpperCase().includes(filter.value.toUpperCase(), 0)
	  }, {
	    Header: 'GPA',
	    accessor: 'gpa',
	    filterable: false
	  }, {
	    Header: 'Responses',
	    id: 'responses',
	    accessor: application => {
	    	let res = '';
				for (const [question, response] of Object.entries(application.responses)) {
				  res = res + question + ': ' + response + ', ';
				}
	    },
	    filterable: false
	  }, {
	    Header: 'Status',
	    accessor: 'status',
	    filterable: false
	  }, {
	    Header: 'Net ID',
	    accessor: 'undergradNetId',
	    filterable: false
	  }, {
		  Header: 'Respond',
		  accessor: 'click-me-button',
		  Cell: row => (
		    <div style={{ textAlign: 'center' }}>
			    <button>
			    	Accept
			    </button>
			    <button>
			    	Interview
			    </button>
			    <button>
			    	Reject
			    </button>
		    </div>
  		),
			filterable: false
		}]

	  return (
	  	<ReactTable 
	  		data={data} 
	  		columns={columns}
	  		filterable />
	  )
	}
}

export default ProfessorMatchList
