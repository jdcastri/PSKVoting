var http = require('http');
var assert = require('assert');

var opts = {
  host: 'localhost',
  port: 8000,
  path: '/send',
  method: 'POST',
  headers: {'content-type':'application/x-www-form-urlencoded'}
}

var request = http.request(opts, function(res) {
	res.setEncoding('utf8');
	var data = ""
	res.on('data', function(d) {
		data += d
	})

	res.on('end', function() {
		assert.strictEqual(data, '{"status":"ok","message":"Tweet received"}')
	})
})
