$(document).ready(function(){

  $("#point_container").on('click', '.point_item', function(){
    console.log("list item has clicked..")
    event.preventDefault();
    let point_id = $(this).data('point_id')
    // $("#point_container").find(`[data-slide='${point_id}']`).slideUp()
    $(this).slideUp()
    $.ajax({
        url:`/point/delete`,
        type:'POST',
        data: {
        point_id: point_id
        },
        success: function(result) {
          console.log("successful", result)
        }
    })
  })

})