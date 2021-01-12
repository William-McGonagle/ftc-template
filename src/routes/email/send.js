async function Route(req, res) {

    // it would be really funny if i didn't add authentication
  
    // Check if authentication headers are working
    if (req.headers["authorization"] == undefined) return res.sendStatus(401);
    token = req.headers["authorization"].split(" ")[1];
    if (token == undefined) return res.sendStatus(401);
  
    // Check if login is valid
    jwt.verify(token, process.env.privateKey, function(err, decoded) {
  
      // check if auth is valid, if not send a 401 status
      if (err) return res.sendStatus(401);
  
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
  
      // allow for certain groups to be targeted
      var sendTo = [];
      if (req.body.subscribers == 'true') sendTo.push({emailGroup: 'SUB'});
      if (req.body.team == 'true') sendTo.push({emailGroup: 'TEAM'});
      if (req.body.merch == 'true') sendTo.push({emailGroup: 'MERCH'});
      if (req.body.school == 'true') sendTo.push({emailGroup: 'SCHOOL'});
  
      // Change all of the text into 'Cool' text with markdown
  
      var converter = new showdown.Converter();
      var emailHtml = converter.makeHtml(req.body.body);
  
      Emailers.findAll({
        where: {
          [Op.or]: sendTo
        }
      }).then(function (data) {
  
        if (data == null) return res.sendStatus(404);
  
        for (var i = 0; i < data.length; i++) {
  
          transporter.sendMail({
            from: process.env.sender,
            to: data[i].email,
            subject: req.body.subject,
            text: req.body.body,
            html: emailHtml
          }).then((info) => {
  
            // We don't need to long anything... or do anything... at all...
  
          }).catch((error) => {
  
            console.log(error);
            return res.sendStatus(500);
  
          });
  
        }
  
        return res.json({count: result.length});
  
      }).error(function (error) {
  
        console.log(error);
        return res.sendStatus(500);
  
      });
  
    });
  
  }

module.exports = Route;