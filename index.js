const express = require('express');
const app = express();
const port = 8000;
const keygen = require("keygenerator");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mime = require('mime');
const showdown  = require('showdown');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const fs = require('fs');
var pdf = require('html-pdf');

var html = fs.readFileSync('./public/index.html', 'utf8');
var options = {
  "directory": "/tmp",
  "format": "Letter",
  "orientation": "portrait",
  "border": {
    "top": "1in",
    "right": "1in",
    "bottom": "1in",
    "left": "1in"
  },
  paginationOffset: 1,
  "footer": {
    "height": "1mm",
    "contents": {
      default: '<div style="width: 100%; text-align: right;"><span style="color: #444;">{{page}}</span></div>'
    }
  },
  "type": "pdf"
}

const newSubscriberPlainEmail = `

  Hey! Welcome to the GFA robotics team email list! You will recieve notifications about any activity that the robotics team thinks you would like. If you would like to stop recieving these emails, or you did not want to be subscribed in the first place, you can unsubscribe from our <a href='gfa-dragonoids.com'>website</a>.

`;

showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('parseImgDimensions', true);
showdown.setOption('tables', true);
showdown.setOption('ghCodeBlocks', true);
showdown.setOption('tasklists', true);
showdown.setOption('ghMentions', true);
showdown.setOption('ghMentionsLink', "http://localhost:8000/user/?id={u}");
showdown.setOption('emoji', true);
showdown.setOption('strikethrough', true);

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

//LoveTheDragons is most of the passwords

var keys = [];

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Will98iam",
  database: "dragons"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.post('/api/login/', function (req, res) {

  var username = req.body.username;
  var password = req.body.password;

  var sql = "SELECT ID, password FROM dragons.users WHERE username = ?;";
  con.query(sql, [username], function (err, result) {
    if (err) throw err;

    if (result.length > 0) {

      bcrypt.compare(password, result[0].password, function(err, ans) {

        if (ans) {

          res.json({key: genKey(), id: result[0].ID});

        } else {

          res.json({error: "Invalid Password."});

        }

      });

    } else {

      res.json({error: "User does not exist."});

    }

  });

});

app.post('/api/entry/new/', function (req, res) {

  var journalTitle = req.body.title;
  var journalBody = req.body.body;
  var journalDate = req.body.date;

  // console.log(journalDate);
  var journalCreator = req.body.creator;
  var public = req.body.public;
  var journalTags = req.body.tags.trim();
  var key = req.body.key;

  if (journalTitle === undefined || journalBody === undefined || journalDate === undefined) {

    res.json({error: "Not All Info Provided."});

  } else {

    if (getKey(key)) {

      if (journalTags[journalTags.length - 1] == ",") {

        journalTags = journalTags.slice(0, -1);

      }

      var tags = journalTags.split(",");

      for (var i = 0; i < tags.length; i++) {

        tags[i] = tags[i].trim();
        tags[i] = tags[i].toUpperCase();

      }

      //public can equal to undefined as Not True
      var publicText = "FALSE";
      if (public === "TRUE") {

        publicText = "TRUE";

      }

      var sql = "INSERT INTO `dragons`.`journals` (`journalTitle`, `journalBody`, `journalDate`, `journalCreator`, `journalPublic`) VALUES ( ? , ? , ? , ? , ? );";
      con.query(sql, [journalTitle, journalBody, journalDate, journalCreator, publicText], function (err, result) {
        if (err) throw err;

        for (var i = 0; i < tags.length; i++) {

          var nsql = "INSERT INTO `dragons`.`journalTags` (`journalID`, `tagName`) VALUES ( ? , ? );";
          con.query(nsql, [result.insertId, tags[i]], function (err1, result1) {
            if (err1) throw err1;


          });

        }

        res.json({id: result.insertId});

      });

    } else {

      res.json({error: "Invalid Login"});

    }

  }

});

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

app.post('/api/entry/edit/', function (req, res) {

  var journalTitle = req.body.title;
  var journalBody = req.body.body;
  var journalDate = req.body.date;

  // console.log(journalDate);

  var journalCreator = req.body.creator;
  var public = req.body.public;
  var id = req.body.id;
  var key = req.body.key;

  if (getKey(key)) {

    //public can equal to undefined as Not True
    var publicText = "FALSE";
    if (public === "TRUE") {

      publicText = "TRUE";

    }

    var sql = "UPDATE `dragons`.`journals` SET `journalTitle` = ?, `journalBody` = ?, `journalDate` = ?, `journalCreator` = ?, `journalPublic` = ? WHERE (`ID` = ? );";
    con.query(sql, [journalTitle, journalBody, journalDate, journalCreator, publicText, id], function (err, result) {
      if (err) throw err;

      res.json({id: result.insertId});

    });

  } else {

    res.json({error: "Invalid Login"});

  }

});

