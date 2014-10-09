var Scene = require('./Scene');
var AI = require('./AI');
var Player = require('./Player');

var conquerors_config = {
  conquerors: [
    { name: 'Saa',  color: 0x3333ff,  ai: AI.culoVeo },
    { name: 'Adam', color: 0xff3333,   ai: AI.culoVeo },
    { name: 'Tilo', color: 0x33ff00, ai: AI.culoVeo },
    { name: 'Ray',  color: 0x33ffff,  ai: AI.culoVeo }
  ],

  conquerorsInitialShips: 30
};

function init(){
  // Players can send ships every two seconds
  var turnTime = 2000;

  var myScene = new Scene(conquerors_config.conquerors,
                          conquerors_config.conquerorsInitialShips);

  var players = conquerors_config.conquerors.map(function(c){
    return new Player(c.name, c.color, c.ai, myScene);
  });

  setInterval(function(){
    // Each player sends the fleets they want to
    players.forEach(function(player){
      player.ai();
    });

    myScene.growRatios();
  }, turnTime)
}

window.onload = init;

