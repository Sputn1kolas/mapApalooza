$(document).ready(function (){

  $("#register").on('click', 'button', function(event) {
    event.preventDefault();
    let username = $('#register .username').val()
    let password = $('#register .pass').val()
    let email = $('#register .email').val()
    console.log("Client side", username, password)
    $.ajax({
    url:'/register',
    type:'POST',
    data: {
      username: username,
      password: password,
      email: email
    },
    success: function(res) {
      console.log(res)
    }
  });
  })
})