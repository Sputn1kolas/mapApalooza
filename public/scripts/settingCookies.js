
$(document).ready(function (){

  $("#register_form").on('click', 'button', function(event) {
    event.preventDefault();
    let username = $('#register_form .username').val()
    let password = $('#register_form .pass').val()
    let email = $('#register_form .em').val()
    console.log("CLientside", username, email, password );
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
        $('#newmap').slideDown()
        $('dividor').slideDown()
        $('dividor').slideDown()
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
        $('#newmap').slideDown()
        $('dividor').slideDown()
        $('dividor').slideDown()
       // generateDescriptionsByRoute("/user/maps")
       //  $('.register_form_button').replaceWith('<div class="col-1 logout">Logout</div>')
       //  $('.login_form_button').replaceWith('<div class="col-1 welcome"><h2>Welcome Back!</h2></div>') //REST OF CODE TO BE REPLACED.)
      }
    });
  })
})