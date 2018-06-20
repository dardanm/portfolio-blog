var express = require('express');
var parser = require('body-parser');

var Sequelize = require('sequelize');

var connectionString = process.env.DATABASE_URL;

console.log(connectionString);

var sequelize = new Sequelize(connectionString);

var app = express();

const { Pool, Client } = require('pg');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

var Users = sequelize.define(
  'messages',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    title: Sequelize.STRING,
    body: Sequelize.STRING
  },
  {
    // prevent plural table names auto creating
    freezeTableName: true
  }
);

Users.sync();

app.get('/form', function(req, res) {
  var query = req.query.term;

  res.render('form');
});

app.post('/submit', function(req, res) {
  var t = req.body;

  Users.create({
    title: `${t.firstname}`,
    body: `${t.subject}`
  });

  res.render('submit');
});

app.get('/posts', function(req, res) {
  Users.findAll().then(function(rows) {
    res.render('posts', {
      rows: rows
    });
  });
});

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(process.env.PORT || 8080);
console.log('listening on port 8080');
