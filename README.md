# The Dragonoid's FTC Template

### Easily build FTC standard websites with this pre-built server and template.

## Features

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

## Features Coming in the Future

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

## How To Install

Simply download this repository, through terminal, `cd` into it, and run this command `node setup.js`. This command will run you through the basic steps to get the whole website started. After you finish this, type `node index.js`. This will start up the website. From there, the website should be hosted on your default port, OR port 8000.

**NOTE:** The website does require Node.js and NPM to be installed on the machine to run. Install these two things first before attempting to install the website.

## Contributing

To contribute to the project, just email me to see what you can do to help. There is also a list of features that I think should be implemented in the future (it is under the features that have already been implemented). My email is wmcgonagle@optonline.net.

If you do not have any coding knowledge, but would still like to contribute to the website in some way: think about doing some of the things mentioned below.

- Tell other teams about this project.
- Make TouTube videos explaining how to set it up.
- Mention it in your engineering notebook or presentation.
- Thank the project if you win the competition.
- Share your team's website code with other teams.

## Contributor Covenant Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, sex characteristics, gender identity and expression,
level of experience, education, socio-economic status, nationality, personal
appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Gracious Professionalism

This repository follows Gracious Professionalism. This means that we place an emphisis on high-quality work, the values of others, and respect for individuals and the community.

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at wmcgonagle@optonline.net. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see
https://www.contributor-covenant.org/faq
