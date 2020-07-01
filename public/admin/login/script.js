if (Cookies.get('key') !== undefined) {

  window.location.href = "/admin/";

}

$( document ).ready(function() {

  $(".loginForm").submit(function (event) {

    event.preventDefault();

    var username = $("#username").val();
    var password = $("#password").val();

    $.post( "/api/login/", {username: username, password: password}, function( data ) {

      if (data.error === undefined) {

        Cookies.set('key', data.token);
        window.location.href = "/admin/";

      } else {

        alert(data.error);

      }

    });

  });

});
