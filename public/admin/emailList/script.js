if (Cookies.get('key') === undefined) {

  window.location.href = "/";

}

$( document ).ready(function() {

  var simplemde = new SimpleMDE({ element: document.getElementById("emailBody") });

  $("#sendButton").click(function (event) {

    event.preventDefault();

    var emailSubject = $("#emailSubject").val();
    var emailBody = simplemde.value();

    var toSubscribers = false;
    var toMerch = false;
    var toTeam = false;
    var toSchool = false;

    if ($("#toSubscribers").is(":checked")) {

      toSubscribers = true;

    }

    if ($("#toMerchBuyers").is(":checked")) {

      toMerch = true;

    }

    if ($("#toTeamMembers").is(":checked")) {

      toTeam = true;

    }

    if ($("#toSchool").is(":checked")) {

      toSchool = true;

    }

    var key = Cookies.get('key');

    $.post( "/api/email/send/", { subject: emailSubject, body: emailBody, subscribers: toSubscribers, team: toTeam, merch: toMerch, school: toSchool, key: key }, function( data ) {

      console.log(data);

    });

  });

});
