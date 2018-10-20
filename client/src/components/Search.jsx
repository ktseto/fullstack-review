import React from 'react';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    }
  }

  onChange (e) {
    this.setState({
      term: e.target.value
    });
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return (<div>
      <h4>Add more repos!</h4>
      Enter a github username: <input value={ this.state.terms } onChange={ this.onChange.bind(this) }/>       
      <button onClick={ this.search.bind(this) }> Add Repos </button>
      <div>
        {
          this.props.importStats.numNewRepos === null
          ? ''
          : this.props.importStats.numNewRepos + ' new repos imported, ' + 
            this.props.importStats.numReposUpdated + ' repos updated.'
        }
      </div>
    </div>) 
  }
}

export default Search;