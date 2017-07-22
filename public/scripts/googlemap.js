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
    zoom: 15
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
  let description = $("input[name='description']").val()
  let img_url = $("input[name='img_url']").val()
  let address = $("input[name='address']").val()
  let lat =  Number(marker.getPosition().lat())
  let long = Number(marker.getPosition().lng())

  $.ajax({
      url:'/maps/${map_id}/point/new',
      type:'POST',
      data: {
        title: title,
        description: description,
        img_url: img_url,
        lat: Number(lat),
        long: Number(long),
        address: address
      },
      success: function(res) {
        console.log(res)
      }
    });
  toggleDescriptions();
});

$(".point_item").on('click', function(){
  event.preventDefault();
  clearMarkers()
  let map_id = $(this).data('map_id')
  $.ajax({
      url:`/maps/${map_id}/`,
      type:'GET',
      success: function(mapObject) {
        console.log(mapObject)
        changeMap(title, description, map_id)
      }

      // data: {
      //   title: title,
      //   description: description,
      //   img_url: img_url,
      //   lat: lat,
      //   long: long,
      //   address: address
      // }
  })
  $.ajax({
      url:`/${map_id}/points`,
      type:'GET',
      success: function(returnObject) {
        console.log(returnObject)
        //renderPoints(returnObject.points_db)
      }
  })
})

// for all points passed to it shows them on screen and generates a box below
function renderPoints(points_db){
  for(point in points_db) {
    let pointObject = points_db[point]
    let latLng = {lat: Number(pointObject.lat), lng: Number(pointObject.long)};
    let marker = new google.maps.Marker({   //change this to ID later
       position: latLng,
       map: map,
       icon: image
    });
    markers.push(marker)
    newPointDescription(pointObject.title, pointObject.address, pointObject.description, "point_id", pointObject.img_url)
  }
}

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

// make a point description box down below the map
function newPointDescription(title, address, description, point_id, img_url) {
  let newPoint =
  `<div class="row" data-point_id="${point_id}">
      <div class="col-6 offset-1 point_information">
      <img src="${img_url}">
      <h1> ${title}   </h1>
      <h3> ${address} </h3>
      <p>  ${description}  </p>
      </div>
    </div>`
  $(".map_information_container").prepend(newPoint)
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
  $('.map_title').text(title)
  $('.map_description').text(description)
  $('#map').data('map_id', map_id)
}

// $('row').data('point_id', "new point id")

// var myMarker = new google.maps.Marker({
//     position: new google.maps.LatLng(47.651968, 9.478485),
//     draggable: true
// });

// google.maps.event.addListener(myMarker, 'dragend', function (evt) {
//     document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
// });

