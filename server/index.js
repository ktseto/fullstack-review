const express = require('express');
const bodyParser = require('body-parser');
const github = require('../helpers/github.js');
const db = require('../database/index.js');

let app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/repos', function (req, res) {
  const term = Object.keys(req.body)[0];
  github.getReposByUsername(term, (data) => {
    db.save(data.items, (err) => {
      if (err) console.error('Error!');
      console.log('Saved!');
      res.status(201).end();
    });
  });
});

app.get('/repos', function (req, res) {
  db.get((data) => {
    res.send(data);
  });
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

