/////////////
// IMPORTS //
/////////////

require('dotenv').config();

const express = require('express');                 // for server
const bodyParser = require('body-parser');          // for server
const nodemailer = require("nodemailer");           // for mail
const fs = require('fs');                           // for files
const pdf = require('html-pdf');                    // for pdfs
const jwt = require('jsonwebtoken');                // for security
const crypto = require('crypto');                   // for security
const bcrypt = require('bcrypt');                   // for security
const Sequelize = require('sequelize');             // for database
const port = process.env.PORT || 8000;              // for port

// create object instances

const app = express();
const sequelize = new Sequelize('blog', 'root', 'Beepboopbop', {
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// I don't know what I did this for, but it is probably important

var month = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

////////////////////////
// EXPRESS MIDDLEWARE //
////////////////////////

// Static Hosting
app.use(express.static('public'));

// URL Encoded Parsing and JSON Parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

////////////////////
// EXPRESS ROUTES //
////////////////////


// Login Path
app.post('/api/login/', function (req, res) {

  // Check if all parameters are given
  if (req.body.username == undefined || req.body.password == undefined) return res.json({error: "Not all parameters given."});

  // Find one user from the database where the username is the input username
  Users.findOne({
    where: {
      username: req.body.username
    }
  }).then(function (findData) {

    // Return an error if the user does not exist
    if (findData == null) return res.json({error: "User does not exist."});

    // Do a bcrypt compare to make sure that the user does, infact, exist.
    bcrypt.compare(req.body.password, findData.password, function(err, ans) {

      // If it is a bad password, tell the user
      if (!ans) return res.json({error: "Invalid Password."});

      // Create a JWT Key for Authentication
      let token = jwt.sign({
         id: findData.id,
         username: findData.username,
         profilePicture: findData.profilePicture
      }, process.env.privateKey);

      // Return the jwt key
      res.json({token: token});

    });

  }).error(function (error) {

    // If there is an error, send a 500 status, and log it
    console.log(error);
    return res.sendStatus(500);

  });

});

app.post('/api/entry/new/', function (req, res) {

  // Authorization: Bearer ijaefjileaj.fjalfeiafafaf.jamckael

  // Check if authentication headers are working
  if (req.headers["authorization"] == undefined) return res.sendStatus(401);
  token = req.headers["authorization"].split(" ")[1];
  if (token == undefined) return res.sendStatus(401);

  // Make sure all parameters are given
  if (req.body.title == undefined || req.body.body == undefined || req.body.public == undefined || req.body.tags == undefined) return res.sendStatus(400);

  // Check if login is valid
  jwt.verify(token, process.env.privateKey, function(err, decoded) {

    // if there is an error, send a 401 status
    if (err) return res.sendStatus(401);

    // Make journal tags into an array
    var journalTags = req.body.tags.toUpperCase().replace(/ /g, "").split(",");

    // Create a new journal entry
    Journals.create({
      journalTitle: req.body.title,
      journalBody: req.body.body,
      journalPublic: req.body.public,
      userId: decoded.id
    }).then(function (data) {

      // For each tag, create a new journal tag
      for (var i = 0; i < journalTags.length; i++) {

        JournalTags.create({
          journalsId: data.id,
          tagName: journalTags[i]
        }).then(function (tagData) {

          // Don't need to do anything...

        }).error(function (error) {

          // If there is an error, send a 500 status, and log it
          console.log(error);
          return res.sendStatus(500);

        });

      }

      // Return the ID of the newly create journal
      return res.json({
        id: data.id
      });

    }).error(function (error) {

      // If there is an error, send a 500 status, and log it
      console.log(error);
      return res.sendStatus(500);

    });

  });

});

// don't f^$k with this for a solid second... i gotta remember how it works
/*

app.get('/api/entry/compile/', function (req, res) {

  var fileName = keygen.password() + "-CompiledJournal" + new Date().toDateString() + ".pdf";

  var sql = "SELECT * FROM dragons.journals WHERE journals.journalPublic='TRUE' ORDER BY journalDate;";

  con.query(sql, function (err, result) {
    if (err) throw err;

    showdown.setOption('completeHTMLDocument', false);
    var converter = new showdown.Converter();
    if (result.length > 0) {

      var htmlData = "<style>" + fs.readFileSync(__dirname + '/pdf-style.css') + "</style>";

      for (var i = 0; i < result.length; i++) {

        var journalDate = new Date(result[i].journalDate);
        // console.log(journalDate);

        htmlData += '<h1>' + result[i].journalTitle + '</h1>';
        htmlData += '<h3>' + month[journalDate.getMonth()] + " " + (journalDate.getDate() + 1) + ", " + journalDate.getFullYear() + '</h3>';
        htmlData += converter.makeHtml(result[i].journalBody);
        htmlData += '<br><br><p>Sign Off:</p><br><hr>';
        htmlData += '<p style="page-break-after: always;">&nbsp;</p>';

      }

      pdf.create(htmlData, options).toFile('./public/files/' + fileName , function(err1, n) {
        if (err) return console.log(err1);

        res.redirect("/files/" + n.filename.split('/')[7]);

      });

    } else {

      res.json({error: "No Results"});

    }

  });

});

*/

// edit the journal entry
app.post('/api/entry/:id/edit/', function (req, res) {

  // Check if the id exists
  if (req.params.id == undefined) return res.sendStatus(404);

  // Check if authentication headers are working
  if (req.headers["authorization"] == undefined) return res.sendStatus(401);
  token = req.headers["authorization"].split(" ")[1];
  if (token == undefined) return res.sendStatus(401);

  // Check if all parameters are given
  if (req.body.title == undefined || req.body.body == undefined) return res.sendStatus(400);

  // Check if login is valid
  jwt.verify(token, process.env.privateKey, function(err, decoded) {

    if (err) return res.sendStatus(401);

    // Find one journal entry
    Journals.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (findData) {

      // if the data doesn't exist, send a 404 status
      if (findData == null) return res.sendStatus(404);

      // set the new variables
      findData.journalTitle = req.body.title;
      findData.journalBody = req.body.body;
      findData.journalPublic = req.body.public;

      // save the data (sequelize function)
      findData.save();

      // send the client the updated id. (same as the original id)
      return res.json({id: findData.id});

    }).error(function (error) {

      // you know the drill, send a 500 status, and log it
      console.log(error);
      return res.sendStatus(500);

    });

  });

});

// delete an article
app.post('/api/entry/:id/delete/', function (req, res) {

  // check for all parameters
  if (req.params.id == undefined) return res.sendStatus(404);

  // Check if authentication headers are working
  if (req.headers["authorization"] == undefined) return res.sendStatus(401);
  token = req.headers["authorization"].split(" ")[1];
  if (token == undefined) return res.sendStatus(401);

  // Check if login is valid
  jwt.verify(token, process.env.privateKey, function(err, decoded) {

    // check if auth is valid, if not send a 401 status
    if (err) return res.sendStatus(401);

    // find the journal entry with the corresponding id
    Journals.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (data) {

      // if entry doesn't exist, throw a 404 status
      if (data == null) return res.sendStatus(404);

      // destroy the journal entry
      data.destroy();

      // send a 200 status
      return res.sendStatus(200);

    }).error(function (error) {

      // we've been over this... log the error, and send a 500 status.
      console.log(error);
      return res.sendStatus(500);

    });

  });

});

