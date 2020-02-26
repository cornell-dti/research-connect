import React, { Component, ChangeEvent, KeyboardEvent } from 'react';
import { IoIosSearch as SearchIcon } from 'react-icons/io';
import { TiDeleteOutline as DeleteIcon } from 'react-icons/ti';
import '../../../routes/LandingPage/LandingPage.scss';

type State = { searchBar: string };

class SearchBar extends Component<{}, State> {
  state: State = { searchBar: '' };

  clearSearch = () => this.setState({ searchBar: '' });

  handleUpdateSearch = (e: ChangeEvent<HTMLInputElement>) => this.setState({ searchBar: e.target.value });

  handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      window.location.href = `/opportunities?search=${this.state.searchBar}`;
    }
  };

  render() {
    return (
      <div className="row search-div-container">
        <div className="search-icon-div">
          <SearchIcon style={{ height: '100%' }} size={36} />
        </div>
        <input
          className="search-bar"
          onKeyPress={this.handleKeyPress}
          onChange={this.handleUpdateSearch}
          value={this.state.searchBar}
          type="text"
          name="search"
          placeholder="Search keywords (e.g. machine learning, programming languages, computer science)"
          aria-label="Search"
        />
        <div className="delete-div">
          {
              this.state.searchBar !== '' ? (
                <DeleteIcon
                  onClick={this.clearSearch}
                  className="clear-icon"
                  style={{ height: '100%' }}
                  size={36}
                />
              ) : ''
            }
        </div>
      </div>
    );
  }
}

export default SearchBar;
