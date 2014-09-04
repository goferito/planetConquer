
var culoVeo = function(){
  
  // For each of my planets, check which other planets I can conquer
  // and send just the necessary ships to it

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

// Just for testing
var justSayHi = function(){
  console.log('I\'m ' + this.name + ', reporting planets situation:');
  console.log(this.getPlanets());
};


// Necesito el objeto player, que implemente metodos como
// getMyPlanets
// getAllPlanets
// getMyFleets
// y asi no puede hacer trampa poniendo como origen planetas
// ajenos

function init(){

  var turnTime = 2000; // Players can send ships every second

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

