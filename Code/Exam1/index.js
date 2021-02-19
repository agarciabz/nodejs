var express = require('express')
  , http = require('http')
  , path = require('path')
  , environments = require('./environments')
  , bodyParser = require('body-parser')
  , { loginRouter } = require('./business/login/login')
  , { continentsRouter} = require('./business/countries/continents')
  , { citiesRouter} = require('./business/cities/cities')
  , favicon = require('express-favicon');

var app = express();
// all environments
environments.setEnvironment(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())
app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use('/public', express.static(__dirname + '/public', {fallthrough: false}));




// Default handler
app.all('/api/countries', (req, res, next) => {
  let whitelist = app.get('whitelist');
  let whitelistDynamic = app.get('whitelistDynamic');
  // if(!whitelist || !whitelist.includes(req.url)){
  //   res.sendStatus(400);
  // }

  // if(whitelistDynamic && !whitelistDynamic.some((element)=>element.includes(req.url))){
  //   res.sendStatus(400);
  // }

  next();
});

// Default handler
app.all('*', (req, res, next) => {
  let whitelist = app.get('whitelist');
  let whitelistDynamic = app.get('whitelistDynamic');
  // if(!whitelist || !whitelist.includes(req.url)){
  //   res.sendStatus(400);
  // }

  // if(whitelistDynamic && !whitelistDynamic.some((element)=>element.includes(req.url))){
  //   res.sendStatus(400);
  // }

  next();
});


instance = app.listen(app.get('port'), () => {
  console.log(`Application listening on ${app.get('port')}`);
}).on('error', (error, req, res) => {
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});   // <- EXCEPTION
  }
});

//middleware 
app.use('/api/login', loginRouter);
app.use('/api/countries', continentsRouter);
app.use('/api/cities', citiesRouter);
app.use(function (err, req, res, next) {
  if ('development' == app.get('env')) {
    return res.status(500).send(err.stack);
  }
  res.status(500).send('Something broke!');
});

