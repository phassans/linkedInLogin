var APIURL = "http://localhost:8080/v1/";
var redirectURL = "http://localhost:8000/";

$(document).ready(function() {
  var c = getUrlParameter("code");
  if (c != "") {
    var request = {
      authCode: c
    };

    $.ajax({
      url: APIURL + "user/linkedin/login",
      type: "post",
      dataType: "json",
      contentType: "application/json",
      success: function(data) {
        console.log(data.linkedInId);
        $.cookie("frolleagueUser", data.linkedInId, {
          expires: 7
        });
        $(location).attr("href", redirectURL);
      },
      error: function(data) {
        if (data.status == 401) {
          $("#error").show();
        }
        $("#img").show();
      },
      data: JSON.stringify(request)
    });
  } else {
    // read from cookie
    var userID = $.cookie("frolleagueUser");
    if (userID != "") {
      var request = {
        userId: userID
      };
      $.ajax({
        url: APIURL + "user/linkedin/me",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
          console.log(data);
          if (data.isUserLogin) {
            $("#user-name").text(data.firstName + " " + data.lastName);
            $("#welcome").show();
          } else {
            $("#img").show();
          }
        },
        error: function(error) {
          console.log(error);
          if (error.status == 400) {
            $("#error").show();
          }
          $("#img").show();
        },
        data: JSON.stringify(request)
      });
    } else {
      $("#img").show();
    }
  }
});

function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
