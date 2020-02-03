import React, { Component } from 'react';
import SearchIcon from 'react-icons/lib/io/search';
import DeleteIcon from 'react-icons/lib/ti/delete';
import axios from 'axios';
import '../../../routes/LandingPage/LandingPage.scss';
import * as Utils from '../../Utils';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBar: '',
      matchingSearches: [],
      searching: false,
      clickedEnter: false,
    };
  }

  clearSearch() {
    this.setState({ searching: false });
    this.setState({ searchBar: '' });
    this.setState({ matchingSearches: [] });
    this.setState({ clickedEnter: false });
  }

  handleUpdateSearch(e) {
    this.setState({ searchBar: e.target.value });
    if (e.target.value == '') {
      this.setState({ matchingSearches: [] });
      this.setState({ clickedEnter: false });
    }
  }

  onFocus() {
    this.setState({ searching: true });
  }

  onBlur() {
    this.setState({ searching: false });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.setState({ clickedEnter: true });
      window.location.href = `/opportunities?search=${this.state.searchBar}`;
    }
  }


  render() {
    return (
      <div className="row search-div-container">
        <div className="search-icon-div">
          <SearchIcon style={{ height: '100%' }} size={36} />
        </div>
        <input
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          className="search-bar"
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={this.handleUpdateSearch.bind(this)}
          value={this.state.searchBar}
          type="text"
          name="search"
          placeholder="Search keywords (e.g. machine learning, programming languages, computer science)"
          aria-label="Search"
        />
        <div className="delete-div">
          {
              this.state.searchBar != '' ? (
                <DeleteIcon
                  onClick={this.clearSearch.bind(this)}
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
