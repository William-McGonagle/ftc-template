// Find the Model Defintions
global.Users = require('./models/users.js');
global.Subscribers = require('./models/subscriber.js');
global.JournalTags = require('./models/journalTag.js');
global.Journals = require('./models/journal.js');

// Set Up Relationships
Users.hasMany(Journals);
Journals.hasMany(JournalTags);

// Sync the Database with the Models
sequelize.sync();