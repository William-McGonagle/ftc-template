
if (Cookies.get('key') === undefined) {

  window.location.href = "/";

}

$( document ).ready(function() {

  $.ajax({
     url: "/api/file/getAll/",
     data: {},
     type: "GET",
     success: function( data ) {

       $("#fileResults").empty();

       console.log(data);

       for (var i = 0; i < data.length; i++) {

         var searchResult = $("<a></a>");
         searchResult.attr("href", "/files/" + data[i]);

         searchResult.append("<h3>" + data[i] + "</h3>");

         searchResult.addClass("journalData");

         $("#fileResults").append(searchResult);

       }

   }});

});
