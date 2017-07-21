$(document).ready(function(){
  function createListMap (obj){
    let article = $("<article>").addClass("list_item");
    let header = $("<header>").text(obj.title);
    let main = $("<main>");
    let divImg = $("<div>").addClass("item_img");
    let itemImg = $("<img>").attr("src", obj.img_url);
    let divDesc = $("<div>").addClass("item_description").text(obj.desc);
    let footer = $("<footer>");
    let divFav = $ ("<div>").addClass("numberFavs").text("obj.numberFavs");
    let iFav = $("<i>").addClass("fa fa-heart");
    let divPoints = $("<div>").addClass("numberPoints").text(obj.numberPoints);
    divImg.append(itemImg);
    divFav.append(iFav);
    main.append(divImg, divDesc);
    footer.append(divFav, divPoints);
    article.append(header, main, footer);
    return article;
  };

  function renderListMap (arr) {
    for (let i = 0; i < arr.length; i++){
      let listMap = createListMap(arr[i]);
      $("#every_item_container").append(listMap);
    }
  };

  function loadListMaps(){
    $.ajax({
      url: "/maps",
      method: "GET",
      success: function (result){
      renderListMap(result);
      }
    })
  };

  loadListMaps();

  function createPoint (obj){
    let article = $("<article>").addClass("point_item");
    let header = $("<header>").text(obj.title);
    let main = $("<main>");
    let divImg = $("<div>").addClass("point_img");
    let pointImg = $("<img>").attr("src", obj.img_url);
    let divDesc = $("<div>").addClass("point_description").text(obj.description);
    divImg.append(pointImg)
    main.append(divImg, divDesc);
    article.append(header, main);
    return article;
  };

  function renderListPoint (arr) {
    for (let i = 0; i < arr.length; i++){
      let listPoint = createPoint(arr[i]);
      $("#point_container").append(listPoint);
    }
  };

  // function loadListPoints(){
  //   $.ajax({
  //     url: "/maps/:map/point",
  //     method: "GET",
  //     success: function (result){
  //     renderListPoint(result);
  //     }
  //   })
  // };

  // loadListPoints();

})