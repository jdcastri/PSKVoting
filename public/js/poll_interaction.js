$(document).ready( function() {

	$(document).on('click','td#colorable', function() {
		if($('#type').html() == "Single") {
			var willTurnOn = !($(this).hasClass('green'));
			$('td#colorable').removeClass('green');
			if(willTurnOn)
				$(this).addClass('green');
		} else {
			$(this).toggleClass('green');
		}
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
