var Scene = function(conquerors,
                     initialShips){

  this._numConquerors = conquerors.length;
  this._conquerors = conquerors.reduce(function(conqs, c){
    conqs[c.name] = c;
    return conqs;
  }, {});
  this._initialShips = initialShips;
  this._initialPlanetRatio = 5;
  this._planets = this.generatePlanets(conquerors,
                                       this._initialPlanetRatio,
                                       this._initialShips);
  this._fleets = [];
  this._speed = 0.05;

  this.initRenderer();
};

Scene.prototype.initRenderer = function () {
  // main scene
  this.scene = new THREE.Scene();
  this.sceneCube = new THREE.Scene();
  this.clock = new THREE.Clock();

  this.camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    15000
  );

  this.camera.position.y = 500;
  this.camera.position.z = 850;
  this.camera.lookAt(new THREE.Vector3(0,0,0));
  this.camera.updateMatrixWorld();
  this.cameraCube = this.camera.clone();

  this.controls = new THREE.OrbitControls(this.camera);
  this.controls.damping = 0.2;
  this.controls.maxDistance = 3500;
  this.controls.minDistance = 10;
  this.controls.rotateSpeed = 0.3;
  this.controls.addEventListener('change', this.onCameraChange.bind(this));

  var light01 = new THREE.PointLight(0xffffff, 1.0);
  this.scene.add(light01);

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 500, 0);
  this.scene.add(hemiLight);

  this.projector = new THREE.Projector();

  var urls = [
    'px.jpg', 'nx.jpg',
    'py.jpg', 'ny.jpg',
    'pz.jpg', 'nz.jpg'
  ].map(function(e) {
    return 'assets/env/' + e;
  });

  this.environmentMap = THREE.ImageUtils.loadTextureCube(urls);

  var shader = THREE.ShaderLib['cube'];
  shader.uniforms['tCube'].value = this.environmentMap;

  var material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });

  var skyBox = new THREE.Mesh(new THREE.BoxGeometry(5200, 5200, 5200), material);
  this.sceneCube.add(skyBox);
  this.scene.add(skyBox);

  var planetShininess = 40;
  this.planetMaterials = [
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/earthmap1k.jpg'),
      bumpMap: new THREE.ImageUtils.loadTexture('assets/earthbump1k.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/jupitermap.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/mars_1k_color.jpg'),
      bumpMap: new THREE.ImageUtils.loadTexture('assets/marsbump1k.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/mercurymap.jpg'),
      bumpMap: new THREE.ImageUtils.loadTexture('assets/mercurybump.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/neptunemap.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/plutomap1k.jpg'),
      bumpMap: new THREE.ImageUtils.loadTexture('assets/plutobump1k.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/saturnmap.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/venusmap.jpg'),
      bumpMap: new THREE.ImageUtils.loadTexture('assets/venusbump.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_1_d.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_2_d.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_3_d.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_4_d.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_5_d.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_7_d.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/Planet_Avalon_1600.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Dagobah1200.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Dam-Ba-Da1200.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Jinx1200.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Klendathu1200.jpg'),
      shininess: planetShininess,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Terminus1200.jpg'),
      shininess: planetShininess,
    }),
  ];

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });

  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setClearColor(0x000000);
  this.renderer.autoClear = false;

  //
  // occlusion scene
  //

  this.oclScene = new THREE.Scene();
  this.oclScene.add(new THREE.AmbientLight(0xffffff));
  this.sun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(32, 3),
    new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
  );

  this.sun.radius = 80;

  this.oclCamera = this.camera.clone();

  this.sun.position.set(0, 0, 0);
  this.oclScene.add(this.sun);

  var sunScene = this.sun.clone();
  sunScene.scale.set(1.2, 1.2, 1.2);
  this.scene.add(sunScene);

  //
  // OCL Composer
  //

  var renderTargetParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
    stencilBufer: false
  };

  this.oclRenderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth / 2,
    window.innerHeight / 2,
    renderTargetParameters
  );

  // Prepare the simple blur shader passes
  var bluriness = 1.0;
  hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
  vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);
  hblur.uniforms['h'].value = bluriness / window.innerWidth * 2;
  vblur.uniforms['v'].value = bluriness / window.innerHeight * 2;

  this.oclRenderPass = new THREE.RenderPass(this.oclScene, this.oclCamera);

  this.godrayPass = new THREE.ShaderPass(THREE.Extras.Shaders.Godrays);

  var godrayUniforms = this.godrayPass.material.uniforms;
  godrayUniforms.fExposure.value = 0.6;
  godrayUniforms.fDecay.value = 0.93;
  godrayUniforms.fDensity.value = 0.92;
  godrayUniforms.fWeight.value = 0.5;
  godrayUniforms.fClamp.value = 1.0;

  var copyPass = new THREE.ShaderPass(THREE.CopyShader);
  copyPass.needsSwap = true;
  copyPass.renderToScreen = true;

  this.oclComposer = new THREE.EffectComposer(this.renderer, this.oclRenderTarget);
  this.oclComposer.addPass(this.oclRenderPass);
  this.oclComposer.addPass(hblur);
  this.oclComposer.addPass(vblur);
  // this.oclComposer.addPass(hblur);
  // this.oclComposer.addPass(vblur);
  this.oclComposer.addPass(this.godrayPass);
  this.oclComposer.addPass(copyPass);

  //
  // Final Composer
  //

  this.mainRenderPass = new THREE.RenderPass(this.scene, this.camera);

  var finalPass = new THREE.ShaderPass(THREE.Extras.Shaders.Additive);
  finalPass.material.uniforms.tAdd.value = this.oclComposer.renderTarget1;
  finalPass.needsSwap = true;
  finalPass.renderToScreen = true;

  this.finalRenderTarget = new THREE.WebGLRenderTarget(
    this.renderer.domElement.width,
    this.renderer.domElement.height,
    renderTargetParameters
  );

  this.finalComposer = new THREE.EffectComposer(this.renderer, this.finalRenderTarget);
  this.finalComposer.addPass(this.mainRenderPass);
  this.finalComposer.addPass(finalPass);

  document.body.appendChild(this.renderer.domElement);

  this.render();

  var randomizePlanetMaterials = Math.round(Math.random() * this.planetMaterials.length);
  this._planets.forEach(function (planet, i) {
    var radius = planet.ratio * 5;
    var material = this.planetMaterials[(i + randomizePlanetMaterials) % this.planetMaterials.length];

    planet.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      material
    );

    planet.mesh.position.x = planet.x;
    planet.mesh.position.z = planet.y;
    // planet.mesh.position.y = radius;
    // planet.mesh.position.z = Math.random() * 400 - 200;
    planet.mesh.radius = radius;
    planet.mesh.sphere = new THREE.Sphere(planet.mesh.position, radius);

    this.scene.add(planet.mesh);

    var oclMesh = new THREE.Mesh(planet.mesh.geometry.clone(), new THREE.MeshBasicMaterial({color: 0x000000}));
    oclMesh.position.copy(planet.mesh.position);
    this.oclScene.add(oclMesh);

    var pos2d = this.toXYCoords(planet.mesh.position);

    var labels = document.createElement('div');
    labels.className = 'planetLabel';
    labels.style.top = parseInt(pos2d.y) + 'px';
    labels.style.left = parseInt(pos2d.x) + 'px';

    var shipsLabel = document.createElement('label');
    shipsLabel.className = 'ships';
    labels.ships = shipsLabel;
    labels.appendChild(shipsLabel);

    var ownerLabels = document.createElement('label');
    ownerLabels.className = 'owner';
    labels.owner = ownerLabels;
    labels.appendChild(ownerLabels);

    planet.labels = labels;

    this.updateLabels(planet);
    document.body.appendChild(labels);
  }.bind(this));

  this.animate();

  window.addEventListener('resize', this.onWindowResize.bind(this), false);

  // generate space garbage

  var material = new THREE.MeshPhongMaterial({color: 0x666666, shininess: 50});
  var box = new THREE.BoxGeometry(1, 1, 1);

  for(var i = 0; i < 800; i++) {
    var mesh = new THREE.Mesh(box, material);

    mesh.scale.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    mesh.position.x += Math.random() * 1200 - 600;
    mesh.position.z += Math.random() * 1200 - 600;
    mesh.position.y += Math.random() * 150 - 75;

    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

    this.scene.add(mesh);
    var oclMesh = new THREE.Mesh(box.clone(), new THREE.MeshBasicMaterial({color: 0x000000}));
    oclMesh.position.copy(mesh.position);
    oclMesh.rotation.copy(mesh.rotation);
    oclMesh.scale.set(2,2,2);
    this.oclScene.add(oclMesh);
  }

  // awesome ship model

  var loader = new THREE.JSONLoader();

  loader.load('assets/ship/ship.json', function (geometry, materials) {
    var ship = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    this.shipMesh = ship;
  }.bind(this));
  // setTimeout(function () {
  //   new TWEEN.Tween(this.sun.position)
  //     .to({x: 100, y: 100}, 4000)
  //     .start();
  // }.bind(this), 3000);
};

