$(document).ready(function() {
	var candidateID = 1;

	$(document).on('click', '.removeCandidate', function() {
		var id = $(this).attr('id').substring('removeBtn'.length);
		$('#newCandidate' + id).remove();
		$('#removeBtn' + id).remove();
	});

	$('.addCandidate').click(function() {
		var newCand = '<input id="newCandidate' + candidateID + '" class="form-control" type="text" name="candidates" placeholder="new candidate">';
		var remCandBtn = '<span class="removeCandidate glyphicon glyphicon-minus-sign" id="removeBtn' + candidateID + '"></span>';
		var newRow = newCand + remCandBtn;
		$(newRow).insertBefore('.submit');
		candidateID = candidateID + 1;
	});

});
