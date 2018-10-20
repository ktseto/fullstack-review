import React from 'react';

const RepoList = ({ repos }) => (
  <div>
    <h4> Top 25 Most Forked Repos </h4>
    <table>
      <thead>
        <tr><th>Rank</th><th>Repo Name</th><th># Forks</th></tr>
      </thead>
      <tbody>
        {repos.map((repo, rank) => (<tr key={rank}><td>{rank + 1}</td><td>{repo.name}</td><td>{repo.forks_count}</td></tr>))}
      </tbody>
    </table>
  </div>
)

export default RepoList;