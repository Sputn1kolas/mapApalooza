var map;
var marker;
var infowindow;
var messagewindow;
let latLng =

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
   map: map
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
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

function initMap() {
  var crew = {lat: 45.5023, lng: -73.5592};
  map = new google.maps.Map(document.getElementById('map'), {
    center: crew,
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
  let title = $("input[name='title']").val()
  let description = $("input[name='description']").val()
  let img_url = $("input[name='img_url']").val()
  let address = $("input[name='address']").val()
  let lat =  marker.getPosition().lat()
  let long = marker.getPosition().lng()
  $.ajax({
      url:'/maps/map1/point/new',
      type:'POST',
      data: {
        title: title,
        description: description,
        img_url: img_url,
        lat: lat,
        long: long,
        address: address
      },
      success: function(res) {
        console.log(res)
      }
    });
  toggleDescriptions();
});


// var myMarker = new google.maps.Marker({
//     position: new google.maps.LatLng(47.651968, 9.478485),
//     draggable: true
// });

// google.maps.event.addListener(myMarker, 'dragend', function (evt) {
//     document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
// });

