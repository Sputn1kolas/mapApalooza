var map;
var marker;
var infowindow;
var messagewindow;
let markers  = []
var image = '/img/lighthouse.svg';


function newMarker(event) {
  marker = new google.maps.Marker({
   position: event.latLng,
   map: map
 })
}

function removeMapEvents() {
  google.maps.event.clearListeners(map);
}

$('.addPoint').on('click', function() {
  google.maps.event.addListener(map, 'click', function(event) {
    marker = new google.maps.Marker({
     position: event.latLng,
     map: map,
     icon: image
   });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
    markers.push(marker)
    removeMapEvents();
    toggleDescriptions();
  })
  $('.addPoint').toggleClass("clicked")
})

function toggleDescriptions() {
  $('.pointDescriptions').slideToggle()
  $('.addPoint').toggleClass("clicked")
  // FOCUS ON title
}

function initMap(center) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.5023, lng: -73.5592},
    zoom: 15,
    styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#fcfcfc"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#fcfcfc"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#dddddd"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#dddddd"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#dddddd"}]}]
  });

  infowindow = new google.maps.InfoWindow({
    content: document.getElementById('form')
  })

  messagewindow = new google.maps.InfoWindow({
    content: document.getElementById('message')
  });
}

function saveData() {
  var name = escape(document.getElementById('name').value);
  var address = escape(document.getElementById('address').value);
  var type = document.getElementById('type').value;
  var latlng = marker.getPosition();
  var url = 'phpsqlinfo_addrow.php?name=' + name + '&address=' + address +
  '&type=' + type + '&lat=' + latlng.lat() + '&lng=' + latlng.lng();
  downloadUrl(url, function(data, responseCode) {

    if (responseCode == 200 && data.length <= 1) {
      infowindow.close();
      messagewindow.open(map, marker);
    }
  });
}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
  new ActiveXObject('Microsoft.XMLHTTP') :
  new XMLHttpRequest;
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request.responseText, request.status);
    }
  };
  request.open('GET', url, true);
  request.send(null);
}

function doNothing () {}


// Uses AJAX to add the new point
$(".pointForm").on('submit', function(event) {
  event.preventDefault();
  let map_id = $('#map').data('map_id')
  let title = $("input[name='title']").val()
  let description = $("textarea[name='description']").val()
  let img_url = $("input[name='img_url']").val()
  let address = $("input[name='address']").val()
  let lat =  Number(marker.getPosition().lat())
  let long = Number(marker.getPosition().lng())
  let data = {
    title: title,
    description: description,
    img_url: img_url,
    lat: Number(lat),
    long: Number(long),
    address: address
  }

  $.ajax({
    url:`/maps/${map_id}/point/new`,
    type:'POST',
    data: data,
    success: function(data) {
      let point_id = data[0].id
      newPointDescription(title, address, description, point_id, "img_url", "new")
      let deleteButton = `<i class="fa fa-trash-o purpleHover delete_point" aria-hidden="true"></i>`
      $('.new').find('main').append(deleteButton)
      $("#point_container").find('.new').removeClass("new")
    }
  });
  toggleDescriptions();
});


// creates a new map
$(".gmaps").on('click', ".submit_new_map", function(event) {
  event.preventDefault();
  let title = $("input[name='map_title']").val()
  let description = $("textarea[name='map_description']").val()
  if(marker){
    let lat =  Number(marker.getPosition().lat())
    let long = Number(marker.getPosition().lng())
  }
  let data = {
    title: title,
    description: description
    // img_url: img_url,
    // lat: Number(lat),
    // long: Number(long),
  }
  $.ajax({
    url:`/maps/new`,
    type:'POST',
    data: data,
    success: function(mapObject) {
      loadMap(mapObject)
    }
  });
  toggleDescriptions();
});


// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}


// for all points passed to it shows them on screen and generates a box below
function renderPoints(points_array){
  for(var i = 0; i < points_array.length; i++) {
    let pointObject = points_array[i]
    let latLng = {lat: Number(pointObject.lat), lng: Number(pointObject.long)};
    let marker = new google.maps.Marker({   //change this to ID later
     position: latLng,
     map: map,
     icon: image
   });
    markers.push(marker)
    newPointDescription(pointObject.title, pointObject.address, pointObject.description, pointObject.id, pointObject.img_url)
  }
 let map_id = $('#map').data('map_id')
 isUserOwnerOfMap(map_id)
}

function isUserOwnerOfMap(map_id){
  $.ajax({
    url: `/user/maps`,
    type:'GET',
    success: function(result) {
      for(var i = 0; i < result.length; i++) {
        if(result[i].id === map_id) {
          let deletePoint = `<i class="fa fa-trash-o purpleHover delete_point" aria-hidden="true"></i>`
          $('#point_container').find('main').append(deletePoint)

          let deleteMap = `<div class="delete_map"><i class="fa fa-trash-o purpleHover " aria-hidden="true"></i><div>`
          if($('.delete_map').length){
            $('.controls').append(deleteMap)
          }
        }
      }
    }
  })
}

// make a point description box down below the map
function newPointDescription(title, address, description, point_id, img_url, new_class) {
  if(!new_class) {
    new_class = ""
  }
  let map_id = $('#map').data('map_id')
  let newPoint =
  `<article class="point_item ${new_class}" data-point_id="${point_id}">
  <header>
  <h1> ${title}   </h1>
  </header>
  <main>
  <div class="point_img"><img src="${img_url}"></div>
  <div class="point_description">
  ${description}
  </div>
  </main>
  </article>
  </div>`
  $("#point_container").prepend(newPoint)
}

