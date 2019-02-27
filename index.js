var express = require('express')
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var cors = require('cors')
var { check, validationResult } = require('express-validator/check');

var fs = require('fs');

var intercomAccessToken
if (fs.existsSync('./credentials/intercom.credentials.json')) {
  intercomAccessToken = JSON.parse(fs.readFileSync('./credentials/intercom.credentials.json', 'utf8')).accessToken;
  if(!intercomAccessToken) {
    return new Error("Bad configuration. Missing 'Intercom' access token")
  }
} else if(process.env.intercom_access_token) {
  intercomAccessToken = process.env.intercom_access_token;
} else {
  console.log("Please define 'Intercom' access token either as env variable 'intercom_access_token' or in './credentials/intercom.credentials.json' ");
  return new Error("Bad configuration. Missing 'Intercom' access token")
}


var Intercom = require('intercom-client');
var SubscriptionService = require('./domain/service/subscription.service');
var IntercomService = require('./domain/service/intercom.service');
var intercomClient = new Intercom.Client({ token: intercomAccessToken });
var subscriptionService = new SubscriptionService(new IntercomService(intercomClient))

var app = express()

/**
* @api {get} /api/v1/subscription/preferences Get user preferences
* @apiName Get user preferences
* @apiPermission allowAll
* @apiGroup Preference
*
* @apiParam  {String} [email] Email
*
* @apiSuccess (200) {Object} mixed `Preferences` object
*/
app.get('/api/v1/users/subscriptions/preferences', [
  check('email').isEmail(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  subscriptionService.getSubscriptionPreferences(req.query.email, function(preferences) {
  	res.json(preferences);
  });
});

app.post('/api/v1/users/subscriptions', [
  check('email').isEmail(),
  check('channel').isLength({ min: 4 })
  ],(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  subscriptionService.subscribeUserToChannel(req.body.email, req.body.channel, function(r) {
  	subscriptionService.getSubscriptionPreferences(req.body.email, function(preferences) {
      res.json(preferences);
    });
  });
});

app.delete('/api/v1/users/subscriptions', [
  check('email').isEmail(),
  check('channel').isLength({ min: 4 })
  ],(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  subscriptionService.unsubscribeUserFromChannel(req.body.email, req.body.channel, function(r) {
  	subscriptionService.getSubscriptionPreferences(req.body.email, function(preferences) {
      res.json(preferences);
    });
  });
});

app.use(cors())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
var public = path.join(__dirname, 'public');
app.get('/', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
app.use(express.static(__dirname + '/public'))
app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
