
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var Twitter = require('twitter');

const express = require('express');
const app = express();
const port = 3000;

var client = new Twitter({
	consumer_key: 'phciyZdcqTNsBD2FkzXEJKYPn',
	consumer_secret: 'EZPaIUdqsT1KLYRfuNtGWYys3VH2unKeDrgeHrlKtwDRiKsEVo',
	access_token_key: '941269271044411392-AjAVEALiRdfrFXfBTmFj2csEEcbsqJA',
	access_token_secret: 'dAVB4bIbnhLuIb88L3amrlw2y8GoYMCPtFk63V1eU0QUB'
});

app.get('/api', urlencodedParser, (request, responce) => {
    responce.send("server is working");
});

app.post('/post', urlencodedParser, (request, responce) => {
	
	console.log("success");
	var params = {screen_name: 'nodejs'};
	client.post('statuses/update', {status: request.body.time+' '+request.body.x+' '+request.body.y+' '+request.body.z},  function(error, tweet, response) {
		if(error) throw error;
		console.log(tweet);  // Tweet body.
		console.log(response);  // Raw response object.
	});
    responce.send(request.body.time);
});

app.listen(port, (err) => {
    if(err) {
        return console.log('Error: ', err);
    }
    console.log(`server is listening on ${port}`)
});