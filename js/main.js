var map = "";
var iconFeatures = [];

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
	 
	 
	addIcon(lon, lat, 0.1, 'logo.png');
	
	addIcon(lon + 0.005, lat, 0.05, 'fire.png');
	
	var vectorSource = new ol.source.Vector({
	  features: iconFeatures
	});

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
	  
	  //addPopup();
	  
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

function addIcon(lon, lat, scale, type)
{
	var iconFeature = new ol.Feature({
		geometry: new ol.geom.Point(ol.proj.transform([lon,lat], 'EPSG:4326',     
              'EPSG:3857')),
		name: 'Null Island',
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

}

function addPopup()
{
	var element = document.getElementById('popup');

	var popup = new ol.Overlay({
	  element: element,
	  positioning: 'bottom-center',
	  stopEvent: false
	});
	map.addOverlay(popup);

	// display popup on click
	map.on('click', function(evt) {
	  var feature = map.forEachFeatureAtPixel(evt.pixel,
		  function(feature, layer) {
			return feature;
		  });
	  if (feature) {
		popup.setPosition(evt.coordinate);
		$(element).popover({
		  'placement': 'top',
		  'html': true,
		  'content': feature.get('name')
		});
		$(element).popover('show');
	  } else {
		$(element).popover('destroy');
	  }
	});

	// change mouse cursor when over marker
	map.on('pointermove', function(e) {
	  if (e.dragging) {
		$(element).popover('destroy');
		return;
	  }
	  var pixel = map.getEventPixel(e.originalEvent);
	  var hit = map.hasFeatureAtPixel(pixel);
	  map.getTarget().style.cursor = hit ? 'pointer' : '';
	});
}
		
		
$( document ).ready(function() {
		loadStuff();
		loadMap();

});

