
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// TODO
// El mapa tiene que generarse aletoriamente.
//
// En la partida solo hay 2 jugadores.
//
// Solo se puede desafiar al rival que esta una posicion
// por delante en el ranking.
// Si gana, sube una posicion.
//
// La partida tiene que acabar en 5 minutos, si no es un
// empate y no se sube posicion.
//
// Mola llevar un log de cada vez que alguien sube de posicion,
// y enviar un mail al que acaba de ser superado para picarle
//
//
// Abrir un web socket.
// Solo se puede ejecutar un juego de cada vez.
// La partida se retransmite por el socket
//
app.get('/', routes.index(io));

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
