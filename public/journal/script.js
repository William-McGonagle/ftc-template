$( document ).ready(function() {

  showdown.setOption('simplifiedAutoLink', true);
  showdown.setOption('parseImgDimensions', true);
  showdown.setOption('tables', true);
  showdown.setOption('ghCodeBlocks', true);
  showdown.setOption('tasklists', true);
  showdown.setOption('ghMentions', true);
  showdown.setOption('ghMentionsLink', "http://localhost:8000/user/?id={u}");
  showdown.setOption('emoji', true);
  showdown.setOption('strikethrough', true);

  var params = new URL(window.location.href).searchParams;

  if (Cookies.get("key") !== undefined) {

    $("#editButton").show();
    $("#editButton").click(function (event) {

      event.preventDefault();
      window.location.href = "/admin/editJournal/?id=" + params.get("id");

    });

  }

  var converter = new showdown.Converter();

  $.get( "/api/entry/get/", { id: params.get("id") }, function( data ) {

    $(document).prop('title', data.journalTitle);
    $("#journalName").text(data.journalTitle);
    $("#journalData").html(converter.makeHtml(data.journalBody));

    var date = new Date(data.journalDate);
    var prettyDate = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();

    $("#journalWriter").text(prettyDate);

    console.log(data);

  });

});
