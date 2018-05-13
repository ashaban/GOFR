const express = require('express')
const bodyParser = require('body-parser')
const oauthserver = require('node-oauth2-server')
const port = 3000
const oAuthModel = require('./oauth/model')()

const app = express(); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.oauth = oauthserver({
  model: oAuthModel,
  grants: ['password'],
  accessTokenLifetime:3600,
  debug: true
});
 
//get access token
app.all('/oauth/token', app.oauth.grant());

//register user
app.post('/oauth/registerUser',  function (req, res) {
	oAuthModel.saveUsers(req.body.firstname,req.body.lastname,req.body.username,req.body.password,req.body.email,(err)=>{
		if(err) {
			res.status(401).send(err)
		}
		else {
			res.send('User Created');
		}
	})
})

app.get('/test', app.oauth.authorise(), (req,res)=>{
	res.send("Authorised")
})
 
app.use(app.oauth.errorHandler());
 
app.listen(port);
console.log("Listening on " + port)
