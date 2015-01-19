var PlanetMaterials = require('./PlanetMaterials');

var id = 0;

var getRandomMaterial = function () {
  var randomIndex = Math.round(Math.random() * PlanetMaterials.length);
  return PlanetMaterials[(id++ + randomIndex) % PlanetMaterials.length];
};

var getScreenPosition = function (camera, position) {
  var vector = this.projector.projectVector(position.clone(), camera);
  vector.x = (vector.x + 1)/2 * window.innerWidth;
  vector.y = -(vector.y - 1)/2 * window.innerHeight;
  return vector;
};

var Planet = function (ratio, ships) {
  this.ratio = ratio;
  this.ships = ships;

  var radius = this.ratio * 5;

  this.mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    getRandomMaterial()
  );

  this.mesh.radius = radius;

  this.oclMesh = new THREE.Mesh(
    this.mesh.geometry.clone(),
    new THREE.MeshBasicMaterial({color: 0x000000})
  );

  this.oclMesh.position.copy(this.mesh.position);

  var labels = document.createElement('div');
  labels.className = 'planetLabel';
  labels.style.top = '-1000px';
  labels.style.left = '-1000px';

  var shipsLabel = document.createElement('label');
  shipsLabel.className = 'ships';
  labels.ships = shipsLabel;
  labels.appendChild(shipsLabel);

  var ownerLabels = document.createElement('label');
  ownerLabels.className = 'owner';
  labels.owner = ownerLabels;
  labels.appendChild(ownerLabels);

  this.labels = labels;

  document.body.appendChild(labels);
};

Planet.prototype.updateLabelPosition = function (camera) {
  var screenPosition = getScreenPosition(camera);
  this.labels.style.top = parseInt(screenPosition.y) + 'px';
  this.labels.style.left = parseInt(screenPosition.x) + 'px';
};

Planet.prototype.updateLabels = function () {
  this.labels.ships.innerText = this.ships;
  if(!this.owner) {
    this.labels.owner.style.visibility = 'hidden';
  } else {
    this.labels.owner.innerText = this.owner;
    this.labels.owner.style.visibility = 'visible';

    var color = new THREE.Color(this.getConquerorColor(this.owner));

    var bg = 'rgba(' +
      color.r * 255 + ', ' +
      color.g * 255 + ', ' +
      color.b * 255 + ', 0.35)';

    this.labels.owner.style.backgroundColor = bg;
  }
};

module.exports = Planet;
