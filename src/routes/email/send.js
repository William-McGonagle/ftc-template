// Since the 'body' Parameter of the HTTP Request is Pure HTML- We Are Going to Use That as the Body of the Email.
    // TODO: Change the system to just use an array so that it is much more flexible.

function Route(req, res) {

    // Check If The User is Authenticated
    if (req.user == undefined) return res.status(403).send("Not Authenticated.");
 
    // Create a Transport Object for the Email System
    let transporter = nodemailer.createTransport({
        host: process.env.emailHost,
        port: 465,
        secure: true,
        auth: {
            user: process.env.emailUsername,
            pass: process.env.emailPassword
        }
    });

    // Creating Targets for the Email
    var sendTo = [];
    if (req.body.subscribers == 'true') sendTo.push({emailGroup: 'SUB'});
    if (req.body.team == 'true') sendTo.push({emailGroup: 'TEAM'});
    if (req.body.merch == 'true') sendTo.push({emailGroup: 'MERCH'});
    if (req.body.school == 'true') sendTo.push({emailGroup: 'SCHOOL'});

    // Search All Users for Matching Data
    Emailers.findAll({
        where: {
            [Op.or]: sendTo
        }
    }).then(function (data) {

        // Make Sure that there are Users that Match that Info
        if (data.length == 0) return res.status(404).send("No Results Matched Your Query");

        // Loop Through Users and Send an Email to Each
        for (var i = 0; i < data.length; i++) {

            // The sending of the Email is an Asyncronous Function

            transporter.sendMail({
                from: process.env.sender,
                to: data[i].email,
                subject: req.body.subject,
                text: req.body.body,
                html: req.body.body
            }).then((info) => {

                // You can Insert Code to Log the Activity of the Mail System

            }).catch((error) => {

                // Log Errors and Send a Message to the Client
                console.log(error);
                return res.status(500).send("Internal Error with Sending Emails");

            });

        }

        // Return the Count of Emails Sent to the Server
        return res.status(200).json({count: result.length});

    }).error(function (error) {

        // Log Errors and Send a Message to the Client
        console.log(error);
        return res.status(500).send("Internal Error with Database.");

    });

}

module.exports = Route;