const request = require('request');
const config = require('../config.js');

let getReposByUsername = (username, callback) => {
  let options = {
    //url: 'https://api.github.com/repos/request/request',
    url: 'https://api.github.com/search/repositories?q=user:' + username,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${config.TOKEN}`
    }
  };

  request(options, (err, response, body) => {
    // console.log('request module: ', err, response, body);
    if (!err && response.statusCode == 200) {
      // console.log('github result: ', JSON.parse(body));
      callback(JSON.parse(body));
    }
  });
}

module.exports.getReposByUsername = getReposByUsername;