app.get('/api/entry/:id/', function (req, res) {

  // check if the entry id exists, if not, send a 404 status
  if (req.params.id == undefined) return res.sendStatus(404);

  // Check if authentication headers are working
  if (req.headers["authorization"] == undefined) return res.sendStatus(401);
  token = req.headers["authorization"].split(" ")[1];
  if (token == undefined) return res.sendStatus(401);

  // Check if login is valid
  jwt.verify(token, process.env.privateKey, function(err, decoded) {

    // check if auth is valid, if not send a 401 status
    if (err) return res.sendStatus(401);

    // find a journal entry with the corresponding id
    Journals.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (data) {

      // if the data doesn't exist, send a 404 status
      if (data == null) return res.sendStatus(404);

      // possibly clean the data up a bit before sending it out
      // send the data to the client
      return res.json(data);

    }).error(function (error) {

      // like has been mentioned 200 times before... log the error, send a 500 status
      console.log(error);
      return res.sendStatus(500);

    });

  });

});

// get all of the private entries
app.post('/api/entry/getPrivate/', function (req, res) {

  // Check if authentication headers are working
  if (req.headers["authorization"] == undefined) return res.sendStatus(401);
  token = req.headers["authorization"].split(" ")[1];
  if (token == undefined) return res.sendStatus(401);

  // Check if login is valid
  jwt.verify(token, process.env.privateKey, function(err, decoded) {

    // check if auth is valid, if not send a 401 status
    if (err) return res.sendStatus(401);

    // Query the Journal DB
    Journals.findAll({
      where: {
        journalPublic: false
      }
    }).then(function (data) {

      // if the data = null, send a 404 status
      if (data == null) return res.sendStatus(404);

      // possibly clean the data beforehand
      // send the data to client
      return res.json(data);

    }).error(function (error) {

      // log error and send the 500 status
      console.log(error);
      return res.sendStatus(500);

    });

  });

});

