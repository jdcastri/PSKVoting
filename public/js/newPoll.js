$(document).ready(function() {
	var optionID = 1;

	$(document).on('click', '.removeOption', function() {
		var id = $(this).attr('id').substring('removeBtn'.length);
		$('#newOption' + id).remove();
		$('#removeBtn' + id).remove();
	});

	$('.addOption').click(function() {
		var newOpt = '<input id="newOption' + optionID + '" class="form-control" type="text" name="options" placeholder="new option">';
		var remOptBtn = '<span class="removeOption glyphicon glyphicon-minus-sign" id="removeBtn' + optionID + '"></span>';
		var newRow = newOpt + remOptBtn;
		$(newRow).insertBefore('.submit');
		optionID = optionID + 1;
	});
});

