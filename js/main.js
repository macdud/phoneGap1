var app = {

    findByName: function() {
        console.log('findByName');
        this.store.findByName($('.search-key').val(), function(employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    },
	
       
	 // This optional function html-encodes messages for display in the page.
      
    initialize: function() {
        this.store = new MemoryStore();
		var   htmlEncode = function(value) {
            var encodedValue = $('<div />').text(value).html();
            return encodedValue;
        }
		
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
		 
		
        }
	

};

function loadStuff()
	{
			$.ajax({
			url: "http://macdud-001-site1.itempurl.com/api/",
			cache: false,
			async: false,
			crossDomain: true,
            dataType: 'jsonp',
			success: function(data){
			  //console.log( "Load was performed. " + data );
			  $(".employee-list").append("<p>Load was performed. " + data + "</p>");
					loadStuff();
				}
			,error: function(xhr, status, error)
			{
				//console.log( "Error");
				 $(".employee-list").append("<p>Error" + xhr + " / " + status + " / " + error + "</p>");
				//app.loadStuff();
			}
			});
	}


$( document ).ready(function() {
    app.initialize();
		loadStuff();


});

