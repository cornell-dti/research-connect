import React from 'react';
import '../App.css';


class Autosuggester extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      showDropdown: false

    };
      this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
      this.getSuggestions = this.getSuggestions.bind(this);
      this.clickFill = this.clickFill.bind(this);
  }




  handleChange (event) {
      this.setState({value: event.target.value});
        this.setState({showDropdown: true});

  }
  handleClick(event){
      this.setState({showDropdown: true});

  }

clickFill(labName){
  this.setState({value: labName});
    this.setState({showDropdown: false});
}

getSuggestions() {
  //something to be fixed... right now it has to access the props each
  //time this function is called which is not efficient. should happen once per component

    var arrayOfLabs = [];

    for (var ind = 0; ind < this.props.data.length; ind++) {
        arrayOfLabs.push({"name": this.props.data[ind].name});

    }
    console.log(arrayOfLabs);


  var inputValue = this.state.value.trim().toLowerCase();
  var inputLength = inputValue.length;
  var suggestions = arrayOfLabs;
  console.log(suggestions);

  var suggArray = [];
  if (suggestions.length>0){
    for (var i = 0; i < suggestions.length; i++) {
      if (!(inputLength === 0) && suggestions[i].name.toLowerCase().slice(0,inputLength)===inputValue){
          suggArray.push(<p className="autoOp" onClick={this.clickFill.bind(this,suggestions[i].name)} key={suggestions[i].name} >{suggestions[i].name}</p>);
      } else if (inputLength === 0 && this.state.showDropdown){

          suggArray.push(<p className="autoOp" onClick={this.clickFill.bind(this,suggestions[i].name)}  key={suggestions[i].name} >{suggestions[i].name}</p>);
      } else if (!this.state.showDropdown){
        suggArray = [];
      }

    }
  }
  console.log(suggArray);
  return(<div>{suggArray}</div>);
}



  render() {

    return (
      <div>

      <input name="auto" placeholder='Type your lab name' type="text" value={this.state.value}
        onChange={this.handleChange} onClick = {this.handleClick}/>

      {this.getSuggestions()}
      </div>
    );
  }
}
export default Autosuggester;
