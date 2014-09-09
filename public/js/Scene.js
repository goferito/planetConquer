
var Scene = function(conquerors,
                     initialShips,
                     context, container){

  this._numConquerors = conquerors.length;
  this._conquerors = conquerors.reduce(function(conqs, c){
    conqs[c.name] = c;
    return conqs;
  }, {});
  this._initialShips = initialShips;
  this._initialPlanetRatio = 5;
  this._context = context;
  this._planets = this.generatePlanets(conquerors,
                                       this._initialPlanetRatio,
                                       this._initialShips);
  this._fleets = [];
  this._speed = 0.05;
  this._drawingInterval = 100;

  // 3d 

  this.container = container;
  this.scene = new THREE.Scene();
  this.sceneCube = new THREE.Scene();
  this.clock = new THREE.Clock();

  this.camera = new THREE.PerspectiveCamera(
        45, 
        window.innerWidth / window.innerHeight, 
        1, 
        5000
  );

  this.camera.position.z = 500;
  this.camera.updateMatrixWorld();
  this.cameraCube = this.camera.clone();

  var light01 = new THREE.DirectionalLight(0xffffff, 1.0);
  light01.position.set(1, 1, 1);
  this.scene.add(light01);

  var light02 = new THREE.DirectionalLight(0xffffff, 0.9);
  light02.position.set(-1, -1, 1);
  // this.scene.add(light02);

  this.scene.add(new THREE.AmbientLight(0x555555));
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

  var skyBox = new THREE.Mesh(new THREE.BoxGeometry(1200, 1200, 1200), material);
  this.sceneCube.add(skyBox);

  this.planetMaterials = [
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/earthmap1k.jpg'),
      bump: new THREE.ImageUtils.loadTexture('assets/earthbump1k.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/jupitermap.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/mars_1k_color.jpg'),
      bump: new THREE.ImageUtils.loadTexture('assets/marsbump1k.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/mercurymap.jpg'),
      bump: new THREE.ImageUtils.loadTexture('assets/mercurybump.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/neptunemap.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/plutomap1k.jpg'),
      bump: new THREE.ImageUtils.loadTexture('assets/plutobump1k.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/saturnmap.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/venusmap.jpg'),
      bump: new THREE.ImageUtils.loadTexture('assets/venusbump.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_1_d.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_2_d.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_3_d.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_4_d.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_5_d.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_7_d.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/Planet_Avalon_1600.jpg'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Dagobah1200.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Dam-Ba-Da1200.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Dank1200.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Jinx1200.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Klendathu1200.png'),
      shininess: 50,
    }),
    new THREE.MeshPhongMaterial({
      map: new THREE.ImageUtils.loadTexture('assets/planet_Terminus1200.png'),
      shininess: 50,
    }),
  ];

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });

  this._planets.forEach(function (planet) {
    planet.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(16, 32, 32), 
      this.planetMaterials[
        Math.floor((Math.random() * this.planetMaterials.length))
      ]
    );

    planet.mesh.position.x = planet.x;
    planet.mesh.position.y = planet.y;

    this.scene.add(planet.mesh);

    var pos2d = this.toXYCoords(planet.mesh.position);

    var text = document.createElement('div');
    text.className = 'planetLabel';
    text.innerHTML = planet.ships;
    text.style.top = parseInt(pos2d.y - 10) + 'px';
    text.style.left = parseInt(pos2d.x - 25) + 'px';
    document.body.appendChild(text);

    planet.text = text;
  }.bind(this));

  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setClearColor(0x000000);
  this.animate();
  
  document.body.appendChild(this.renderer.domElement);
};

Scene.prototype.toXYCoords = function (pos) {
  var vector = this.projector.projectVector(pos.clone(), this.camera);
  vector.x = (vector.x + 1)/2 * window.innerWidth;
  vector.y = -(vector.y - 1)/2 * window.innerHeight;
  return vector;
};

