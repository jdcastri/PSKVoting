var express = require("express");

var app = express.createServer();
app.listen(8888);

var candidates = ["Person 1", "Person 2", "Person 3"];
var votes = [];

app.get('/', function(request, response) {
	var title = "Voting", 
	header = "welcome to voting";

	response.render('index.ejs', {
		locals: {
			'title': title,
			'header': header,
			'candidates': candidates,
			'votes': votes,
			stylesheets: ["public/style.css"],
			scripts: ['jquery.sortable.js', 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js']
		}
	});
});

app.post('/send', express.bodyParser(), function(req, res) {
  if (req.body && req.body.input) {

   votes = req.body.input.split(','); 
    if(acceptsHtml(req.headers['accept'])) {
      res.redirect('/', 302)
    } else {
      res.send({status:"ok", message:"Vote received"})
    }

  } else {
    //no vote?
    res.send({status:"nok", message:"No vote received"})
  }
})

app.get('/vote', function(request, response) {
	response.send(candidates);
});

function acceptsHtml(header) {
  var accepts = header.split(',')
  for(i=0;i<accepts.length;i+=0) {
    if (accepts[i] === 'text/html') { return true }
  }

  return false
}