Scene.prototype.toXYCoords = function (pos) {
  var vector = this.projector.projectVector(pos.clone(), this.camera);
  vector.x = (vector.x + 1)/2 * window.innerWidth;
  vector.y = -(vector.y - 1)/2 * window.innerHeight;
  return vector;
};

/**
 * Returns position on screen in UV coordinates
 */
Scene.prototype.projectOnScreen = function (pos) {
  var vector = this.projector.projectVector(pos.clone(), this.camera)
    .multiplyScalar(0.5)
    .addScalar(0.5);
  return vector;
};

/**
 * Renders the 3d scene with Three.js
 * @param <float> dt - elapsed time since last frame
 */
Scene.prototype.render = function (dt) {
  this.cameraCube.rotation.copy(this.camera.rotation);
  this.cameraCube.position.copy(this.camera.position);

  this.oclCamera.rotation.copy(this.camera.rotation);
  this.oclCamera.position.copy(this.camera.position);

  this.oclComposer.render();
  this.finalComposer.render();
};

Scene.prototype.animate = function () {
  requestAnimationFrame(this.animate.bind(this));
  var dt = this.clock.getDelta();

  TWEEN.update();

  this._planets.forEach(function (p) {
    if(p.mesh)
      p.mesh.rotation.y += 0.15 * dt;
  });

  this.render(dt);
};

