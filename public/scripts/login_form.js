$(document).ready(function (){
  $(".login_form_button").not("#login_form").on("click",handler1)

  function handler1() {
    $(".login_form_button").css("background", "#b000b0")
    $("#login_form").slideDown(300)
    $(this).one("click", handler2);
  }

  function handler2() {
    $(".login_form_button").css("background", "#a000a0")
    $("#login_form").slideUp(300)
      $(this).one("click", handler1);
  }
})