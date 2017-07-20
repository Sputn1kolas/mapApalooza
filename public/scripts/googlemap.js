var map;
var marker;
var infowindow;
var messagewindow;
let editable = false

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
$(".pointFormm").ajaxSubmit({url: 'maps/map1/point1/new', type: 'post'}) //change map1, point1

// .on('submit', function(event) {
//   event.preventDefault();
//   let string = $("textarea").serialize()
//   let stringRaw = $("textarea").val()
//   $.ajax({
//       type:'POST',
//       url:'/main/:user/:map',
//       data : string,
//       success: function() {
//         loadNewTweets()
//       }
//     });
// });
