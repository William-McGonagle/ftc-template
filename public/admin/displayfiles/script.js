
if (Cookies.get('key') === undefined) {

  window.location.href = "/";

}

$( document ).ready(function() {

  $.post( "/api/displayfiles/", { key: Cookies.get('key') }, function( data ) {

    $("#fileResults").empty();

    console.log(data);

    for (var i = 0; i < data.length; i++) {

      var searchResult = $("<a></a>");
      searchResult.attr("href", "/files/" + data[i]);

      searchResult.append("<h3>" + data[i] + "</h3>");

      searchResult.addClass("journalData");

      $("#fileResults").append(searchResult);

    }

  });

});
