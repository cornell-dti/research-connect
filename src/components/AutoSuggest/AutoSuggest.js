import React from 'react';
import '../../routes/App/App.scss';
import '../../routes/InstructorRegister/InstructorRegister.scss';

class AutoSuggest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            showDropdown: false,
            labId: null,
            cursor: -1,
            result: <div></div>,
            suggestionLength: 0,
            highlightLabName: '',
            highlightLabId: null

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.clickFill = this.clickFill.bind(this);
    }

    handleChange(event) {

        this.setState({value: event.target.value});
        this.setState({showDropdown: true, cursor: -1});
        setTimeout(() => {
            this.getSuggestions()
        }, 40);
        this.props.updateLab(event.target.value, null);

    }

    handleClick(event) {

        this.setState({showDropdown: true});
        this.getSuggestions();

    }

    clickFill(labName, labId) {
        console.log("click fill: " + labId);
        this.setState({value: labName});
        this.setState({labId: labId});
        this.setState({showDropdown: false});

        this.props.updateLab(labName, labId);
    }

    onBlur(event) {
        setTimeout(() => {
            this.setState({
                showDropdown: false, highlightLabId: null,
                highlightLabName: '', cursor: -1
            })
        }, 120);
    }

    handleKeyDown(e) {
        const {cursor, suggestionLength} = this.state;

        if (e.key === "ArrowUp" && cursor > -1) {
            e.preventDefault();
            this.setState(prevState => ({
                cursor: prevState.cursor - 1

            }))
            setTimeout(() => {
                this.getSuggestions()
            }, 40);
        } else if (e.key === "ArrowDown" && cursor < suggestionLength - 1) {
            e.preventDefault();
            this.setState(prevState => ({
                cursor: prevState.cursor + 1
            }))
            setTimeout(() => {
                this.getSuggestions()
            }, 40);
        } else if (e.key === "Enter" && cursor > -1) {
            e.preventDefault();
            setTimeout(() => {
                this.clickFill(this.state.highlightLabName, this.state.highlightLabId)
            }, 40);
        }
    }

    getSuggestions() {
        let arrayOfLabs = [];

        for (let ind = 0; ind < this.props.data.length; ind++) {
            arrayOfLabs.push({"name": this.props.data[ind].name, "id": this.props.data[ind]._id});

        }

        let inputValue = this.state.value.trim().toLowerCase();
        let inputLength = inputValue.length;
        let suggestions = arrayOfLabs;

        let suggArray = [];
        let positionShowing = 0;
        if (suggestions.length > 0) {
            for (let i = 0; i < suggestions.length; i++) {
                if (!(inputLength === 0) && suggestions[i].name.toLowerCase().slice(0, inputLength) === inputValue) {
                    suggArray.push(<p
                        className={`${this.state.cursor === positionShowing ? "active autoOp" : "autoOp"}`}
                        onClick={this.clickFill.bind(this, suggestions[i].name, suggestions[i].id)}
                        key={suggestions[i].id}>{suggestions[i].name}</p>);
                    if (this.state.cursor == positionShowing) {
                        this.setState({highlightLabName: suggestions[i].name});
                        this.setState({highlightLabId: suggestions[i].id});
                    }
                    positionShowing += 1;
                } else if (inputLength === 0) {
                    suggArray.push(<p
                        className={`${this.state.cursor === positionShowing ? "active autoOp" : "autoOp"}`}
                        onClick={this.clickFill.bind(this, suggestions[i].name, suggestions[i].id)}
                        key={suggestions[i].id}>{suggestions[i].name}</p>);
                    if (this.state.cursor == positionShowing) {

                        this.setState({highlightLabName: suggestions[i].name});
                        this.setState({highlightLabId: suggestions[i].id});
                    }
                    positionShowing += 1;
                }
                if (this.state.cursor == -1) {
                    this.setState({highlightLabId: null});
                    this.setState({highlightLabName: ''});
                }
            }
        }
        this.setState({suggestionLength: suggArray.length});
        this.setState({
            result: <div className="suggestion-array">{suggArray}</div>
        });
    }

    render() {
        return (
            <div className="left-input">
                <input autoComplete="off" ref="autoFill" name="auto" className="suggest-input"
                       placeholder='Type Lab Name Exactly As It Appears In The Auto Suggest Box (Or Click On It)' type="text" value={this.state.value}
                       onBlur={this.onBlur.bind(this)} onKeyDown={ this.handleKeyDown.bind(this) }
                       onChange={this.handleChange} onClick={this.handleClick}/>
                {this.state.showDropdown ? this.state.result : ""}
            </div>
        );
    }
}

export default AutoSuggest;
