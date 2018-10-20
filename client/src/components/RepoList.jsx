import React from 'react';

const RepoList = ({ repos }) => (
  <div>
    <h4> Repo List Component </h4>
    {repos.map((repo, rank) => (<div><span>{rank}</span><span>{repo.name}</span></div>))}
  </div>
)

export default RepoList;