Scene.prototype.onCameraChange = function () {
  this.updateLabelPositions();

  var pos = this.projectOnScreen(this.sun.position);
  this.godrayPass.material.uniforms.fX.value = pos.x;
  this.godrayPass.material.uniforms.fY.value = pos.y;
};

Scene.prototype.updateLabelPositions = function () {
  this._planets.forEach(function (planet) {
    var pos2d = this.toXYCoords(planet.mesh.position);

    planet.labels.style.top = parseInt(pos2d.y) + 'px';
    planet.labels.style.left = parseInt(pos2d.x) + 'px';
  }.bind(this));
};

Scene.prototype.onWindowResize = function () {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.cameraCube.aspect = this.camera.aspect;
  this.cameraCube.updateProjectionMatrix();

  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.updateLabelPositions();
};

Scene.prototype.generatePlanets = function(conquerors,
                                           conquerorsRatio,
                                           conquerorsShips){
  //TODO create more maps
  var maps =  [
    [
      { x: -20, y: -300, ratio: 2, ships: 10 },
      { x: -80, y: 250, ratio: 2, ships: 10 },
      { x: -400, y: -260, ratio: 2, ships: 10 },
      { x: 400,  y: 220, ratio: 2, ships: 10 },
      { x: 100, y: 80, ratio: 2, ships: 10 },
      { x: 180, y: -110, ratio: 2, ships: 10 },
      { x: -420, y: 390, ratio: 4, ships: 10 },
      { x: -200, y: 100, ratio: 2, ships: 10 },
    ]
  ];

  //TODO test this
  var mapPos = Math.floor(Math.random() * maps.length)
    , map = maps[mapPos]

  //Put the players in the first planets
  conquerors.forEach(function(conq, i){
    map[i].owner = conq.name;
    map[i].ratio = conquerorsRatio;
    map[i].ships = conquerorsShips;
  });

  return map;
};