// generates a map description box on the right hand, when passed info
function newMapDescription(title, address, description, map_id, img_url) {
 let newMap =
 `<article class="point_item" data-map_id="${map_id}">
 <header> ${title} </header>
 <main>
 <div class="point_img"><img src="${img_url}"></div>
 <div class="point_description">${description}</div>
 </main>
 </article>`
 $('#point_container').prepend(newMap)
}


function changeMap(title, description, map_id) {
  $('.controls').find('.map_title').replaceWith(
    `<h1 class="map_title" >${title}</h1>`
    )
 $('.gmaps').find('.map_description').replaceWith(
    `<h3 class="map_description" id="map_description"> ${description} </h3>`
  )
  $('#map').data('map_id', map_id)
  ifFavourited(map_id)
}


function ifFavourited(map_id) {
   $.ajax({
    url:`/favourites/${map_id}`,
    type:'GET',
    success: function(mapObject) {
        if(!mapObject[0]) {
           $('.fav').removeClass("favourited")
        } else {
          $('.fav').addClass("favourited")
         }
    }
  })
}


///////////////////////// On load AJAX CALLS ////////////////////////

switch($('.page').data('page')) {
case 'main':
  generateDescriptionsByRoute("/maps/all")
  break;
case 'favourites':
  generateDescriptionsByRoute("/user/favourites")
  break;
case 'profile':
  generateDescriptionsByRoute("/user/maps")
  break;
}

function generateDescriptionsByRoute(route) {
  $.ajax({
  url: route,
  type:'GET',
  success: function(result) {
    generateDescriptions(result)
    }
  })
}


// should load the map points on load
// let map_id = $('#map').data('map_id')
// if(map_id){
//   $.ajax({
//     url:`/${map_id}/points`,
//     type:'GET',
//     success: function(returnObject) {
//       console.log("the get for map points returns...", returnObject)
//       newPointDescription(returnObject)
//     }
//   })
// }
//////////////////////// Pulling all the maps on sidebar ///////////////////

function newMapDescription(title, description, map_id, img_url) {
  let newMap =
  `<article class="list_item" data-map_id="${map_id}">
  <header>
  ${title}
  </header>
  <main>
  <div class="item_img"><img src="${img_url}"></div>
  <div class="item_description">${description} </div>
  </main>
  <footer>
  <div class="numberFavs data-map_id="${map_id}">
  <i class="fa fa-heart"></i>
  2 fav
  </div>
  <div class="numberPoints">10 points</div>
  </footer>
  </article>`
  $('.list_container').append(newMap)
}

function generateDescriptions(map_db){
 for(var i = 0; i < map_db.length; i++) {
   newMapDescription(map_db[i].title,
     map_db[i].description,
     map_db[i].id,
     map_db[i].img_url
     )
 }
}

function removePointDescriptions(){
  $('.point_item').remove()
}

function loadMap(mapObject){
  removePointDescriptions()
  let title = mapObject[0].title
  let description = mapObject[0].description
  let map_id = mapObject[0].id
  changeMap(title, description, map_id)

}

// get the information on the clicked item, and loads it to the main screen
$(".list_container").on('click', '.list_item', function() {
  event.preventDefault();
  clearMarkers()
  let map_id= this.dataset.map_id
  if(!map_id) {
    return
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
      renderPoints(returnObject)
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
     alert("some error", errorThrown);
    }

  })
})

$(".new_map").on('click', function(event) {
  removePointDescriptions()
  $('.controls').find('.map_title').replaceWith(
    `<input type="map_title" name="map_title" class=".form-control map_title" placeholder='Title: My Sunbathing Spots'>`
    )
  $('.gmaps').find('.map_description').replaceWith(
    `<div class="map_description" id="map_description">
    <textarea class="form-control" type="map_description" name="map_description" rows="2" placeholder='Description: My map is a all of my favourite sunbathing spots in Montreal...'></textarea>
     <button class="btn btn-info btn-block submit_new_map">SUBMIT</button>
    </div>
       `)
  $('#map').data('map_id', "new")
})

$(".list_container").on('click', '.my_maps', function(event) {
  $('.list_container').find('.my_maps').replaceWith(
    `<div class="col divider my_maps"><a href="/">All Maps</a></div>`)
})

$(".list_container").on('click', '.all_maps', function(event) {
  $('.list_container').find('.all_maps').replaceWith(
    `<div class="col divider my_maps"><a href="/profile">My Maps</a></div>`)
})

$(".controls").on('click', '.fav', function() {
  event.preventDefault();
  let favourited = ""
  if($('.fav').hasClass('favourited')){
    favourited = "Yes"
    console.log("is favourited")
  } else {
     favourited = "No"
  }
  let map_id = $('#map').data('map_id')
  if(!map_id) {
    console.log("Error, No map id!")
    return
  }
  $.ajax({
    url:`/fav`,
    type:'POST',
    data: {
      favourited: favourited,
      map_id: map_id
    },
    success: function() {
       $('.fav').toggleClass('favourited')
    }
  })
})


 $(".controls").on('click', 'div.delete_map', function(){
    // event.preventDefault();
   console.log("deleting map...")
    let map_id = $("#map").data('map_id')
    $.ajax({
        url:`/map/delete`,
        type:'POST',
        data: {
        map_id: map_id
        },
        success: function() {
          location.reload()
      }
    })
  })
// needs to match the map ID on the fav..
// $.ajax({
//   url: `/user/favourites`,
//   type:'GET',
//   success: function(result) {
//     allArray(result, highlight)
//   }
// })



