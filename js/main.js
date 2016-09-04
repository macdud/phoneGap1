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
		alert("loading");
        this.store = new MemoryStore();
		var   htmlEncode = function(value) {
            var encodedValue = $('<div />').text(value).html();
            return encodedValue;
        }
		
        $('.search-key').on('keyup', $.proxy(this.findByName, this));
		  // Reference the auto-generated proxy for the hub.
            $.connection.hub.url = 'http://macdud-001-site1.itempurl.com/signalr/hubs';
			alert("created connection hub");
            var chat = $.connection.hubClass;
			var displayName = 'Maciej'; //prompt('Enter your name:', '')
            // Create a function that the hub can call back to display messages.
            chat.client.addNewMessageToPage = function (name, message) {
                // Add the message to the page.
                $('#discussion').append('<li><strong>' + htmlEncode(name)
                    + '</strong>: ' + htmlEncode(message) + '</li>');
            };
            // Get the user name and store it to prepend to messages.
            $('#displayname').val(displayName); 
            // Set initial focus to message input box.
            $('#message').focus();

            chat.client.hello = function (message) {
                $('#discussion').append('<li><strong>' + htmlEncode(message) + '</li>');
            };

            // Start the connection.
            $.connection.hub.start({ jsonp: true }).done(function () {
					alert("connection done");
                $('#sendmessage').click(function () {
                    // Call the Send method on the hub.
                    chat.server.send(displayName, $('#message').val());
                    // Clear text box and reset focus for next comment.
                    $('#message').val('').focus();
                });
            }).fail(function(e) {
				alert('Connection Error ' + e);
		});
        }

};



$( document ).ready(function() {
    app.initialize();
});
