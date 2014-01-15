$(document).ready(function()  {
	$('.sortable').sortable();

	$('.submit').click(function() {
		$('.hiddeninput').val('');
		var children = [];
		$('.sortable li').each(function(i, elem) {
		    children.push($(elem).text());
		});

		$('.hiddeninput').val(children);
	
//		$('#wrapper').append("<span id=\"voteConfirmation\">Vote Received</span>");
	});

});
