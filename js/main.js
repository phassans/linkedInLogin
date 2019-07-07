$(document).ready(function() {
  var c = getUrlParameter('code');
  if (c != "") {
    var request = {
      authCode: c
    }

    $.ajax({
      url: 'http://localhost:8080/v1/linkedin/login',
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        console.log(data.linkedInId);
        $.cookie('frolleagueUser', data.linkedInId, {
          expires: 7
        });
        $(location).attr('href', 'http://localhost:8000/projects/linkedInLogin/')
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
    var userID = $.cookie('frolleagueUser');
    if (userID != "") {
      var request = {
        linkedInUserId: userID
      }
      $.ajax({
        url: 'http://localhost:8080/v1/linkedin/me',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
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
          if (error.status == 401) {
            // do something
          }
        },
        data: JSON.stringify(request)
      });
    } else {
      $("#img").show();
    }
  }
});

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
