
function init(){

  // Players can send ships every two seconds
  var turnTime = 3000;

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

