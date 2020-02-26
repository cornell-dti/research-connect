import React, { KeyboardEvent, ChangeEvent } from 'react';
import '../../routes/App/App.scss';
import '../../routes/InstructorRegister/InstructorRegister.scss';

type Props = {
  data: { name: string; _id: string }[];
  updateLab: (labName: string, labId: string | null) => void;
}
type State = {
  value: string;
  showDropdown: boolean;
  cursor: number;
  result: JSX.Element;
  suggestionLength: number;
  highlightLabName: string;
  highlightLabId: string | null;
};

class AutoSuggest extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
      showDropdown: false,
      cursor: -1,
      result: <div />,
      suggestionLength: 0,
      highlightLabName: '',
      highlightLabId: null,
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value, showDropdown: true, cursor: -1 });
    setTimeout(() => this.getSuggestions(), 40);
    this.props.updateLab(event.target.value, null);
  };

  handleClick = () => {
    this.setState({ showDropdown: true });
    this.getSuggestions();
  };

  clickFill = (labName: string, labId: string | null) => {
    this.setState({ value: labName, showDropdown: false });

    this.props.updateLab(labName, labId);
  };

  onBlur = () => {
    setTimeout(() => {
      this.setState({
        showDropdown: false,
        highlightLabId: null,
        highlightLabName: '',
        cursor: -1,
      });
    }, 120);
  };

  handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const { cursor, suggestionLength } = this.state;

    if (e.key === 'ArrowUp' && cursor > -1) {
      e.preventDefault();
      this.setState((prevState) => ({
        cursor: prevState.cursor - 1,

      }));
      setTimeout(() => {
        this.getSuggestions();
      }, 40);
    } else if (e.key === 'ArrowDown' && cursor < suggestionLength - 1) {
      e.preventDefault();
      this.setState((prevState) => ({
        cursor: prevState.cursor + 1,
      }));
      setTimeout(() => {
        this.getSuggestions();
      }, 40);
    } else if (e.key === 'Enter' && cursor > -1) {
      e.preventDefault();
      setTimeout(() => {
        this.clickFill(this.state.highlightLabName, this.state.highlightLabId);
      }, 40);
    }
  }

  getSuggestions = () => {
    const arrayOfLabs = [];

    for (let ind = 0; ind < this.props.data.length; ind++) {
      arrayOfLabs.push({ name: this.props.data[ind].name, id: this.props.data[ind]._id });
    }

    const inputValue = this.state.value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const suggestions = arrayOfLabs;

    const suggArray = [];
    let positionShowing = 0;
    if (suggestions.length > 0) {
      for (let i = 0; i < suggestions.length; i++) {
        if (!(inputLength === 0) && suggestions[i].name.toLowerCase().slice(0, inputLength) === inputValue) {
          suggArray.push(
            <p
              className={`${this.state.cursor === positionShowing ? 'active autoOp' : 'autoOp'}`}
              onClick={() => this.clickFill(suggestions[i].name, suggestions[i].id)}
              key={suggestions[i].id}
            >
              {suggestions[i].name}
            </p>,
          );
          if (this.state.cursor === positionShowing) {
            this.setState({ highlightLabName: suggestions[i].name, highlightLabId: suggestions[i].id });
          }
          positionShowing += 1;
        } else if (inputLength === 0) {
          suggArray.push(
            <p
              className={`${this.state.cursor === positionShowing ? 'active autoOp' : 'autoOp'}`}
              onClick={() => this.clickFill(suggestions[i].name, suggestions[i].id)}
              key={suggestions[i].id}
            >
              {suggestions[i].name}
            </p>,
          );
          if (this.state.cursor === positionShowing) {
            this.setState({ highlightLabName: suggestions[i].name, highlightLabId: suggestions[i].id });
          }
          positionShowing += 1;
        }
        if (this.state.cursor === -1) {
          this.setState({ highlightLabId: null, highlightLabName: '' });
        }
      }
    }
    this.setState({
      suggestionLength: suggArray.length,
      result: <div className="suggestion-array">{suggArray}</div>,
    });
  };

  render() {
    return (
      <div className="left-input">
        <input
          autoComplete="off"
          name="auto"
          className="suggest-input"
          placeholder="Type Lab Name Exactly As It Appears In The Auto Suggest Box (Or Click On It)"
          type="text"
          value={this.state.value}
          onBlur={this.onBlur}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          onClick={this.handleClick}
        />
        {this.state.showDropdown ? this.state.result : ''}
      </div>
    );
  }
}

export default AutoSuggest;
