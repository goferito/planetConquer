var shipMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
var loader = new THREE.JSONLoader();

loader.load('assets/ship/ship.json', function (geometry, materials) {
  var ship = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
  shipMesh = ship;
  shipMesh.scale.set(1.5, 1.5, 1.5);
});

var Fleet = function (origin, dest, amount, color) {
  this.origin = origin;
  this.dest = dest;
  this.color = color;
  this.ships = amount;
  this.owner = origin.owner;
  this.start = new Date();

  // Generate mesh

  var ships = new THREE.Object3D();

  var material = new THREE.MeshFaceMaterial([
    new THREE.MeshPhongMaterial({color: color, shininess: 50}),
    new THREE.MeshPhongMaterial({color: color, shininess: 5})
  ]);

  var r = origin.mesh.radius;

  for(var i = 0; i < amount; i++) {
    var mesh = shipMesh.clone();

    mesh.material = material;

    var dx = Math.random() * amount - amount / 2;
    var dy = Math.random() * amount - amount / 2;
    var dz = Math.random() * amount - amount / 2;

    mesh.position.x = Math.min(Math.max(dx, -r), r);
    mesh.position.y = Math.min(Math.max(dy, -r), r);
    mesh.position.z = Math.min(Math.max(dz, -r), r);

    mesh.scale.set(1.5, 1.5, 1.5);

    ships.add(mesh);
  }

  ships.position.copy(origin.mesh.position);

  this.mesh = ships;
};

Fleet.prototype.getMesh = function () {
  return this.mesh;
};

Fleet.prototype.getSpline = function (scene) {
  var splineTargets = [];
  var halfWayOffsetVector = new THREE.Vector3(0, 50, 0);

  var intersectionPathDirection = Math.random() > 0.5;

  var directLine = this.dest.mesh.position
    .clone()
    .sub(this.origin.mesh.position);

  var direction = directLine.clone().normalize();

  var startPosition = this.origin.mesh.position.clone();
  startPosition.add(direction.clone().multiplyScalar(this.origin.mesh.radius));

  splineTargets.push(startPosition);

  var intersections = scene.intersectPlanets(
    this.origin,
    this.dest,
    directLine.length()
  );

  intersections.forEach(function (intersect) {
    var pos = intersect.position.clone();
    pos.y += (intersectionPathDirection ? intersect.radius : -intersect.radius) * 2;
    splineTargets.push(pos);
  });

  if(intersections.length === 0) {
    var halfWayPosition = startPosition.clone().add(directLine.clone().multiplyScalar(0.5));

    if(intersectionPathDirection)
      halfWayPosition.add(halfWayOffsetVector);
    else
      halfWayPosition.sub(halfWayOffsetVector);

    splineTargets.push(halfWayPosition);
  }

  var destPosition = this.dest.mesh.position.clone();
  splineTargets.push(destPosition);

  // randomize y offsets
  for(var i = 1; i < splineTargets.length - 1; i++)
    splineTargets[i].y += Math.random() * 30 - 15;

  var spline = new THREE.SplineCurve3(splineTargets);

  return spline;
};

module.exports = Fleet;
