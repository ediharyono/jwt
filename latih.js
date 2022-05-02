///https://stackoverflow.com/questions/70669107/login-authorization-problem-does-not-pass-the-token

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
//const mysql = require('mysql');
//const validator = require('validator');
const jwt = require('jsonwebtoken');

require('dotenv').config().ACCESS_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const app = express();
app.use(express.json());
const publicDirectoryPath = path.join(__dirname, '../public');
console.log(publicDirectoryPath);
app.use(express.static(publicDirectoryPath));

function generateAccessToken(username) {
  return jwt.sign(username, 'ACCESS_TOKEN', { expiresIn: '1800s' });
}

app.post('/login', urlencodedParser, (req, res) => {
  res.get(req.body.username + req.body.password);

  const token = generateAccessToken({ username: req.body.username });
  res.redirect(`/admin?token=${token}`);
});

function authenticateToken(req, res, next) {
  token = req.query.token;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'ACCESS_TOKEN', (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

app.get('/admin', authenticateToken, (req, res) => {
  res.send(token);
  console.log(token);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server run: http://localhost:${port}`);
});