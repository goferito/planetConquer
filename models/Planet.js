
var Planet = function(x, y, ratio, ships, owner){

  this.getPosition = function(){
    return [x, y];
  };

  this.getRatio = function(){
    return ratio;
  };

  this.getShips = function(){
    return ships;
  };

  this.setShips = function(shipsNumber){
    ships = shipsNumber;
    return ships;
  }

  this.getOwner = function(){
    return owner
  };
  
  this.setOwner = function(name){
    owner = name;
    return owner;
  };

};


/**
 * Calculates the distance between the two planets
 * @param <Planet> planet - The other planet
 * @return <Number> Distance between this and the other planet
 */
Planet.prototype.getDistanceTo = function(planet){

  //TODO implement this
  return 0;
  
};

module.exports = Planet;
