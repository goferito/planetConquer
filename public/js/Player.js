
var Player = function(name, color, ai, scene){
  this.name = name;
  this.color = color;
  this.ai = ai || function(){};

  // esto igual no hace falta no?
  this.scene = scene;

};


/**
 * Returns an array with the planets owned by the player
 */
Player.prototype.getMyPlanets = function(){
  var _this = this;
  return this.scene.getPlanets()
                   .filter(function(p){
                      return p.owner == _this.name;
                    });
};


Player.prototype.getPlanets = function(){
  return this.scene.getPlanets();
};


Player.prototype.getMyFleets = function(){
  return this.scene.getFleets().filter(function(f){
    return f.owner == this.name;
  });
};


Player.prototype.getFleets = function(){
  return this.scene.getFleets();
};


Player.prototype.sendFleet = function(origin, dest, ships){
  if(origin.owner != this.name){
    console.error('Player sending a fleet from a not owned Planet');
    return;
  }

  this.scene.sendFleet(origin, dest, ships)
  
};

/**
 * Take the decisions
 */
Player.prototype.command = function(){

  console.log(this.scene.get);
  
};


