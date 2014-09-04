
function init(){

  var turnTime = 2000; // Players can send ships every two seconds

  var conquerors = [
    { name: 'Saa',  color: 'blue',  ai: culoVeo },
    { name: 'Adam', color: 'red',   ai: culoVeo },
    { name: 'Tilo', color: 'green', ai: culoVeo }
  ];


  var canvas = document.getElementById('battlefield');
  var context = canvas.getContext('2d');

  var myScene = new Scene(conquerors,
                          30,
                          context);

  myScene.startDrawing();

  var players = conquerors.map(function(c){
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

