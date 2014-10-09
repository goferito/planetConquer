var shipMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2));
var loader = new THREE.JSONLoader();

loader.load('assets/ship/ship.json', function (geometry, materials) {
  var ship = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
  shipMesh = ship;
  shipMesh.scale.set(1.5, 1.5, 1.5);
});

var Fleet = function (origin, dest, amount, color) {
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

  return ships;
};

module.exports = Fleet;
