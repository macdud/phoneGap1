var map = "";
var iconFeatures = [];

var vectorSource = new ol.source.Vector({
	  features: iconFeatures
});
	
function loadStuff()
	{
			/*http://macdud-001-site1.itempurl.com/api/*/
			$.ajax({
			url: "http://macdud-001-site1.itempurl.com/api/WebApp/GetResults",
			cache: false,
			async: true,
			crossDomain: true,
            dataType: 'jsonp',
			callback: jCallback(),
			success: function(data){
			  //console.log( "Load was performed. " + data );
			  $(".someText").append("<p>Load was performed. " + data.message + "</p>");
					//loadStuff();
				}
			,error: function(xhr, status, error)
			{
				//console.log( "Error");
				 $(".someText").append("<p>Error" + xhr + " / " + status + " / " + error + "</p>");
				
			}
			});
	}

function jCallback(data)
{
	//console.log(data);
};

function loadMap()
{
	 var lon = -0.240065;
	 var lat = 51.445687;
	 var zoom = 16;
	 var scale = 0.1;
	 

	var vectorLayer = new ol.layer.Vector({
	  source: vectorSource
	});

      map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),vectorLayer
        ],
        target: 'map',
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }),
        view: new ol.View({
          center: [0,0],
          zoom: 0
        })
      });
	
	  centerMap(lon, lat, zoom);
	
	var iconData = {title:'Maciej Dudzinski', text: 'Good lad'};
	addIcon(iconData,lon, lat, 0.1, 'logo.png');
	
	
	  addPopup();
	  	
		
      document.getElementById('zoom-out').onclick = function() {
        var view = map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom - 1);
      };

      document.getElementById('zoom-in').onclick = function() {
        var view = map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom + 1);
      };
};

function centerMap(lon, lat, zoom) 
{
		console.log("Long: " + lon + " Lat: " + lat);
		map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
		map.getView().setZoom(zoom);
}

function addIcon(data,lon, lat, scale, type)
{
	var iconFeature = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.transform([lon,lat], 'EPSG:4326',     
              'EPSG:3857')),
		name: 'Feature',
		oData: data,
		population: 4000,
		rainfall: 500
	});

	var iconStyle = new ol.style.Style({
	  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		anchor: [lon+ 0.5, lat+0.5],
		anchorXUnits: 'fraction',
		anchorYUnits: 'pixels',
		opacity: 0.75,
		scale : scale,
		src: 'img/' + type
	  }))
	});

	iconFeature.setStyle(iconStyle);
	
	iconFeatures.push(iconFeature);
	
	vectorSource.clear();
	vectorSource.addFeatures(iconFeatures);

}

function addPopup()
{
	// display popup on click
	map.on('click', function(evt) {
		
	   var feature = map.forEachFeatureAtPixel(evt.pixel,
		   function(feature, layer) {
			 return feature;
		   });
	   if (feature) {
		 var data = feature.get('oData');
		 showModal(data);
		 
	   } else {
			var coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
			var lon = coord[0];
			var lat = coord[1];
			console.log(lon + " " + lat );
			var data = {title : 'Fire !!!', text : 'some text'};
			addIcon(data,lon, lat + 0.0001, 0.05, 'fire.png');
	   }
	});

	 // change mouse cursor when over marker
	 map.on('pointermove', function(e) {
	   // if (e.dragging) {
		 // $(element).popover('destroy');
		 // return;
	   // }
	   var pixel = map.getEventPixel(e.originalEvent);
	   var hit = map.hasFeatureAtPixel(pixel);
	   //map.getTarget().style.cursor = hit ? 'pointer' : '';
	   $('.map').css('cursor' , hit == true ? 'pointer' : 'auto');
	 });
}

function showModal(data)
{
	var modal = document.getElementById('myModal');
	$('.modal-title').html(data.title);
	$('.modal-text').html(data.text);
	modal.style.display = "block";

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
	
}
		
		
$( document ).ready(function() {
		loadStuff();
		loadMap();

});

