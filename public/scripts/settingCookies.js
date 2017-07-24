$(document).ready(function (){

  $("#register").on('click', 'button', function(event) {
    event.preventDefault();
    let username = $('#register .username').val()
    let password = $('#register .pass').val()
    let email = $('#register .email').val()
    $.ajax({
      url:'/register',
      type:'POST',
      data: {
        username: username,
        password: password,
        email: email
      },
      success: function(res) {
        console.log("new entry added");
      }
    });
  })


  $("#login").on('click', 'button', function(event) {
    event.preventDefault();
    let username = $('#register .username').val()
    let password = $('#register .pass').val()
    console.log("Client side", username, password)
    $.ajax({
      url:'/login',
      type:'POST',
      data: {
        username: username,
        password: password
      },
      success: function(res) {
        console.log(res)
      }
    });
  })

})