$(document).ready(function(){

  function createListItem (obj){
    let article = $("<article>").addClass("list_item");
    let header = $("<header>").text(obj.title);
    let main = $("<main>");
    let divImg = $("<div>").addClass("item_img");
    let itemImg = $("<img>").attr("src", "#");
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

  function renderListItem (arr) {
    for (let i = 0; i < arr.length; i++){
      let listItem = createListItem(arr[i]);
      $("#every_item_container").append(listItem);
    }
  };

  knex.select('title', 'description', 'img_url', 'COUNT (map_points.id) AS points')
      .from('map')
      .join('maps', function (){
        this.on('maps',)
      })
})