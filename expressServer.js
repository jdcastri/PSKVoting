var express = require("express");
var mongoskin = require("mongoskin");
var irv = require("./public/js/instantRunOff.js");
var db = mongoskin.db('localhost:27017/tripleT?auto_reconnect', {safe: true}); 

var app = express.createServer();

app.listen(8888);
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.static(__dirname));
app.param('collectionName', function(req, res, next, collectionName){
	req.collection = db.collection(collectionName);
	return next();
});

app.get('/', function(req, res) {
	
	app.use(express.static(__dirname + "/views"));
	res.render('index', {
				layout: false,
			stylesheets: ["style.css",
					"bootstrap/css/bootstrap.min.css",
					'http://fonts.googleapis.com/css?family=Montserrat']
	});
});

app.get('/voting', function(req, res) {
	db.collection('voting').find().sort({_id:-1}).limit(10).toArray(function(err, result) {
		var tenMostRecentElections = [];
		for(var i=0; i<result.length; i++) {
			tenMostRecentElections.push([result[i].name, result[i]._id]);
		}
		
		res.render('newElection', {
			stylesheets: ["views/bootstrap/css/bootstrap.min.css",
					"/views/main.css",
					"views/polls_voting.css",
					'http://fonts.googleapis.com/css?family=Montserrat'],
			scripts: ['http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
				"public/js/newElection.js"],
			tenElections: tenMostRecentElections
		});
	});
});

app.post('voting/submitNewElection', function(req,res) {
	function hasNoEmptyFields(arr) {
		for(var i=0; i<arr.length; i++) {
			if(!arr[i]) return false;
		}
		return true;
	}
	
	if(req.body && req.body.electionName && req.body.candidates && hasNoEmptyFields(req.body.candidates)) {
		var candidatesArr = req.body.candidates;
		db.collection('voting').insert({ 
						name: req.body.electionName,
						candidates: candidatesArr,
						votes: []
				}, function(err, result) {
					if (err) throw err;
					if (result) {
						console.log('Added!');
						var id = result[0]._id.valueOf();
						res.redirect('/voting/' + id, 302)
					}
		});
	} else {
		res.send("empty Fields");
	}
	
});	

app.get('/voting/:id', function(req, res) {
	vote = [];
	var candidates = [];
	var title = "default";

	db.collection('voting').findOne({_id: db.ObjectID.createFromHexString(req.params.id + '')}, function(err, result) {
		if(err) throw err;
		if(result) {
			console.log("found entry");
			candidates = result.candidates;
			title = result.name;

			res.render('voting', {
					voteID: req.params.id,
					ElectionTitle: title,
					'candidates': candidates,
					stylesheets: ["/views/bootstrap/css/bootstrap.min.css",
							"/views/main.css",
							"/views/voting_style.css",
							'http://fonts.googleapis.com/css?family=Montserrat'],
					scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', 
						"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js",
						'/public/js/jquery.sortable.js',
						'/public/js/interaction.js']
			});
			console.log("Page rendered");
		}
	});

});

app.get('voting/winner/:id', function(req, res) {
	db.collection('voting').findOne({_id: db.ObjectID.createFromHexString(req.params.id + '')}, function(err,result) {
		if(err) throw err;
		if(result) {
			var allVotes = result.votes;
			var winner = irv.runVoting(allVotes);
			res.send(winner);
		}
	});
});

app.post('voting/sendVote/:id', function(req, res) {
	if (req.body && req.body.input) {
		vote = req.body.input.split(','); 
		db.collection('voting').update({_id: db.ObjectID.createFromHexString(req.params.id + '')}, {'$push':{votes: vote}}, function(err) {
			if(err) throw err;
			console.log("Updated votes!");
		});

		if(acceptsHtml(req.headers['accept'])) {
			res.redirect('/voting/' + req.params.id, 302)
		} else {
			res.send({status:"ok", message:"Vote received"})
		}

	} else {
		//no vote?
		res.send({status:"nok", message:"No vote received"});
	}
});

app.get('/polls', function(req, res) {
	db.collection('polls').find().sort({_id:-1}).limit(10).toArray(function(err, result) {
		var tenMostRecentElections = [];
		for(var i=0; i<result.length; i++) {
			tenMostRecentElections.push([result[i].name, result[i]._id]);
		}

		res.render('polls', {
			tenPolls: tenMostRecentElections,
			stylesheets: ["/views/bootstrap/css/bootstrap.min.css",
					"/views/main.css",
					"views/polls_voting.css",
					'http://fonts.googleapis.com/css?family=Montserrat'],
			scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', 
				 "/public/js/newPoll.js"]
		});
	});
});

app.post('/polls/submit', function(req,res) {
	function hasNoEmptyFields(arr) {
		for(var i=0; i<arr.length; i++) {
			if(!arr[i]) return false;
		}
		return true;
	}
	
	if(req.body && req.body.pollName && req.body.options && hasNoEmptyFields(req.body.options)) {
		var optionsArr = req.body.options;
		var type = req.body.type;
		console.log(type);
		db.collection('polls').insert({ 
						name: req.body.pollName,
						type: type,
						options: optionsArr,
						votes: []
				}, function(err, result) {
					if (err) throw err;
					if (result) {
						console.log('Added!');
						var id = result[0]._id.valueOf();
						res.redirect('/polls/' + id, 302)
					}
		});
	} else {
		res.send("empty Fields");
	}
	
});	

app.get('/polls/:id', function(req, res) {
	db.collection('polls').findOne({_id: db.ObjectID.createFromHexString(req.params.id + '')}, function(err, result) {
		if(err) throw err;
		if(result) {
			console.log("found entry");
			var options = result.options;
			var title = result.name;

			res.render('poll_template', {
					pollID: req.params.id,
					pollTitle: title,
					options: options,
					votes: result.votes,
					type: result.type,
					stylesheets: ["/views/bootstrap/css/bootstrap.min.css",
							"/views/main.css",
							"/views/poll_template.css",
							'http://fonts.googleapis.com/css?family=Montserrat'],
					scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', 
						"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js",
						'/public/js/jquery.sortable.js',
						'/public/js/poll_interaction.js']
			});
			console.log("Page rendered");
		}
	});

});

app.post('/polls/submit/:id', function(req, res) {
	if(req.body && req.body.input){
		var obj = JSON.parse(req.body.input);
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

function acceptsHtml(header) {
  var accepts = header.split(',')
  for(i=0;i<accepts.length;i+=0) {
    if (accepts[i] === 'text/html') { return true }
  }

  return false
}
