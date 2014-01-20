$(document).ready( function() {

	$(document).on('click','td#colorable', function() {
		$(this).toggleClass('green');
	});

	$('#btn').click( function() {
		var children = $('tr:nth-last-child(2)').children();
		var votes = new Array();
		for (var i=1; i<children.length; i++) {
			votes[i-1] = $(children[i]).hasClass('green') ? '1' : '0';
		}

		var request = {};
		request['user'] = $('#initials').val();
		request['vote'] = votes; 

		$('#hidden').val(JSON.stringify(request));
	});
});
