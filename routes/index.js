

var Scene = require('../models/Scene')
  , Player = require('../models/Player')
  

var culoVeo = function(){
  
  var _this = this;

  _this.getMyPlanets().forEach(function(myPlanet){

    _this.getPlanets().forEach(function(planet){

      // Don't send a fleet to a planet I already own
      if(planet.owner == _this.name) return;

      if(myPlanet.ships > planet.ships){
        _this.sendFleet(myPlanet, planet, planet.ships + 1);
      }
      
    });

  });

};

var gameConfig = {
  conquerors: [
    { name: 'Ramin',  color: 'blue',   ai: culoVeo },
    { name: 'Vlad',   color: 'red',    ai: culoVeo },
    { name: 'Ray',    color: 'green',  ai: culoVeo },
    { name: 'Adam',   color: 'yellow', ai: culoVeo },
    { name: 'Shivan', color: 'pink',   ai: culoVeo }
  ],
  initialShips: 50
};


/*
 * GET home page.
 */
exports.index = function(io){

  return function(req, res){
    
    var turnTime = 5000
      , maxGameTime = 1000 * 60 * 5

    var scene = new Scene(gameConfig.conquerors,
                          gameConfig.initialShips);

    var players = gameConfig.conquerors.map(function(c){
      return new Player(c.name, c.color, c.ai, scene);
    });

    res.render('index', { title: 'Planet Conquer' });

    // Esperar a que llege por el socket que todo esta cargado
    io.on('connection', function(socket){
      console.log('new connection:', socket.id);

      var gameInterval = setInterval(function(){
        // Each player sends the fleets they want to
        players.forEach(function(player){
          player.ai();
        });
        scene.growRatios();
        
        socket.emit('update_scene', scene)
      }, turnTime);

      // Finish the game after if taking too long
      setTimeout(function(){
        clearInterval(gameInterval);
      }, maxGameTime);

    });


    // Empezar el juego y empezar a enviar la escena a cada tick

  };
    
};
