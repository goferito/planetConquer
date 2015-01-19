var planetShininess = 40;

module.exports = [
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/earthmap1k.jpg'),
    bumpMap: new THREE.ImageUtils.loadTexture('assets/planets/earthbump1k.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/jupitermap.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/mars_1k_color.jpg'),
    bumpMap: new THREE.ImageUtils.loadTexture('assets/planets/marsbump1k.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/mercurymap.jpg'),
    bumpMap: new THREE.ImageUtils.loadTexture('assets/planets/mercurybump.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/neptunemap.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/plutomap1k.jpg'),
    bumpMap: new THREE.ImageUtils.loadTexture('assets/planets/plutobump1k.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/saturnmap.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/venusmap.jpg'),
    bumpMap: new THREE.ImageUtils.loadTexture('assets/planets/venusbump.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/planet_1_d.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/planet_3_d.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/planet_5_d.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/Planet_Avalon_1600.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/planet_Dagobah1200.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/planet_Dam-Ba-Da1200.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/planet_Jinx1200.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/planet_Klendathu1200.jpg'),
    shininess: planetShininess,
  }),
  new THREE.MeshPhongMaterial({
    map: new THREE.ImageUtils.loadTexture('assets/planets/planet_Terminus1200.jpg'),
    shininess: planetShininess,
  }),
];