// Query the server for articles
app.get('/api/entry/query/', function (req, res) {

  // check if querys are undefined
  if (req.query.name == undefined || req.query.tag == undefined) return res.sendStatus(400);

  // Check if authentication headers are working
  if (req.headers["authorization"] == undefined) return res.sendStatus(401);
  token = req.headers["authorization"].split(" ")[1];
  if (token == undefined) return res.sendStatus(401);

  // Check if login is valid
  jwt.verify(token, process.env.privateKey, function(err, decoded) {

    // check if auth is valid, if not send a 401 status
    if (err) return res.sendStatus(401);

    // query the database for journal entries
    Journals.findAll({
      where: {
        journalTitle: {
          [Op.like]: `%${req.query.name}%`
        },
        '$JournalTags.tagName$': {
          [Op.like]: `%${req.query.tag}%`
        }
      }
    }).then(function (data) {

      // if there are not entries, send a 404 status
      if (data == null) return res.sendStatus(404);

      // return the data
      return res.json(data);

    }).error(function (error) {

      // if there is an error, send a 500 status, and log the error
      console.log(error);
      return res.sendStatus(500);

    });

  });

});

// get files from the server
app.get('/api/file/getAll/', function (req, res) {

  // read the directory with all of the files
  fs.readdir(__dirname + '/public/files/', function (err, files) {

    // if there is an error, send a 500 status
    if (err) return res.sendStatus(500);

    // send the files to the client
    res.json(files);

  });

});

// upload a file to the server
app.post('/api/file/upload/', function (req, res) {

  // Check if authentication headers are working
  if (req.headers["authorization"] == undefined) return res.sendStatus(401);
  token = req.headers["authorization"].split(" ")[1];
  if (token == undefined) return res.sendStatus(401);

  // Check if login is valid
  jwt.verify(token, process.env.privateKey, function(err, decoded) {

    // check if auth is valid, if not send a 401 status
    if (err) return res.sendStatus(401);

    // generate the name of the file
    var localpath = crypto.randomBytes(4).toString('hex') + "-" + req.files.uploadedFile.name.split('.')[0] + "." + mime.extension(req.files.uploadedFile.mimetype);

    // move the file into the `files` directory
    req.files.uploadedFile.mv(__dirname + '/public/files/' + localpath, function(err) {

      // if there is an error, log the error and send a 500 status
      if (err) {

        console.log(err);
        return res.sendStatus(500);

      }

      // send the url of the file
      res.json({url: `/files/${localpath}`});

    });

  });

});

// create a new admin
app.post('/api/admin/new/', function (req, res) {

  // check that all values are present
  if (res.body.email == undefined || res.body.username == undefined || res.body.password == undefined) return res.sendStatus(400);

  // Check if authentication headers are working
  if (req.headers["authorization"] == undefined) return res.sendStatus(401);
  token = req.headers["authorization"].split(" ")[1];
  if (token == undefined) return res.sendStatus(401);

  // Check if login is valid
  jwt.verify(token, process.env.privateKey, function(err, decoded) {

    // check if auth is valid, if not send a 401 status
    if (err) return res.sendStatus(401);

    // make sure there are default values for these
    var description = req.body.description || process.env.defaultDescription;
    var profilePicture = req.body.profilePicture || process.env.profilePicture;

    // create a hash of the password
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      if (err) return res.sendStatus(500);

      // create a user with the information
      Users.create({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        profilePicture: profilePicture,
        description: description
      }).then(function (data) {

        // create a new item on the email list
        Emailers.create({
          email: req.body.email,
          emailGroup: "TEAM"
        }).then(function (emailData) {

          // Create a JWT Key for Authentication
          let token = jwt.sign({
             id: data.id,
             username: data.username,
             profilePicture: data.profilePicture
          }, process.env.privateKey);

          // Return the jwt key
          res.json({token: token});

        }).error(function (error) {

          // log the error, send a 500 status
          console.log(error);
          return res.sendStatus(500);

        });

      }).error(function (error) {

        // log the error, send a 500 status
        console.log(error);
        return res.sendStatus(500);

      });

    });

  });

});

// subscribe to the mailing list
app.post('/api/email/add/', async function (req, res) {

  // check if the email exists
  if (req.body.email == undefined) return res.sendStatus(400);

  // add the user to the email table
  Emailers.create({
    email: req.body.email,
    emailGroup: "SUB"
  }).then(function (data) {

    // create a transporter to email the client
    let transporter = nodemailer.createTransport({
      host: process.env.emailHost,
      port: 465,
      secure: true,
      auth: {
        user: process.env.emailUsername,
        pass: process.env.emailPassword
      }
    });

    // email the client
    transporter.sendMail({
      from: process.env.sender,
      to: req.body.email,
      subject: "Thanks for Joining Us!",
      text: newSubscriberPlainEmail,
      html: newSubscriberPlainEmail
    }).then((info) => {

      return res.json({response: "You have been added to the email list."});

    }).catch((error) => {

      // if there is an error, log it, and send a 500 status
      console.log(error);
      return res.sendStatus(500);

    });

  }).error(function (error) {

    // if there is an error, log it, and send a 500 status
    console.log(error);
    return res.sendStatus(500);

  });

});

app.post('/api/email/send/', require('./routes/email/send.js'));

// 404 Error
app.get('*', function(req, res){

  res.status(404);

  // todo add a 404 page back in.

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
