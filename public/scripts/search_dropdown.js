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

  $(".dropdown").on('click', 'li', function() {
    event.preventDefault();
    clearMarkers();
    let map_id= $(this).data("map_id")
    console.log(map_id)
    if(!map_id) {
      return;
    }
    $.ajax({
      url:`/maps/${map_id}`,
      type:'GET',
      success: function(mapObject) {
        loadMap(mapObject)
      }
    })

    $.ajax({
      url:`/${map_id}/points`,
      type:'GET',
      success: function(returnObject) {
        renderPoints(returnObject);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
       alert("some error", errorThrown);
      }
    })
  })
})