
//  Predefinie
function onAppReady() {
    if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
        navigator.splashscreen.hide() ;
    }
}
document.addEventListener("app.Ready", onAppReady, false) ;


// My Own Code
function init_map () {
  choix=window.localStorage.choix;
  if(typeof(choix) == "undefined"){
    choix=1;
  }
  $.fn.raty.defaults.path = 'images/';
  //Create Map
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWhtZWQyMTAwIiwiYSI6ImNkMTk2ZjA1ZWE5NmZjNzQ2ZDUzZTk1NDZmNmNkZmE0In0.WuhZjt1ylyzrQq76zfh64A';
  var map = L.mapbox.map('map', 'mapbox.streets').setView([37.8, -96], 4)

  //Read Data
  var featureLayer = L.mapbox.featureLayer().loadURL('data.json').addTo(map).setFilter(
    
      function (feature) {
        if(choix==1){
            return (feature.properties["marker-symbol"] === "restaurant");
        }
        if(choix==4){
            return (feature.properties["marker-symbol"] === "museum");
        }
        if(choix==2){
            return (feature.properties["marker-symbol"] === "monument");
        }
        if(choix==3){
            return (feature.properties["marker-symbol"] === "lodging");
        }                         
      }            
  );;


  // fit Bounads to Markers
  featureLayer.on('ready', function() {
      map.fitBounds(featureLayer.getBounds());
  });


  // Add custom popup html to each marker.
  featureLayer.on('layeradd', function(e) {
      var marker = e.layer;
      var feature = marker.feature;
      var image = feature.properties.image;
      var desc = feature.properties.description;
      var title = feature.properties.title;    
      var rating = feature.properties.stars;    

      var slideshowContent = '<div class="image">' +
                                '<img class="img2" src="images/' + image + '" />' +
                                '<div class="caption">' + desc + '</div>' +
                              '</div>';

      // Create custom popup content
      var popupContent =  '<div id="'+ feature.properties.id +'"+class="popup">' +
                              '<h2 class="title">' + title + '</h2>' +
                              '<div class="slideshow">' +
                                  slideshowContent +
                              '</div><div id="rating" data-score="'+rating+'"></div><div id="hint"></div>' +'</div>';
      // http://leafletjs.com/reference.html#popup
      marker.bindPopup(popupContent,{
          closeButton: true,
          minWidth: 320
      });
      


      //marker.setIcon(L.icon({"iconUrl": "images/h.png","iconSize": [100, 100],"iconAnchor": [50, 50],"popupAnchor": [0, -55],"className": "dot"}));
  });


  // Ajouter la partie Vote.
  featureLayer.on('click', function(e) {
        $('#rating').raty({
          scoreName: 'entity[score]',
          readOnly: true,
          score: function() {
            return $(this).attr('data-score');
          }
        });      
  });

}