$(document).ready(function() {
	var optionID = 1;

	// when remove button is pressed - removes corresponding input field and button
	$(document).on('click', '.removeOption', function() {
		var id = $(this).attr('id').substring('removeBtn'.length);
		$('#newOption' + id).remove();
		$('#removeBtn' + id).remove();
	});

	// when add button is pressed - adds new input field
	$('.addOption').click(function() {
		var newOpt = '<input id="newOption' + optionID + '" class="form-control" type="text" name="options" placeholder="new option">';
		var remOptBtn = '<span class="removeOption glyphicon glyphicon-minus-sign" id="removeBtn' + optionID + '"></span>';
		var newRow = newOpt + remOptBtn;
		$(newRow).insertBefore('.submit');
		optionID = optionID + 1;
	});
});