app.post('/api/entry/delete/', function (req, res) {

  var key = req.body.key;
  var id = req.body.id;

  if (getKey(key)) {

    var sql = "DELETE FROM `dragons`.`journals` WHERE (`ID` = ? );";
    con.query(sql, [id], function (err, result) {
      if (err) throw err;

      res.json({});

    });

  } else {

    res.json({error: "Invalid Login"});

  }

});

app.get('/api/entry/get/', function (req, res) {

  var journalId = req.query.id;

  if (journalId === undefined) {

    res.json({error: "No Query ID"});

  } else {

    var sql = "SELECT * FROM dragons.journals WHERE ID= ? ;";
    con.query(sql, [journalId], function (err, result) {
      if (err) throw err;

      if (result.length > 0) {

        res.json(result[0]);

      } else {

        res.json({error: "Invalid Journal Entry"});

      }

    });

  }

});

app.post('/api/entry/privatequery/', function (req, res) {

  var key = req.body.key;

  if (getKey(key)) {

    var sql = "SELECT journals.ID, journals.journalTitle, journals.journalDate FROM dragons.journals WHERE journals.journalPublic='FALSE' LIMIT 40;";

    con.query(sql, function (err, result) {
      if (err) throw err;

      if (result.length > 0) {

        res.json(result);

      } else {

        res.json({error: "No Results"});

      }

    });

  } else {

    res.json({error: "Invalid Login"});

  }

});

app.get('/api/entry/query/', function (req, res) {

  var searchName = req.query.name;
  var searchDate = req.query.date;
  var searchTag = req.query.tag;
  var sortBy = req.query.sortBy;

  var ending = "ORDER BY journals.journalDate";

  if (sortBy === "OLDEST") {

    ending = "ORDER BY -journals.journalDate";

  }

  var sql = "SELECT journals.ID, journals.journalTitle, journals.journalDate, journalTags.tagName FROM journals INNER JOIN journalTags ON journals.ID=journalTags.journalID WHERE (journals.journalTitle LIKE '%" + con.escape(searchName).slice(1, con.escape(searchName).length - 1) + "%') AND journals.journalPublic='TRUE' AND journalTags.tagName LIKE '%" + con.escape(searchTag).slice(1, con.escape(searchTag).length - 1) + "%' LIMIT 40;";

  con.query(sql, function (err, result) {
    if (err) throw err;

    if (result.length > 0) {

      res.json(result);

    } else {

      res.json({error: "No Results"});

    }

  });

});

app.post('/api/displayfiles/', function (req, res) {

  fs.readdir(__dirname + '/public/files/', function (err, files) {

    if (err) {

      res.json({error: "Unable to read directory."});

    } else {

      res.json(files);

    }

  });

});

app.post('/api/fileupload/', function (req, res) {

  var key = req.body.key;

  if (getKey(key)) {

    var localpath = keygen.password() + "-" + req.files.uploadedFile.name.split('.')[0] + "." + mime.extension(req.files.uploadedFile.mimetype);

    req.files.uploadedFile.mv(__dirname + '/public/files/' + localpath, function(err) {
      if (err)
        return res.json({error: err});

      res.json({url: localpath});

    });

  } else {

    res.json({error: "Invalid Login"});

  }

});

app.post('/api/admin/new/', function (req, res) {

  var key = req.body.key;

  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  var description = req.body.description;
  var profilePicture = "https://www.logolounge.com/wd/uploads/184_337616.jpg";

  if (getKey(key)) {

    var localpath = keygen.session_id() + "." + mime.extension(req.files.uploadedFile.mimetype);

    req.files.uploadedFile.mv(__dirname + '/public/files/' + localpath, function(err) {
      if (err)
        return res.json({error: err});

        profilePicture = "/files/" + localpath;

        bcrypt.hash(password, 10, function(err, hash) {

          var sql = "INSERT INTO `dragons`.`users` (`username`, `password`, `description`, `profilePicture`, `email`) VALUES ( ? , ? , ? , ? , ? );";
          var sql1 = "INSERT INTO `dragons`.`emailers` (`email`, `emailGroup`) VALUES ( ? , ? );";

          con.query(sql, [username, hash, description, profilePicture, email], function (err, result) {
            if (err) throw err;

            con.query(sql1, [email, "TEAM"], function (err1, result1) {
              if (err1) throw err1;

              res.json({key: genKey(), id: result.insertId});

            });

          });

        });

    });

  } else {

    res.json({error: "Invalid Login"});

  }

});