Scene.prototype.updateLabels = function (planet) {
  planet.labels.ships.innerText = planet.ships;
  if(!planet.owner) {
    planet.labels.owner.style.visibility = 'hidden';
  } else {
    planet.labels.owner.innerText = planet.owner;
    planet.labels.owner.style.visibility = 'visible';

    var color = new THREE.Color(this.getConquerorColor(planet.owner));
    var bg = 'rgba(' + color.r * 255 + ', ' + color.g * 255 + ', ' + color.b * 255 + ', 0.35)';
    planet.labels.owner.style.backgroundColor = bg;
  }
};

Scene.prototype.growRatios = function(){
  for(var i in this._planets){
    var p = this._planets[i];
    p.ships += p.ratio;
    this.updateLabels(p);
  }
};

/**
 * Returns the planets array
 */
Scene.prototype.getPlanets = function(){
  this.updateFleets();
  return this._planets;
};

/**
 * Returns the fleets array
 */
Scene.prototype.getFleets = function(){
  this.updateFleets();
  return this._fleets;
};

/**
 * Return the color established for the given conqueror
 *
 * @param <String> conqId - Id of the requested conqueror
 * @return <String> color
 */
Scene.prototype.getConquerorColor = function(conqId){
  return !conqId
           ? 'gray'
           : this._conquerors[conqId].color || 'gray';
};

/**
 * Removes the fleets that have already got to their destination
 */
Scene.prototype.updateFleets = function(){

    var t = new Date()
      , fleet;

    for(var i in this._fleets){
      fleet = this._fleets[i];

      var dist = getDistance(fleet.origin, fleet.dest)

        // Trip time
        , tt = dist / this._speed

        // Elapsed time
        , elapsed = t - fleet.start

        // Percent travelled
        , pTravelled = elapsed / tt;


      // If travelled 100% percent of the trip
      if(elapsed >= tt){

        // Add ships to the new planet
        if(fleet.owner != fleet.dest.owner){
          fleet.dest.ships -= fleet.ships;

          // If fleet contained more ships than the planet
          if(fleet.dest.ships < 0){
            fleet.dest.ships *= -1;

            // Planet Conquered!!
            fleet.dest.owner = fleet.owner;
          }

        }else{
          fleet.dest.ships += fleet.ships;
        }

        // Remove fleet from fleets list
        this._fleets.splice(i, 1);

      }

    }

};

/**
 * Returns the intersections with other planets
 */
Scene.prototype.intersectPlanets = function (origin, dest, maxDistance) {
  var ray = new THREE.Ray(origin.mesh.position, dest.mesh.position.clone().sub(origin.mesh.position).normalize());
  var intersections = [];

  this._planets.forEach(function (planet) {
    if(planet == origin || planet == dest) return;

    if(planet.mesh.position.distanceTo(origin.mesh.position) > maxDistance)
      return;

    var closestPoint = ray.closestPointToPoint(planet.mesh.position);
    var closestPointDistance = closestPoint.distanceTo(planet.mesh.position);
    if(closestPointDistance < planet.mesh.radius) {
      intersections.push({
        position: closestPoint,
        radius: planet.mesh.radius,
        direction: ray.direction
      });
    }
  });

  // interset with the sun

  var closestPoint = ray.closestPointToPoint(this.sun.position);
  var closestPointDistance = closestPoint.distanceTo(this.sun.position);
  if(closestPointDistance < this.sun.radius) {
    intersections.push({
      position: closestPoint,
      radius: this.sun.radius,
      direction: ray.direction
    });
  }

  return intersections;
};

