if (Cookies.get('key') === undefined) {

  window.location.href = "/";

}

$( document ).ready(function() {

  console.log(Cookies.get('key'));

  $.post( "/api/entry/privatequery/", { key: Cookies.get('key') }, function( data ) {

    $("#searchResults").empty();

    console.log(data);

    for (var i = 0; i < data.length; i++) {

      var searchResult = $("<a></a>");
      searchResult.attr("href", "/journal/?id=" + data[i].ID);

      searchResult.append("<h3>" + data[i].journalTitle + "</h3>");
      searchResult.append("<p>" + data[i].journalDate + "</p>");

      searchResult.addClass("journalData");

      $("#searchResults").append(searchResult);

    }

  });

});
