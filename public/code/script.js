$( document ).ready(function() {

  runSearch();

  function runSearch () {

    var queryName = "";
    var queryDate = "";
    var queryTag = "CODE";
    var sortBy = "";

    $.get( "/api/entry/query/", { name: queryName, date: queryDate, tag: queryTag, sortBy: sortBy }, function( data ) {

      $("#searchResults").empty();

      for (var i = 0; i < data.length; i++) {

        var searchResult = $("<a></a>");
        searchResult.attr("href", "/journal/?id=" + data[i].ID);

        var date = new Date(data[i].journalDate);
        var prettyDate = date.getMonth() + "-" + date.getDate() + "-" + date.getFullYear();

        searchResult.append("<h3>" + data[i].journalTitle + "</h3>");
        searchResult.append("<p>" + prettyDate + "</p>");

        searchResult.addClass("journalData");

        $("#searchResults").append(searchResult);

      }

    });

  }

});
