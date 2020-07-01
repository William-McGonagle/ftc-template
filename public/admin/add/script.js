if (Cookies.get('key') === undefined) {

  window.location.href = "/";

}

$(document).ready(function() {

  $("#form").submit(function(e) {

    e.preventDefault();
    var formData = new FormData(this);

    formData.append("email", $("#email").val());
    formData.append("username", $("#username").val());
    formData.append("password", $("#password").val());
    // formData.append("description", $("#description").val());

    var request = new XMLHttpRequest();
    request.setRequestHeader('Authorization', 'Bearer ' + Cookies.get("key"));
    request.open("POST", "/api/admin/new/");

    request.onload = function () {

      if (request.readyState === request.DONE) {

        if (request.status === 200) {

          var response = JSON.parse(request.responseText);

          Cookies.Set("key", response.token);
          alert("Success!");
          window.location.href = "";

        }

      }

    };

    request.send(formData);

  });

});
