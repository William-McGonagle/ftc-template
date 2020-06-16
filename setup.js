////////////////////////////////////////////////////////////////////
// THIS FILE IS FOR GENERATING THE DATABASE AND OTHER INFORMATION //
////////////////////////////////////////////////////////////////////

const Sequelize = require('sequelize');
const readline = require("readline");

const sequelize = new Sequelize('blog', 'root', 'Beepboopbop', {
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

////////////////////////////////
// SEQUELIZE MODEL DEFINITION //
////////////////////////////////

var Users = sequelize.define('users', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.TEXT
  },
  description: {
    type: Sequelize.TEXT
  },
  profilePicture: {
    type: Sequelize.TEXT
  },
  email: {
    type: Sequelize.TEXT
  }
});

var Journals = sequelize.define('journals', {
  journalTitle: {
    type: Sequelize.STRING
  },
  journalBody: {
    type: Sequelize.TEXT
  },
  journalPublic: {
    type: Sequelize.BOOLEAN
  }
});

var JournalTags = sequelize.define('journalTags', {
  tagName: {
    type: Sequelize.STRING
  }
});

var Emailers = sequelize.define('emailers', {
  email: {
    type: Sequelize.TEXT
  },
  emailGroup: {
    type: Sequelize.STRING
  }
});

Users.hasMany(Journals);
Journals.hasMany(JournalTags);

///////////////
// QUESTIONS //
///////////////

rl.question("Are you sure you want to run this script? Running this script will erase all data from the database. (Y/n)", function(responseA) {

  if (responseA.toUpperCase() != "Y") return console.log("OK. process canceled");

  sequelize.sync({force: true}).then(function () {

    rl.question("admin username: ", function(responseB) {

      rl.question("admin password: ", function(responseC) {

        rl.question("admin email: ", function(responseD) {

          // create a hash of the password
          bcrypt.hash(responseC, 10, function(err, hash) {
            if (err) return console.log("Hash Failed");

            Users.create({
              username: responseB,
              password: hash,
              email: responseD
            }).then(function (data) {

              console.log("Now you just need to fill in the .env file. You can look at the README.md to find out how to do that.");

            }).error(function (error) {

              console.log(error);

            });

          });

        });

      });

    });

  }).error(function (error) {

    return console.log(error);

  });

});
