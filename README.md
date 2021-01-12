# nuugadag

Easily build FTC standard websites with this pre-built server and template.

_please star and watch this repository to be notified of any bug fixes, or additional features_

## features

- Top of the line security practices
  - All of the passwords are hashed, and salted. A practice that some billion-dollar corporations still do not do.
  - Instead of using key based authentication or session based authentication, we are using JSON Web Tokens. JWTs act like normal tokens, but they can store data in them and can act as a verification system as well.
  - Sequelize increases the speed of queries to the server and stops database injection attacks.
- Mailing List
  - Anyone can join the mailing list.
  - Custom SMTP servers are allowed
  - Emails use the markdown standard
  - Admins no longer have to use mail-chimp, or other similar services
- Journal Entries
  - The website mostly functions as a blog that allows admins to post journal entries and updates.
  - Journal entries can be compiled into a single PDF. This can be used as a journal for the competitions.

## features coming in the future

- Journal entries published by a single person
- Auto generated user biography pages
- Better formatting for the compiled journal entries
- Online Shop
- Comments
- RSS Feed
- Twitter/ Facebook/ Instagram Notifications when new blogpost is created
- Better Markdown or HTML Editor
- Upload images while editing new blog post

# Todo

## how to install

Simply download this repository, through terminal, `cd` into it, and run this command `node setup.js`. This command will run you through the basic steps to get the whole website started. After you finish this, type `node index.js`. This will start up the website. From there, the website should be hosted on your default port, OR port 8000.

**NOTE:** The website does require Node.js and NPM to be installed on the machine to run. Install these two things first before attempting to install the website.

## how can you help?

Please message me on discord if you would like to join the development team, or if you have any ideas for the project. Or, if you have any code that you would like to push, just to improve the service; again, just message me.
