const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validUrl = require('valid-url');
const User = require('./models/UserModel');
const Exercise = require('./models/ExerciseModel');
const moment = require('moment');

mongoose.connect(process.env.MONGO_URI);

mongoose.Promise = global.Promise;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Add new User to database

app.post('/api/exercise/new-user', (req, res) => {
  if (!req.body.username) return res.status(400).send('No username found');
  var username = new User({
    username: req.body.username
  });
  username
    .save()
    .then(result => {
      res.status(201).json({
        username: result.username,
        _id: result._id
      });
    })
    .catch(err => {
      res.status(500).json('username already taken');
    });
});

//Get all Users from the database

app.get('/api/exercise/users', (req, res) => {
  User.find()
    .select('username _id')
    .exec()
    .then(data => res.status(200).json(data));
});

// Add an exercise to the database

app.post('/api/exercise/add', (req, res) => {
  let { userId, description, duration, date } = req.body;
  if (!userId || !description || !duration)
    return res.status(400).send('Must include all parameters');

  if (date) {
    date = date;
  } else {
    date = moment()
      .format()
      .slice(0, 10);
  }
  User.findById(userId)
    .exec()
    .then(user => {
      if (user) {
        const data = new Exercise({
          userId: userId,
          description: description,
          duration: duration,
          date: date
        });
        data.save().then(result => {
          res.status(200).json({
            message: 'Exercise created successfully',
            request: result
          });
        });
      } else {
        res.status(404).json({ message: 'ID is not valid' });
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// Get exercise info from database

app.get('/api/exercise/log/?:userId/:from?/:to?/:limit', (req, res) => {
  var { userId, from, to, limit } = req.query;

  if (!userId) return res.status(400).send('userId required');

  User.findOne({ _id: userId }, (err, user) => {
    if (err) return res.status(400).send('Invalid userId');
    if (!user) return res.status(400).send('User not found');

    // this is broken
    Exercise.find({ userId: userId })
      .where('date')
      // gte is a mongoBD method which selects the documents where the
      //value is greater or equal too
      .gte(from ? new Date(from) : new Date(0))
      .where('date')
      //lte selects documents where the value is less than or equal too the
      //specified value
      .lte(to ? new Date(to) : new Date())
      .limit(limit ? Number(limit) : 1e10)
      .exec((err, results) => {
        if (err) return res.status(400).send(err.message);
        return res.json({
          _id: userId,
          username: user.username,
          count: results.length,
          log: results
        });
      });
  });
});

app.listen(port, () => {
  console.log('Node is listening on port 8080');
});
