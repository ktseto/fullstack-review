const request = require('request');
const Promise = require('bluebird');
const config = require('../config.js');

const getReposByUsername = (username, callback) => {
  const options = {
    url: 'https://api.github.com/search/repositories?q=user:' + username,
    headers: {
      'User-Agent': 'request',
      //'Authorization': `token ${config.TOKEN}`
      'Authorization': `token ${process.env.TOKEN}`
    }
  };

  request(options, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      callback(JSON.parse(body));
    }
  });
}

const getContributorsByURL_CB = (url) => {
  const options = {
    url: url,
    headers: {
      'User-Agent': 'request',
      //'Authorization': `token ${config.TOKEN}`
      'Authorization': `token ${process.env.TOKEN}`
    }
  };

  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (!err && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        resolve('');  // got a status code 204 "no content"
      }
    });
  });
}


// const getContributorsByURL_CB = (url, callback) => {
//   const options = {
//     url: url,
//     headers: {
//       'User-Agent': 'request',
//       'Authorization': `token ${config.TOKEN}`
//       //'Authorization': `token ${process.env.TOKEN}`
//     }
//   };

//   request(options, (err, response, body) => {
//     if (!err && response.statusCode == 200) {
//       callback(JSON.parse(body));
//     }
//   });
// }



module.exports.getReposByUsername = getReposByUsername;
// module.exports.getContributorsByURL = Promise.promisify(getContributorsByURL_CB);
module.exports.getContributorsByURL = getContributorsByURL_CB;