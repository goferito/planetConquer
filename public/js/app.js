
function init(){

  var canvas = document.getElementById('battlefield');
  var context = canvas.getContext('2d');

  var myScene = new Scene([], [], context);


  //Setup connection to get the updates from the server
  var socket = io.connect(location.origin);

  socket.on('connect', function(){
    console.log('socket connected!');

    myScene.startDrawing();

  });

  socket.on('error', function(err){
    console.error('ERROR. Unable to connect.', err);
  });

  socket.on('update_scene', function(data){
    myScene._planets = data._planets;
    myScene._fleets = data._fleets;
    myScene._conquerors = data._conquerors;
  });

}

window.onload = init;