Scene.prototype.createShips = function (origin, dest, amount) {
  var ships = new THREE.Object3D();
  var color = this.getConquerorColor(origin.owner);

  var material01 = new THREE.MeshPhongMaterial({color: color, shininess: 50});
  var material02 = new THREE.MeshPhongMaterial({color: color, shininess: 5});
  var d = 1.2;

  var r = origin.mesh.radius;

  for(var i = 0; i < amount; i++) {
    var mesh = this.shipMesh.clone();

    mesh.material.materials[0] = material01;
    mesh.material.materials[1] = material02;

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

Scene.prototype.getFleetSpline = function (origin, dest, halfWayOffsetVector) {
  var splineTargets = [];
  var halfWayOffsetVector = halfWayOffsetVector || new THREE.Vector3(0, 50, 0);

  var intersectionPathDirection = Math.random() > 0.5;

  var directLine = dest.mesh.position.clone().sub(origin.mesh.position);
  var direction = directLine.clone().normalize();

  var startPosition = origin.mesh.position.clone();
  startPosition.add(direction.clone().multiplyScalar(origin.mesh.radius));

  splineTargets.push(startPosition);

  var intersections = this.intersectPlanets(origin, dest, directLine.length());
  intersections.forEach(function (intersect) {
    var pos = intersect.position.clone();
    pos.y += (intersectionPathDirection ? intersect.radius : -intersect.radius) * 2;
    splineTargets.push(pos);
  });

  if(intersections.length == 0) {
    var halfWayPosition = startPosition.clone().add(directLine.clone().multiplyScalar(0.5));

    if(intersectionPathDirection)
      halfWayPosition.add(halfWayOffsetVector);
    else
      halfWayPosition.sub(halfWayOffsetVector);

    splineTargets.push(halfWayPosition);
  }

  var destPosition = dest.mesh.position.clone();
  splineTargets.push(destPosition);

  // randomize y offsets
  for(var i = 1; i < splineTargets.length - 1; i++)
    splineTargets[i].y += Math.random() * 30 - 15;

  var spline = new THREE.SplineCurve3(splineTargets);

  return spline;
};

Scene.prototype.sendFleet = function (origin, dest, ships) {
  // Check it's not trying to send more ships than the available
  if(origin.ships < ships) return false;

  // Substract the ships to be sent

  origin.ships -= ships;

  var distance = origin.mesh.position.distanceTo(dest.mesh.position);
  var tt = distance / this._speed;

  // Generate fleet route

  var spline = this.getFleetSpline(origin, dest);
  var geometry = new THREE.Geometry();
  var splinePoints = spline.getPoints(32);

  for(var i = 0; i < splinePoints.length; i++)
    geometry.vertices.push(splinePoints[i]);

  var splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color: this.getConquerorColor(origin.owner),
      transparent: true,
      opacity: 0.4
  }));

  this.scene.add(splineMesh);

  // Generate tiny 3d ships

  var shipsMesh = this.createShips(origin, dest, ships);
  this.scene.add(shipsMesh);

  // Add the fleet to the fleets array

  this._fleets.push({
    origin: origin,
    dest: dest,
    owner: origin.owner,
    ships: ships,
    start: new Date(),
  });

  // Start the animation

  var tween = new TWEEN.Tween(shipsMesh.position.clone())
    .to(dest.mesh.position, tt)
    .easing(TWEEN.Easing.Linear.None)
    .interpolation(TWEEN.Interpolation.Bezier) // TODO: What happens without?
    .onUpdate(function (t) {
      shipsMesh.position.copy(spline.getPoint(t));
      shipsMesh.lookAt(spline.getPoint(t+0.001));
    })
    .onComplete(function () {
      this.scene.remove(shipsMesh);
      this.scene.remove(splineMesh);

      this.updateFleets();
      this.updateLabels(dest);
    }.bind(this))
    .start();

  return true;
};

/**
 * Calculates the distance between two planets
 * @param <Object> origin
 * @param <Object> dest
 * @return <Number>
 */
function getDistance(origin, dest){
  return Math.sqrt(  Math.pow(origin.x - dest.x, 2)
                   + Math.pow(origin.y - dest.y, 2));
}
