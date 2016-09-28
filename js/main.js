var map = "";
var iconFeatures = [];

var lon = -0.240065;
var lat = 51.445687;
var zoom = 16;
var scale = 0.1;
var firstUpdate = true;

var vectorSource = new ol.source.Vector({
	  features: iconFeatures
});
	
function loadStuff()
	{
			// http://macdud-001-site1.itempurl.com/api/WebApp/GetBeacons/
			// http://webapi.local.com/api/WebApp/GetBeacons/
			$.ajax({
			url: "http://macdud-001-site1.itempurl.com/api/WebApp/GetBeacons/",
			cache: false,
			async: true,
			crossDomain: true,
			data: { maxGet : 5, longitude : lon.toString(), latitude: lat.toString(), range : '15.4', category: 0, forceUpdate: firstUpdate}, 
            dataType: 'jsonp',
			timeout: 120000,
			callback: jCallback(),
			success: function(data){
			  console.log( "Load was performed. " + data + " " + data.mapObjects[0].Icon);
			  firstUpdate = false;
			  
			  //clear old data
			  iconFeatures = [];
			  vectorSource.clear();
	
			  // load player data
			  	
			var iconData = {title:'Maciej Dudzinski', text: 'Good lad'};
			addIcon(iconData,lon, lat, 0.1, 'logo.png');
	
			  $.each( data.mapObjects, function(  key, value ){
					 addObject(value.Longitude,value.Latitude,value.Icon,value.Title,value.Description);
				});
			 
			  
			     $(".someText").append("<p>Load was performed. " + data.message + "</p>");
			     loadStuff();
				}
			,error: function(xhr, status, error)
			{
				if(status === 'timeout')
				{
					//xhr.abort()
					loadStuff();
				}
				else
				{	xhr.abort()
					console.log( "Error: " + xhr + " / " + status + " / " + error);
				}
			}
			});
	}

function jCallback(data)
{
	//console.log(data);
};

function loadMap()
{	 
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
	
	
	  clickEvents();
	  	
		
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
	  })),
	  text: new ol.style.Text({
                        textAlign: "Start",
                        textBaseline: "Middle",
                        font: 'Normal 12px Arial',
                        text: data.title,
                        fill: new ol.style.Fill({
                            color: '#ffa500'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#000000',
                            width: 3
                        }),
                        offsetX: -1 * data.title.length,
                        offsetY: -1 * data.title.length,
                        rotation: 0
                    })
	  
	});
	
	iconStyle.Text = new ol.style.Text({}
	
	
	);

	iconFeature.setStyle(iconStyle);
	
	iconFeatures.push(iconFeature);
	
	vectorSource.clear();
	vectorSource.addFeatures(iconFeatures);

}

function addObject(lo,la,icon,title_val,text_val)
{
			var coord = ol.proj.transform([lo, la], 'EPSG:3857', 'EPSG:4326');
			console.log(lo + " " + la );
			var data = {title : title_val, text : text_val};
			addIcon(data,lo, la, 0.3, icon);
}

function clickEvents()
{
	// display popup on click
	map.on('click', function(evt) {
		
	   var feature = map.forEachFeatureAtPixel(evt.pixel,
		   function(feature, layer) {
			 return feature;
		   });
	   if (feature) {
		 var data = feature.get('oData');
		 showPanel(data);
		 
	   } else {
			var coord = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
			var lo = coord[0];
			var la = coord[1];
			//addObject(lo,la,'fire.png');
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

function showPanel(data)
{
	$("#myPanel").panel("open");
	$('.panel-title').html(data.title);
	$('.panel-text').html(data.text);

	// $('#closePanel').onclick = function()
	// {
		// $('#myPanel').panel("close");
	// }
	
	// When the user clicks anywhere outside of the modal, close it
	// window.onclick = function(event) {
		// if (event.target == modal) {
			// modal.style.display = "none";
		// }
	// }
	
}
		
		
$( document ).ready(function() {
		loadStuff();
		loadMap();

});

