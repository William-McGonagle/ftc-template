if (Cookies.get('key') === undefined) {

  window.location.href = "/";

}

$( document ).ready(function() {

  var journalPublic = false;

  var params = new URL(window.location.href).searchParams;
  var simplemde = new SimpleMDE({ element: document.getElementById('articleBody') });

  if (params.get("id") == undefined || params.get("id") == "") {

    window.location.href = "/";

  }

  $.get( "/api/entry/get/", { id: params.get("id") }, function( data ) {

    if (data.error === "Invalid Journal Entry") {

      window.location.href = "/admin/";

    }

    console.log(data);

    $("#articleName").val(data.journalTitle);
    // $("#articleName").val(data.journalTitle);
    simplemde.value(data.journalBody);

    var date = new Date(data.journalDate);

    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);

    var prettyDate = date.getFullYear()+"-"+(month)+"-"+(day) ;

    console.log(prettyDate);

    $("#articleDate").val(prettyDate);

    if (data.journalPublic === "TRUE") {

      $("#postButton").html("<h3>Unpublish Journal Entry</h3>");
      journalPublic = true;

    } else {

      journalPublic = false;

    }

  });

  $("#postButton").click(function (event) {

    event.preventDefault();

    var journalTitle = $("#articleName").val();
    var journalDate = $("#articleDate").val();
    var journalBody = simplemde.value();

    var journalPublicText = (!journalPublic) ? "TRUE" : "FALSE";

    $.post( "/api/entry/edit/", { title: journalTitle, body: journalBody, date: journalDate, creator: 0, public: journalPublicText, id: params.get("id"), key: Cookies.get("key") }, function( data ) {

      console.log(data);
      window.location.href = window.location.href;

    });

  });

  $("#saveButton").click(function (event) {

    event.preventDefault();

    var journalTitle = $("#articleName").val();
    var journalDate = $("#articleDate").val();
    var journalBody = simplemde.value();

    var journalPublicText = (journalPublic) ? "TRUE" : "FALSE";

    $.post( "/api/entry/edit/", { title: journalTitle, body: journalBody, date: journalDate, creator: 0, public: journalPublicText, id: params.get("id"), key: Cookies.get("key") }, function( data ) {

      console.log(data);
      window.location.href = window.location.href;

    });

  });

  $("#deleteButton").click(function (event) {

    event.preventDefault();

    $.post( "/api/entry/delete/", { id: params.get("id") }, function( data ) {

      console.log(data);
      window.location.href = window.location.href;

    });

  });

});