app.post('/api/email/add/', async function (req, res) {

  var email = req.body.email;

  if (email === undefined) {

    res.json({error: "No Email Provided."});

  } else {

    var sql = "INSERT INTO `dragons`.`emailers` (`email`, `emailGroup`) VALUES ( ? , 'SUB');";
    con.query(sql, [ email ], function (err, result) {
      if (err) throw err;

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "mcgonaglew@gfacademy.org",
          pass: "nwglovbimvptzljc"
        }
      });

      transporter.sendMail({
        from: '"Greens Farms Robotics Team" <robotics@gfacademy.org>', // sender address
        to: email, // list of receivers
        subject: "Thanks for Joining Us!", // Subject line
        text: newSubscriberPlainEmail,
        html: newSubscriberPlainEmail
      }).then((info) => {

        // console.log("Email Sent To: " + result[i].email);

      }).catch((error) => {

        // console.log(error);

      });

      res.json({response: "You have been added to the email list."});

    });

  }

});

app.post('/api/email/send/', async function (req, res) {

  var key = req.body.key;

  if (getKey(key)) {

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "mcgonaglew@gfacademy.org",
        pass: "nwglovbimvptzljc"
      }
    });

    // Make a selector for all users

    var whereClause = "WHERE";

    if (req.body.subscribers == 'true') {

      whereClause += " emailGroup='SUB'";

    }

    if ((req.body.subscribers == 'true' && req.body.team == 'true') || (req.body.subscribers == 'true' && req.body.merch == 'true') || (req.body.subscribers == 'true' && req.body.school == 'true')) {

      whereClause += " OR";

    }

    if (req.body.team == 'true') {

      whereClause += " emailGroup='TEAM'";

    }

    if ((req.body.team == 'true' && req.body.merch == 'true') || (req.body.team == 'true' && req.body.school == 'true')) {

      whereClause += " OR";

    }

    if (req.body.merch == 'true') {

      whereClause += " emailGroup='MERCH'";

    }

    if (req.body.merch == 'true' && req.body.school == 'true') {

      whereClause += " OR";

    }

    if (req.body.school == 'true') {

      whereClause += " emailGroup='SCHOOL'";

    }

    // console.log("SELECT * FROM dragons.emailers " + whereClause);

    var sql = "SELECT email FROM dragons.emailers " + whereClause;

    // Change all of the text into 'Cool' text with markdown

    showdown.setOption('completeHTMLDocument', true);
    var converter = new showdown.Converter();
    var emailHtml = converter.makeHtml(req.body.body);

    // SQL get all the selected users

    con.query(sql, function (err, result) {
      if (err) throw err;

      if (result.length > 0) {

        // Email the users with BCC or just Send each user individually

        for (var i = 0; i < result.length; i++) {

          transporter.sendMail({
            from: '"Greens Farms Robotics Team" <robotics@gfacademy.org>', // sender address
            to: result[i].email, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.body,
            html: emailHtml
          }).then((info) => {

            // console.log("Email Sent To: " + result[i].email);

          }).catch((error) => {

            // console.log(error);

          });

        }

        res.json({count: result.length});

      } else {

        res.json({error: "No Results"});

      }

    });

  } else {

    res.json({error: "Invalid Login"});

  }

});

//Below request is for debugging purposes

// app.get('/api/testKey/', function (req, res) {
//
//   var testkey = req.query.key;
//
//   res.json({keySuccess: getKey(testkey)});
//
// });

//Returns a New Key
function genKey() {

  var key = keygen.session_id();

  keys.push(key);
  return key;

}

//Returns True Or False
function getKey(testKey) {

  return keys.includes(testKey);

}

app.use(express.static('public'));

app.get('*', function(req, res){
  res.status(404).sendFile(__dirname + '/404.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
