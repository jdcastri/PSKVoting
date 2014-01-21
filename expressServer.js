// load modules
var express = require("express");
var mongoskin = require("mongoskin");
var db = mongoskin.db('localhost:27017/tripleT?auto_reconnect', {safe: true}); 

// instant Run Off voting algorithm - use irv.runVote() to run algorithm
var irv = require("./public/js/instantRunOff.js");

// shortened file paths
var bootstrapCSS = "bootstrap/css/bootstrap.min.css";
var monserratFont = 'http://fonts.googleapis.com/css?family=Montserrat';
var jqueryLib = 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js';

// specify server requirements
var app = express.createServer();
app.listen(8888);
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.static(__dirname));

// get home page
app.get('/', function(req, res) {
	app.use(express.static(__dirname + "/views"));
	res.render('index', {
				layout: false,
			stylesheets: ["index.css",
					bootstrapCSS,
					monserratFont]
	});
});

// get voting homepage
app.get('/voting', function(req, res) {
	// get last 10 elections from db
	db.collection('voting').find().sort({_id:-1}).limit(10).toArray(function(err, result) {
		var tenMostRecentElections = [];
		for(var i=0; i<result.length; i++) {
			tenMostRecentElections.push([result[i].name, result[i]._id]);
		}
		
		res.render('voting', {
			stylesheets: ["views/" + bootstrapCSS,
					"/views/main.css",
					"views/polls_voting.css",
					monserratFont],
			scripts: [jqueryLib,
				"public/js/newElection.js"],
			tenElections: tenMostRecentElections
		});
	});
});

// handle post request of newly created election. Redirects to /voting/ + id
app.post('voting/submitNewElection', function(req,res) {
	if(req.body && req.body.electionName && req.body.candidates && hasNoEmptyFields(req.body.candidates)) {
		db.collection('voting').insert({ 
						name: req.body.electionName,
						candidates: req.body.candidates,
						votes: []
				}, function(err, result) {
					if (err) throw err;
					if (result) {
						console.log('Election Added: ' + req.body.electionName);
						var id = result[0]._id.valueOf();
						res.redirect('/voting/' + id, 302)
					}
				});
	} else {
		res.send("empty Fields");
	}
});	

// get election specified by id
app.get('/voting/:id', function(req, res) {
	// look up election in db
	db.collection('voting').findOne({_id: db.ObjectID.createFromHexString(req.params.id + '')}, function(err, result) {
		if(err) throw err;
		if(result) {
			console.log("found election" + result.name);
			res.render('voting_template', {
					voteID: req.params.id,
					ElectionTitle: result.name,
					candidates: result.candidates,
					stylesheets: ["/views/" + bootstrapCSS,
							"/views/main.css",
							"/views/voting_template.css",
							monserratFont],
					scripts: [ jqueryLib, 
						"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js",
						'/public/js/jquery.sortable.js',
						'/public/js/interaction.js']
			});
		}
	});

});

// get Winner of election with :id. Runs Instant Run Off voting algorithm on votes
app.get('voting/winner/:id', function(req, res) {
	// gets all votes from db
	db.collection('voting').findOne({_id: db.ObjectID.createFromHexString(req.params.id + '')}, function(err,result) {
		if(err) throw err;
		// runs algorithm
		if(result) {
			var winner = irv.runVoting(result.votes);
			res.send(winner);
		}
	});
});

// submit vote to election :id
app.post('voting/sendVote/:id', function(req, res) {
	if (req.body && req.body.input) {
		vote = req.body.input.split(','); 
		// push new vote into db
		db.collection('voting').update({_id: db.ObjectID.createFromHexString(req.params.id + '')}, {'$push':{votes: vote}}, function(err) {
			if(err) throw err;
			console.log("Vote is cast!");
			// redirect back to election
			res.redirect('/voting/' + req.params.id, 302)
		});

	//no vote?
	} else {
		res.send({status:"nok", message:"No vote received"});
	}
});

// get polls homepage
app.get('/polls', function(req, res) {
	// get last 10 polls from db
	db.collection('polls').find().sort({_id:-1}).limit(10).toArray(function(err, result) {
		var tenMostRecentElections = [];
		for(var i=0; i<result.length; i++) {
			tenMostRecentElections.push([result[i].name, result[i]._id]);
		}

		res.render('polls', {
			tenPolls: tenMostRecentElections,
			stylesheets: ["/views/" + bootstrapCSS,
					"/views/main.css",
					"views/polls_voting.css",
					monserratFont],
			scripts: [ jqueryLib, 
				 "/public/js/newPoll.js"]
		});
	});
});

// handle post request from a newly created poll
// redirect to new poll page
app.post('/polls/submit', function(req,res) {
	if(req.body && req.body.pollName && req.body.options && hasNoEmptyFields(req.body.options)) {
		// insert new poll into db
		db.collection('polls').insert({ 
					name: req.body.pollName,
					type: req.body.type,
					options: req.body.options,
					votes: []
				}, function(err, result) {
					if (err) throw err;
					if (result) {
						console.log('New Poll Added: ' + req.body.pollName);
						var id = result[0]._id.valueOf();
						res.redirect('/polls/' + id, 302)
					}
		});
	} else {
		res.send("empty Fields");
	}
});	

// get poll with :id
app.get('/polls/:id', function(req, res) {
	db.collection('polls').findOne({_id: db.ObjectID.createFromHexString(req.params.id + '')}, function(err, result) {
		if(err) throw err;
		if(result) {
			console.log("found poll" + result.name);
			res.render('poll_template', {
					pollID: req.params.id,
					pollTitle: result.name,
					options: result.options,
					votes: result.votes,
					type: result.type,
					stylesheets: ["/views/" + bootstrapCSS,
							"/views/main.css",
							"/views/poll_template.css",
							monserratFont],
					scripts: [ jqueryLib, 
						"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js",
						'/public/js/jquery.sortable.js',
						'/public/js/poll_interaction.js']
			});
		}
	});

});

// submit new vote in poll with :id
// redirect to corresponding poll
app.post('/polls/submit/:id', function(req, res) {
	if(req.body && req.body.input){
		var obj = JSON.parse(req.body.input);
		// add vote to db
		db.collection('polls').update({_id: db.ObjectID.createFromHexString(req.params.id + '')}, {'$push': {votes: obj}}, function(err) {
			if(err) throw err;
			console.log('Received Vote');
		});		
		res.redirect('/polls/' + req.params.id, 302);
	}
	else {
		res.send("No input");
	}
});

/***************************** Helper Functions ******************************************/

function acceptsHtml(header) {
  var accepts = header.split(',')
  for(i=0;i<accepts.length;i+=0) {
    if (accepts[i] === 'text/html') { return true }
  }

  return false
}

function hasNoEmptyFields(arr) {
	for(var i=0; i<arr.length; i++) {
		if(!arr[i]) return false;
	}
	return true;
}
