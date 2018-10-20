import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      repos: [],
      importStats: { numReposUpdated: null, numNewRepos: null },
    } 
  }

  queryThenRender() {
    $.ajax({
      url: '/repos',
      method: 'GET',
    })
    .done((data) => {
      this.setState({
        repos: data,
      });
    });    
  }

  componentDidMount() {
    this.queryThenRender();
  }

  search (term) {
    console.log(`${term} was searched`);

    $.ajax({
      url: '/repos',
      method: 'POST',
      data: term,
    })
    .done((importStats) => {
      this.setState({ importStats });
      this.queryThenRender();
    });
  }

  render() {
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={ this.state.repos }/>
      <Search onSearch={ this.search.bind(this) } importStats={ this.state.importStats }/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));