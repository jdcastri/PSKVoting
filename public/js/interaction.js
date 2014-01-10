$(document).ready(function()  {
	$('.sortable').sortable({
		handle: '.handle'
	});

	$('#submit').click(function() {
		$('.hiddeninput').val('');
		var children = [];
		$('li').each(function(i, elem) {
		    children.push($(elem).text());
		});

		$('.hiddeninput').val(children);
		console.log(children);
	});

});