Scene.prototype.generatePlanets = function(conquerors,
                                           conquerorsRatio,
                                           conquerorsShips){
  //TODO create more maps
  var maps =  [
    [
      { x: -10, y: -10, ratio: 5, ships: 3 },
      { x: -80, y: 15, ratio: 5, ships: 25 },
      { x: -120, y: -60, ratio: 5, ships: 45 },
      { x: 10,  y: 120, ratio: 1, ships: 1 },
      { x: 100, y: 80, ratio: 2, ships: 10 },
      { x: 180, y: -110, ratio: 3, ships: 200 },
      { x: -200, y: -150, ratio: 4, ships: 1 },
      { x: -200, y: 100, ratio: 5, ships: 3 },
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


Scene.prototype.growRatios = function(){
  for(var i in this._planets){
    var p = this._planets[i];
    p.ships += p.ratio;
    p.text.innerHTML = p.ships;
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
 * Draws the scene into a canvas context
 * @param <context> ctx - The canvas context
 * @returns <Scene> 
 */
Scene.prototype.drawScene = function(ctx){

  var _this = this;

  this._planets.forEach(function(planet){

    // Draw coloured circle
    ctx.globalAlpha = 1;
    ctx.shadowColor = '#999';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.beginPath();
    ctx.arc(planet.x,
            planet.y,
            planet.ratio * 5 + 10,
            0,
            2 * Math.PI,
            false);
    ctx.fillStyle = _this.getConquerorColor(planet.owner);
    ctx.fill();

    // Draw number of contained ships
    ctx.fillStyle = 'white'
    ctx.fillText(planet.ships,
                 planet.x - 6,
                 planet.y + 4);

  });

  // Current time, to check how far the fleets have already gone
  var t = new Date();

  // Draw travelling fleets
  this._fleets.forEach(function(fleet, i){
    
    // Calculate fleet position
    var dist = getDistance(fleet.origin, fleet.dest)

      // Trip time
      , tt = dist / _this._speed

      // Elapsed time
      , elapsed = t - fleet.start

      // Percent travelled
      , pTravelled = elapsed / tt

      // X trip distance
      , dx = fleet.dest.x - fleet.origin.x

      // Current X
      , cx = fleet.origin.x + dx * pTravelled

      // Y trip distance
      , dy = fleet.dest.y - fleet.origin.y

      // Current X
      , cy = fleet.origin.y + dy * pTravelled


    // If already there, don't draw
    if(pTravelled >= 1) return;

    // Draw coloured circle
    ctx.globalAlpha = 0.5;
    ctx.shadowColor = '#999';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.arc(cx,
            cy,
            3 + fleet.ships, // radio
            0,
            2 * Math.PI,
            false);
    ctx.fillStyle = _this.getConquerorColor(fleet.owner);
    ctx.fill();

    // Draw fleet route
    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.moveTo(fleet.origin.x, fleet.origin.y);
    ctx.lineTo(fleet.dest.x, fleet.dest.y);
    ctx.stroke();
    
    // Draw number of contained ships
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'white'
    ctx.fillText(fleet.ships, cx - 2, cy + 3);

  });
}

Scene.prototype.startDrawing = function(){
  var _this = this;
  setInterval(function(){
    _this._context.clearRect(0,
                            0,
                            _this._context.canvas.offsetWidth,
                            _this._context.canvas.offsetHeight);
    _this.updateFleets();
    _this.drawScene(_this._context);
  }, this._drawingInterval);
};

Scene.prototype.render = function (dt) {
  this._planets.forEach(function (p) {
    p.mesh.rotation.y += 0.2 * dt;
  });


  this.cameraCube.rotation.copy(this.camera.rotation);
  this.cameraCube.position.copy(this.camera.position);

  this.renderer.autoClear = false;
  this.renderer.clear();

  this.renderer.render(this.sceneCube, this.cameraCube);
  this.renderer.render(this.scene, this.camera);
};

Scene.prototype.animate = function () {
  requestAnimationFrame(this.animate.bind(this));
  this.render(this.clock.getDelta());
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


Scene.prototype.sendFleet = function (origin, dest, ships){

  // Check it's not trying to send more ships than the available
  if(origin.ships < ships) return false;

  // Substract the ships to be sent
  origin.ships -= ships;

  // Add the fleet to the fleets array
  this._fleets.push({
    origin: origin,
    dest: dest,
    owner: origin.owner,
    ships: ships,
    start: new Date()
  });

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


