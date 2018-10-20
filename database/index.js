const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');

let repoSchema = mongoose.Schema({
  _id: Number,
  name: String,
  full_name: String,
  size: Number,
  forks_count: Number,
  watchers_count: Number,
  stargazers_count: Number,
  html_url: String,
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (data, callback) => {
  data.forEach(row => row._id = row.id);
  const ids = data.map(x => x.id);

  Repo.find({ _id: { $in: ids }}, (err, existingData) => {
    // not "true" number updated since there's no comparison between old data and new data
    // does not seem reasonable to compare all old/new data elements for change
    // but we can diff forks_count and just report those that have changed (future improvement)
    const numReposUpdated = existingData.length;
    const numNewRepos = data.length - numReposUpdated;

    Repo.deleteMany({ _id: { $in: ids }}, (err) => {
      Repo.insertMany(data, (err) => {
        callback(err, numReposUpdated, numNewRepos);
      });
    });
  });
}

let get = (callback) => {
  Repo.find().sort({ forks_count: -1,  _id: 1 }).limit(25).exec((err, data) => {
    callback(data);
  });
}

module.exports.save = save;
module.exports.get = get;
