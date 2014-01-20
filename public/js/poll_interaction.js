$(document).ready( function() {

	// when a cell in the table is pressed - make it green
	$(document).on('click','td#colorable', function() {
		// if poll is a "single" poll - only make one element green at a time
		if($('#type').html() == "Single") {
			var willTurnOn = !($(this).hasClass('green'));
			$('td#colorable').removeClass('green');
			if(willTurnOn)
				$(this).addClass('green');
		// if poll is a "multiple" poll - more than one cell can be green
		} else {
			$(this).toggleClass('green');
		}
	});

	// send post request to server
	$('#btn').click( function() {
		var children = $('tr:nth-last-child(2)').children();
		// votes is an array that holds ("1" or "0") corresponding if the cell is green or not
		var votes = new Array();
		for (var i=1; i<children.length; i++) {
			votes[i-1] = $(children[i]).hasClass('green') ? '1' : '0';
		}

		// request object is added to hidden text field and will ultimately be sent to server
		var request = {};
		request['user'] = $('#initials').val();
		request['vote'] = votes; 

		$('#hidden').val(JSON.stringify(request));
	});
});
