$(document).ready(function()  {
	// activate Sortable HTML 5 library
	$('.sortable').sortable();

	// when submitting a vote
	// add order of candidates into hidden text field in form for post request
	$('.submit').click(function() {
		$('.hiddeninput').val('');
		// children has order of votes
		var children = [];
		$('.sortable li').each(function(i, elem) {
		    children.push($(elem).text());
		});

		$('.hiddeninput').val(children);
	
		$('#wrapper').append('<span id="voteConfirmation">Vote Received</span>');
	});

	// redirect to winner page of specific election
	$('.results').click(function() {
		var url = window.location;
		var id = url.href.substring(url.href.indexOf('/voting/') + '/voting/'.length);
		$(location).attr('href', 'voting/winner/' + id); 
	});

});
