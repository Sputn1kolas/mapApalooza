$(document).ready(function (){
  $("#search_navbar").focus(function (){
    $("#search_results").slideDown(300);
  });
  $("#search_navbar").blur(function (){
    $("#search_results").slideUp(300);
  });
    $('#search_navbar').keyup(function () {
      var valThis = this.value.toLowerCase(),
          lenght  = this.value.length;

    $('ul>li').each(function () {
        var text  = $(this).text(),
            textL = text.toLowerCase(),
            htmlR = '<b>' + text.substr(0, lenght) + '</b>' + text.substr(lenght);
        (textL.indexOf(valThis) == 0) ? $(this).html(htmlR).show() : $(this).hide();
    });
  });
})