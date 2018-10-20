const Promise = require('bluebird');
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/fetcher');
mongoose.connect(process.env.MONGODB_URI);

const repoSchema = mongoose.Schema({
  _id: Number,
  name: String,
  full_name: String,
  size: Number,
  forks_count: Number,
  watchers_count: Number,
  stargazers_count: Number,
  html_url: String,
  owner_id: Number,
  contributors: [Number],
});

const ownerSchema = mongoose.Schema({
  _id: Number,
  login: String,
  html_url: String,
});

const contributorSchema = mongoose.Schema({
  _id: Number,
  login: String,
  html_url: String,
});

const Repo = mongoose.model('Repo', repoSchema);
const Owner = mongoose.model('Owner', ownerSchema);
const Contributor = mongoose.model('Contributor', contributorSchema);

const unique = (objList, key) => {
  const valList = objList.map(x => x[key]);
  return objList
    .filter((obj, index, self) => valList.indexOf(obj[key]) === index);
};

// .flat() isn't implemented in node, it seems
const flatten = (array) => {
  return array.reduce((a, b) => [...a, ...b]);
}

const save = (repoItems, contributorsByRepo, callback) => {
  repoItems.forEach(row => row._id = row.id);

  const ownerItems = unique(repoItems.map(x => x.owner));
  ownerItems.forEach(row => row._id = row.id);

  const contributorItems = unique(flatten(contributorsByRepo));
  contributorItems.forEach(row => row._id = row.id);

  const repoIds = repoItems.map(x => x.id);
  const ownerIds = repoItems.map(x => x.owner.id);
  const contributorIds = flatten(contributorsByRepo.map(x => x.map(c => c.id)));

  // query db for preexisting repos
  // calculate stats
  // delete from repo, owner, contributor for preexisting repos (cascade delete seems difficult in mongo)
  // insert new repos, owners, contributors

  Repo.find({ _id: { $in: repoIds }}, (err, existingData) => {
    // not "true" number updated since there's no comparison between old data and new data
    // does not seem reasonable to compare all old/new data elements for change
    // but we can diff forks_count and just report those that have changed (future improvement)
    const numReposUpdated = existingData.length;
    const numNewRepos = repoItems.length - numReposUpdated;

    // didn't do error handing given limited time... eeek!
    Repo.deleteMany({ _id: { $in: repoIds }}, (err) => {
      Owner.deleteMany({ _id: { $in: ownerIds }}, (err) => {
        Contributor.deleteMany({ _id: { $in: contributorIds }}, (err) => {
          Repo.insertMany(repoItems, (err) => {
            Owner.insertMany(ownerItems, (err) => {
              Contributor.insertMany(contributorItems, (err) => {
                callback(err, numReposUpdated, numNewRepos);
              });
            });
          });
        });
      });
    });
  });
}

/*
const save = (repoItems, contributorsByRepo, callback) => {
  repoItems.forEach(row => row._id = row.id);
  const ids = repoItems.map(x => x.id);

  Repo.find({ _id: { $in: ids }}, (err, existingData) => {
    // not "true" number updated since there's no comparison between old data and new data
    // does not seem reasonable to compare all old/new data elements for change
    // but we can diff forks_count and just report those that have changed (future improvement)
    const numReposUpdated = existingData.length;
    const numNewRepos = repoItems.length - numReposUpdated;

    Repo.deleteMany({ _id: { $in: ids }}, (err) => {
      Repo.insertMany(repoItems, (err) => {
        callback(err, numReposUpdated, numNewRepos);
      });
    });
  });
}
*/

const get = (callback) => {
  Repo.find().sort({ forks_count: -1,  _id: 1 }).limit(25).exec((err, data) => {
    callback(data);
  });
}

module.exports.save = save;
module.exports.get = get;
