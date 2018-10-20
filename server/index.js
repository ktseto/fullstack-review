const express = require('express');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const github = require('../helpers/github.js');
const db = require('../database/index.js');
const port = 1128;
// const port = process.env.PORT || 8000;

const app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/repos', function (req, res) {
  const term = Object.keys(req.body)[0];
  github.getReposByUsername(term, (repoData) => {

    Promise.all(repoData.items.map(x => github.getContributorsByURL(x.contributors_url)))
      .then((contributorsByRepo) => {
        contributorsByRepo = contributorsByRepo.filter(x => x);
        db.save(repoData.items, contributorsByRepo, (err, numReposUpdated, numNewRepos) => {
          if (err) {
            console.error('Error!');
          } else {
            console.log('Saved!');
            res.status(201).send({
              numReposUpdated: numReposUpdated,
              numNewRepos: numNewRepos,
            });
          }
        });
      });
    });
});

app.get('/repos', function (req, res) {
  db.get((data) => {
    res.send(data);
  });
});

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

