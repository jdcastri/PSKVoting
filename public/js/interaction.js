$(document).ready(function()  {
	$('.sortable').sortable();

	$('#submit').click(function() {
		$('.hiddeninput').val('');
		var children = [];
		$('li').each(function(i, elem) {
		    children.push($(elem).text());
		});

		$('.hiddeninput').val(children);
	});

});
