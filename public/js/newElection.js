$(document).ready(function() {
	var candidateID = 1;

	// when remove button is pressed - removes corresponding input field
	$(document).on('click', '.removeCandidate', function() {
		var id = $(this).attr('id').substring('removeBtn'.length);
		$('#newCandidate' + id).remove();
		$('#removeBtn' + id).remove();
	});

	// when add button is pressed - adds new input 
	$('.addCandidate').click(function() {
		var newCand = '<input id="newCandidate' + candidateID + '" class="form-control" type="text" name="candidates" placeholder="new candidate">';
		var remCandBtn = '<span class="removeCandidate glyphicon glyphicon-minus-sign" id="removeBtn' + candidateID + '"></span>';
		var newRow = newCand + remCandBtn;
		$(newRow).insertBefore('.submit');
		candidateID = candidateID + 1;
	});

});
