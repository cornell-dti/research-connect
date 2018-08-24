import React, {Component} from 'react';
import Faculty from './Faculty'
import '../OpportunityList.css'

class FacultyList extends Component {
    constructor(props) {
    super(props);
	 }
    countNodes(nodes){
      let tempCount = 0;
      let countString = "";
      for (let k in nodes){
        if (nodes[k]!=null){
          tempCount++;
        }
      }
      if (tempCount==1){
        countString = "There is 1 result"
      }else{
        countString = "There are " + tempCount.toString() +" results"
      }
      return(countString);
    }


    render() {
        
            return (
              <Faculty/>
            )
              
    }
}

export default FacultyList
