$(document).ready(function (){
  $(".login_form_button > :not(#login_form)").on("click",handler1)

  function handler1() {
    $("#login_form").slideDown(300)
    $(this).one("click", handler2);
  }

  function handler2() {
    $("#login_form").slideUp(300)
      $(this).one("click", handler1);
  }
  $(".register_form_button > :not(#register_form)").on("click",handler3)

  function handler3() {
    $("#register_form").slideDown(300)
    $(this).one("click", handler4);
  }

  function handler4() {
    $("#register_form").slideUp(300)
      $(this).one("click", handler3);
  }

  //Logout function

  $(".logout").on("click", function (event){
    event.preventDefault();
    $.ajax({
      url: "/logout",
      type:"POST",
      success: function (result){
        console.log("logout successful!");
        window.location.reload();// reloads the page when successful
      }
    })
  })

})