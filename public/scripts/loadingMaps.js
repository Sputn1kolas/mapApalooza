$(document).ready(function(){

  $("#point_container").on('click', '.delete_point', function(){
    event.preventDefault();
    let point_id = $(this).parent().parent().data('point_id')
    let map_id = $("#map").data('map_id')

    // $("#point_container").find(`[data-slide='${point_id}']`).slideUp()
    $(this).parent().parent().slideUp()
    $.ajax({
        url:`/point/delete`,
        type:'POST',
        data: {
        point_id: point_id
        },
        success: function() {
          reloadPoints()
      }
    })
  })

})





function reloadPoints(){
$.ajax({
  url:`/${map_id}/points`,
  type:'GET',
      success: function(returnObject) {
      renderPoints(returnObject)
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert("some error", errorThrown);
    }
  })
}