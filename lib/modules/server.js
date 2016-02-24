function startServer(options) {
  var port = options.port;
  // Ignore start server if we already have instance running
  var serverInstance = process.env['STYLEGUIDE_SERVER_INST'];
  if (!serverInstance) {
    serverInstance = sgServer(options);
    process.env['STYLEGUIDE_SERVER_INST'] = serverInstance;
    serverInstance.app.set('port', port);
    serverInstance.server.listen(serverInstance.app.get('port'), function() {
      console.log('Express server listening on port ' + serverInstance.server.address().port);
    }).on('error', function(error) {
      if (error.code === 'EADDRINUSE') {
        console.error('Port:' + port + ' is already in use.');
        console.error('Please provide port using --port <port>');
      }
    });
  }
  return serverInstance;
}

function sgServer(options) {
  var app,
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    basicAuth = require('basic-auth-connect'),
    io,
    server,
    socket;

  app = express();

  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  if (options.basicAuth) {
    app.use(basicAuth(options.basicAuth.username, options.basicAuth.password));
  }

  app.use(express.static(options.rootPath));

  // Let Angular handle all routing
  app.all('/*', function(req, res) {
    res.sendFile(path.resolve(options.rootPath + '/index.html'));
  });

  // Catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // Setup socket.io
  server = require('http').Server(app);
  socket = require('socket.io')(server);
  io = require('./io')(socket, options);

  return {
    app: app,
    server: server,
    io: io
  };
};

module.exports = function(options) {
  startServer(options);
}
