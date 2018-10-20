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
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (data, callback) => {
  data.forEach(row => row._id = row.id);
  Repo.deleteMany({ _id: { $in: data.map(x => x.id) }}, (err) => {
    Repo.insertMany(data, (err) => {
      callback(err);
    });
  });
}

let get = (callback) => {
  Repo.find().sort({ forks_count: -1,  _id: 1 }).limit(5).exec(callback);
}

//save([{ _id: 1, name: 'meep'}, { _id: 2, name: 'beep', age: 35 }]);

// Repo.find((err, repo) => {
//   if (err) return console.error(err);
//   console.log('################');
//   console.log(repo);
// });

module.exports.save = save;
module.exports.get = get;


// extra columns ignored
// save([{ _id: 1, name: 'meep'}, { _id: 2, name: 'beep', age: 35 }]);

  // data.forEach((repo) => {
  //   (new Repo(repo)).save((err, mongoRepo) => {
  //     if (err) console.error(err);
  //     console.log('success');
  //   })
  // })