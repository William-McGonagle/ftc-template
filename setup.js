////////////////////////////////////////////////////////////////////
// THIS FILE IS FOR GENERATING THE DATABASE AND OTHER INFORMATION //
////////////////////////////////////////////////////////////////////

const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const readlineSync = require('readline-sync');

const sequelize = new Sequelize('blog', 'root', 'Beepboopbop', {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: false
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

var responseA = readlineSync.question('Are you sure you want to run this script? Running this script will erase all data from the database. (Y/n) ');
console.log("");

if (responseA.toUpperCase() != "Y") {

  console.log("OK. process canceled");
  return process.exit(1);

}

sequelize.sync({force: true}).then(function () {

  var responseB = readlineSync.question('admin username: ');
  console.log("");

  var responseC = readlineSync.question('admin password: ');
  console.log("");

  var responseD = readlineSync.question('admin email: ');
  console.log("");

  // create a hash of the password
  bcrypt.hash(responseC, 10, function(err, hash) {
    if (err) return console.log("Hash Failed");

    Users.create({
      username: responseB,
      password: hash,
      email: responseD
    }).then(function (data) {

      console.log("\n\n\nNow you just need to fill in the .env file. You can look at the README.md to find out how to do that.");
      return process.exit(1);

    }).error(function (error) {

      console.log(`\n\n\n${error}`);
      return process.exit(1);

    });

  });

}).error(function (error) {

  console.log(error);
  return process.exit(1);

});
