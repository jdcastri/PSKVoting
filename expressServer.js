var express = require("express");
var irv = require("./public/js/instantRunOff.js");

var app = express.createServer();
app.listen(8888);

var candidates = ["Person 1", "Person 2", "Person 3"];
var vote = [];
var allVotes = [];

app.get('/', function(req, res) {
	
	app.use(express.static(__dirname + "/views"));
	res.render('index.ejs', {
		locals: {
			stylesheets: ["style.css",
					"bootstrap.css",
					'http://fonts.googleapis.com/css?family=Montserrat'],
			scripts: []
		}
	});
});

app.get('/voting', function(request, response) {
	vote = [];
	var title = "Voting", 
	header = "welcome to voting";

	app.use(express.static(__dirname));
	response.render('voting.ejs', {
		locals: {
			'candidates': candidates,
			stylesheets: ["voting_style.css"],
			scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', 
				"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js",
				'public/js/jquery.sortable.js',
				'public/js/interaction.js']
		}
	});
});

app.get('/winner', function(req, res) {
	var winner = irv.runVoting(allVotes);
	res.send(winner);
});

app.post('/send', express.bodyParser(), function(req, res) {
  if (req.body && req.body.input) {
   vote = req.body.input.split(','); 
   allVotes.push(vote);

    if(acceptsHtml(req.headers['accept'])) {
      res.redirect('/voting', 302)
    } else {
      res.send({status:"ok", message:"Vote received"})
    }

  } else {
    //no vote?
    res.send({status:"nok", message:"No vote received"})
  }
})

app.get('/votes', function(request, response) {
	response.send(allVotes);
});

function acceptsHtml(header) {
  var accepts = header.split(',')
  for(i=0;i<accepts.length;i+=0) {
    if (accepts[i] === 'text/html') { return true }
  }

  return false
}
