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

app.get('/newElection', function(req, res) {
	db.collection('voting').find().sort({_id:-1}).limit(10).toArray(function(err, result) {
		var tenMostRecentElections = [];
		for(var i=0; i<result.length; i++) {
			tenMostRecentElections.push([result[i].name, result[i]._id]);
		}
		
		res.render('newElection', {
			stylesheets: ["views/bootstrap/css/bootstrap.min.css",
					"/views/main.css",
					"views/newElection.css",
					'http://fonts.googleapis.com/css?family=Montserrat'],
			scripts: ['http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
				"public/js/newElection.js"],
			tenElections: tenMostRecentElections
		});
	});
});

app.post('/newElectionSubmit', function(req,res) {
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

app.get('/winner/:id', function(req, res) {
	db.collection('voting').findOne({_id: db.ObjectID.createFromHexString(req.params.id + '')}, function(err,result) {
		if(err) throw err;
		if(result) {
			var allVotes = result.votes;
			var winner = irv.runVoting(allVotes);
			res.send(winner);
		}
	});
});

app.post('/send/:id', express.bodyParser(), function(req, res) {
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

function acceptsHtml(header) {
  var accepts = header.split(',')
  for(i=0;i<accepts.length;i+=0) {
    if (accepts[i] === 'text/html') { return true }
  }

  return false
}
