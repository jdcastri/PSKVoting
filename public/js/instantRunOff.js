// votes is a double array. 
// Rows are a single person's votes.
// Order of candidates in a row determines preference
function runVoting(votes) {
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
// @param:votes is a double array.
// returns first candidate from every vote
function getFirstPicks(votes){
	var firstPicks = [];
	for (var i=0; i<votes.length; i++) {
		firstPicks.push(votes[i][0]);
	}
	return firstPicks;
}
	
// @param:votes is an 1D array of candidates.
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

// @param:numVotes is total number of votes
// @param:freqVotes is an Object with candidates as keys and freq of votes as values
// returns: array - if winner is found: [boolean:true, String: candidate]
// 		if winner is not found: [boolean:false, null]
function getWinner(numVotes, freqVotes) {
	var majority = Math.floor(numVotes/2) + 1;
	for (var key in freqVotes) {
		if (freqVotes[key] >= majority) {
			return [true, key];
		}
	}
	return [false, null];
}

// @param:freqVotes is an Object with candidates as keys and freq of votes as values
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
