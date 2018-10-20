const request = require('request');
const config = require('../config.js');

let getReposByUsername = (username, callback) => {
  let options = {
    url: 'https://api.github.com/search/repositories?q=user:' + username,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${config.TOKEN}`
      //'Authorization': `token ${process.env.TOKEN}`
    }
  };

  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      callback(JSON.parse(body));
    }
  });
}

module.exports.getReposByUsername = getReposByUsername;