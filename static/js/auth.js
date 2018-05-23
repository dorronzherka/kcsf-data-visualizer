---
---

var APIBaseUrl = {{ site.requesturl }}

$(document).ready(() => {
   $('#login').on('submit', e => {
      e.preventDefault();

      var data = {
         email: $('#email').val(),
         password: $('#password').val()
      }

      $.ajax({
         url: 'http://0.0.0.0:5000/login',
         type: 'POST',
         dataType: 'json',
         headers: {
             'Content-Type': 'application/json'
         },
         crossDomain: true,
         data: JSON.stringify(data),
         success: data => {
            if (data.success == true) {
               window.location.href = "/dashboard";
               localStorage.setItem('token', data.token);
            } else {
               alert("Wrong");
            }
         }
      })
   });
});
