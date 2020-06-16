////////////////////////////////////////////////////////////////////
// THIS FILE IS FOR GENERATING THE DATABASE AND OTHER INFORMATION //
////////////////////////////////////////////////////////////////////

const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const readlineSync = require('readline-sync');
const fs = require('fs');
const crypto = require('crypto');

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

var responseA = readlineSync.question('Are you sure you want to run this script? Running this script will erase all data from the database, and the .env file. (Y/n) ');
console.log("");

if (responseA.toUpperCase() != "Y") {

  console.log("OK. process canceled");
  return process.exit(1);

}

sequelize.sync({force: true}).then(function () {

  var envOutput = "";

  console.log("Generating JWT Private Key");
  envOutput += `privateKey=${crypto.randomBytes(1024).toString('hex')}\n`;

  var responseB = readlineSync.question('admin username: ');
  console.log("");

  var responseC = readlineSync.question('admin password: ');
  console.log("");

  var responseD = readlineSync.question('admin email: ');
  console.log("");

  var responseE = readlineSync.question('smtp username (used to authenticate with smtp server): ');
  console.log("");

  var responseF = readlineSync.question('smtp password (used to authenticate with smtp server): ');
  console.log("");

  var responseG = readlineSync.question('smtp host (gmail: smtp.gmail.com): ');
  console.log("");

  var responseH = readlineSync.question('sender (normal: school robotics team <robotics@school.com>): ');
  console.log("");

  envOutput += `sender=${responseH}\n`;
  envOutput += `emailHost=${responseG}\n`;
  envOutput += `emailPassword=${responseF}\n`;
  envOutput += `emailUsername=${responseE}\n`;
  envOutput += `defaultDescription=This is the default user description\n`;
  envOutput += `profilePicture=https://www.logolounge.com/wd/uploads/184_337616.jpg\n`;

  // create a hash of the password
  bcrypt.hash(responseC, 10, function(err, hash) {
    if (err) return console.log("Hash Failed");

    Users.create({
      username: responseB,
      password: hash,
      email: responseD
    }).then(function (data) {

      console.log("writing the .env file");
      fs.writeFileSync(__dirname + "/.env", envOutput);

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
