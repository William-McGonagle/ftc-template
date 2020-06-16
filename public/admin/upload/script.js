if (Cookies.get('key') === undefined) {

  window.location.href = "/";

}

$( document ).ready(function() {

  // $("#postButton").click(function (event) {
  //
  //   event.preventDefault();
  //
  //   var journalTitle = $("#articleName").val();
  //   var journalDate = $("#articleDate").val();
  //   var journalBody = $("#articleBody").val();
  //
  //   $.post( "/api/entry/new/", { title: journalTitle, body: journalBody, date: journalDate }, function( data ) {
  //
  //     console.log(data);
  //
  //   });
  //
  // });

  $("#form").submit(function(e) {
    e.preventDefault();
    var formData = new FormData(this);

    formData.append("key", Cookies.get("key"));

    var request = new XMLHttpRequest();
    request.open("POST", "/api/fileupload/");

    request.onload = function () {

      if (request.readyState === request.DONE) {

        if (request.status === 200) {

          window.location.href = "/files/" + JSON.parse(request.responseText).url;

        }

      }

    };

    request.send(formData);

  });

});
