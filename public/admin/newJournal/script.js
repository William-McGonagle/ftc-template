if (Cookies.get('key') === undefined) {

  window.location.href = "/";

}

$( document ).ready(function() {

  var simplemde = new SimpleMDE({ element: document.getElementById("articleBody") });

  $("#postButton").click(function (event) {

    event.preventDefault();

    var journalTitle = $("#articleName").val();
    var journalDate = $("#articleDate").val();
    var journalBody = simplemde.value();
    var journalTags = $("#articleTags").val();

    $.post( "/api/entry/new/", { title: journalTitle, body: journalBody, date: journalDate, creator: 0, public: "TRUE", tags: journalTags, key: Cookies.get("key") }, function( data ) {

      if (data.error === undefined) {

        window.location.href = "/admin/editJournal/?id=" + data.id;

      } else {

        alert(data.error);

      }

    });

  });

  $("#saveButton").click(function (event) {

    event.preventDefault();

    var journalTitle = $("#articleName").val();
    var journalDate = $("#articleDate").val();
    var journalBody = simplemde.value();
    var journalTags = $("#articleTags").val();

    $.post( "/api/entry/new/", { title: journalTitle, body: journalBody, date: journalDate, creator: 0, public: "FALSE", tags: journalTags, key: Cookies.get("key") }, function( data ) {

      window.location.href = "/admin/editJournal/?id=" + data.id;

    });

  });

});
