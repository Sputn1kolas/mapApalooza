
$(document).ready(function (){

  $("#register_form").on('click', 'button', function(event) {
    event.preventDefault();
    let username = $('#register_form .username').val()
    let password = $('#register_form .pass').val()
    let email = $('#register_form .email').val()
    console.log("CLientside", username, password,email);
    $.ajax({
      url:'/register',
      type:'POST',
      data: {
        username: username,
        password: password,
        email: email
      },
      success: function() {
        console.log("new entry added");
      }
    });
  })


  $("#login").on('click', 'button', function(event) {
    event.preventDefault();
    let username = $('#login .username').val()
    let password = $('#login .pass').val()
    console.log("Client side login ", username, password)
    $.ajax({
      url:'/login',
      type:'POST',
      data: {
        username: username,
        password: password
      },
      success: function() {
        location.reload();
       // generateDescriptionsByRoute("/user/maps")
       //  $('.register_form_button').replaceWith('<div class="col-1 logout">Logout</div>')
       //  $('.login_form_button').replaceWith('<div class="col-1 welcome"><h2>Welcome Back!</h2></div>') //REST OF CODE TO BE REPLACED.)
      }
    });
  })
})