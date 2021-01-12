function Route(req, res) {

    // Check if the Email Parameter Has Been Defined
    if (req.body.email == undefined) return res.sendStatus(400);
  
    // Add the User to the Email Database
    global.Subscribers.create({
        email: req.body.email,
        emailGroup: "SUB"
    }).then(function (data) {
  
        return res.status(200).send("Success.");

    }).error(function (error) {

        // Log Errors and Send a Message to the Client
        console.log(error);
        return res.status(500).send("Internal Error with Database");

    });

}

// Output of the File is the Route
module.exports = Route;