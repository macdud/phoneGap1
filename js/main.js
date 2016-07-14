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

    initialize: function() {
        this.store = new MemoryStore();
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
		
		var options = {
		  enableHighAccuracy: true,
		  timeout: 5000,
		  maximumAge: 0
		};

		function success(pos) {
		  var crd = pos.coords;
		  
		  var output = 'Your current position is: ' +  'Latitude : ' + crd.latitude + 'Longitude: ' + crd.longitude;
		  $('#textBox').append(output);
		  console.log('Your current position is:');
		  console.log('Latitude : ' + crd.latitude);
		  console.log('Longitude: ' + crd.longitude);
		  console.log('More or less ' + crd.accuracy + ' meters.');
		};

		function error(err) {
		  console.warn('ERROR(' + err.code + '): ' + err.message);
		  
		  $('#textBox').append('ERROR(' + err.code + '): ' + err.message);
		};

		navigator.geolocation.getCurrentPosition(success, error, options);
	
    }

};

app.initialize();