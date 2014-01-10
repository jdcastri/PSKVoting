// votes is a double array. Rows are a single person's votes.
function runVoting(arr) {
	var votes = $.extend(true, [], arr);
	if (votes.length == 0) { return "No votes"; }

	var numVotes = votes.length;
	var isWinner = false;
	var winner = "";
	while(!isWinner){
		if (votes[0].length==0) { return "Error"; }
		var firstPicks = getFirstPicks(votes);	
		var freqVotes = countVotes(firstPicks);
		var x = getWinner(numVotes, freqVotes);
		isWinner = x[0];
		winner = x[1];
		if (!isWinner) {
			var loser = isLoser(freqVotes);
			removeLoser(loser);
		}
		
	}
	return winner;

	function removeLoser(loser) {
		for (var i=0; i<votes.length; i++) {
			for(var j=0; j<votes[i].length; j++) {
				if (votes[i][j] == loser) {
					votes[i].splice(j, 1);
					break;
				}
			}
		}
	}
}
//votes is a double array.
// returns first element from every vote
function getFirstPicks(votes){
	var firstPicks = [];
	for (var i=0; i<votes.length; i++) {
		firstPicks.push(votes[i][0]);
	}
	return firstPicks;
}
	
// votes is an 1D array of votes.
// Returns Object with candidates as keys and freq of votes as values
function countVotes(votes) {
	var freqVotes = {};
	for (var i=0; i<votes.length; i++) {
		if (!(votes[i] in freqVotes)) {
			freqVotes[votes[i]] = 1;
		} else {
			freqVotes[votes[i]] += 1;
		}
	}
	return freqVotes;
}

// numVotes is total number of votes
// freqVotes is an Object with candidates as keys and freq of votes as values
// returns array [boolean, null/winner string]
function getWinner(numVotes, freqVotes) {
	var majority = Math.floor(numVotes/2) + 1;
	for (var key in freqVotes) {
		if (freqVotes[key] >= majority) {
			return [true, key];
		}
	}
	return [false, null];
}
				
// returns the person with the least amount of votes
function isLoser(freqVotes) {
	var losingVotes = 1000;
	var loser = "";
	for (var key in freqVotes) {
		if (freqVotes[key] <= losingVotes) {
			losingVotes = freqVotes[key];
			loser = key;
		}
	}
	return loser;
}

module.exports.runVoting = runVoting;
