/*
  ///////// Example of positional audio in Three.js///////// 
  Remember to put your audio files inside the public folder and state the source inside index.html

  Author Credit: Wing Hei Cheryl Hui

  To get started:
  - only the first time on the command line run:
      npm install 
  - Every time you develop / test (look at package.json to change port for static server):
      npm run dev
  - To build your static site:
      npm run build
  - To preview a static site / build, after you have run the above command:
      npm run preview
*/


//import three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';//camera controls
import Stats from 'three/examples/jsm/libs/stats.module';//frame rate and other stats

let scene, camera, renderer, controls;//we can declare variables on one line like this
let light, dirLight;
let material1, material2, material3; //set up the materials for the spheres
let mesh1, mesh2, mesh3;

//helpers
let stats, gridHelper;


//We need the start button to play the sound file
const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', userStart);

//Instead of this pattern you could also load the scene as usual
//and then on click above call another function to add in the sound
function userStart(){
  init();
  animate();
}


function init() {
  scene = new THREE.Scene();
  // Overlay (in order to start playing the audio file)
  const overlay = document.getElementById( 'overlay' );
  overlay.remove();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.set(10,5,0);

  //=========Audio Source part=============//
  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add( listener );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // camera user interaction controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  //set up our scene
  // ambient light (from all around)
  light = new THREE.AmbientLight( 0xfffafe ); // soft white light
  scene.add( light );

  //directional light
  dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
  dirLight.position.set( - 1, 1.75, 1 );//angle the light
  dirLight.position.multiplyScalar( 20 );// move it back... or do it in one line
  scene.add( dirLight );
  //see where your directional light is
  // const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
  // scene.add( dirLightHelper );


  //Put your fix files (all static assets) in the public folder
 
  gridHelper = new THREE.GridHelper( 80, 80 );
  scene.add( gridHelper );

  //For frame rate etc 
   stats = Stats();
  //stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  //document.body.appendChild(stats.dom)

  const sphere = new THREE.SphereGeometry(5,5,5);
  material1 = new THREE.MeshPhongMaterial( { color: 0xffaa00, flatShading: true, shininess: 0 } );
  material2 = new THREE.MeshPhongMaterial( { color: 0xff2200, flatShading: true, shininess: 0 } );
  material3 = new THREE.MeshPhongMaterial( { color: 0x6622aa, flatShading: true, shininess: 0 } );
  
  // sound spheres
  //Sphere 1(1st audio source - Drum)
  mesh1 = new THREE.Mesh( sphere, material1 ); 
  mesh1.position.set( 70,0,0 ); //set the position of the sphere
  scene.add( mesh1 ); //Add the sphere to the scene

  //Sphere 2 (2nd audio source - Synth)
  mesh2 = new THREE.Mesh( sphere, material2 );
  mesh2.position.set( -70, 0, 0 );
  scene.add( mesh2 );

  //Sphere 3 (3rd audio source - Bass)   
  mesh3 = new THREE.Mesh( sphere, material3 );
  mesh3.position.set( 0, 0, 70 );
  scene.add( mesh3 );

  //Add sounds
  //If you wanted to load the visuals and then do the sound only on user click
  ////////////move this into another function that gets called on play
  const sound1 = new THREE.PositionalAudio( listener ); 
  const songElement = document.getElementById( 'Drum' ); //The Id is set inside index.html
  sound1.setMediaElementSource( songElement ); 
  sound1.setRefDistance( 20 );
  songElement.play(); // Play the audio file
  mesh1.add( sound1 ); // Add the audio to the sphere

  const sound2 = new THREE.PositionalAudio( listener );
  const songElement2 = document.getElementById( 'Synth' );
  sound2.setMediaElementSource( songElement2 );
  sound2.setRefDistance( 20 );
  songElement2.play();
  mesh2.add( sound2 );

  const sound3 = new THREE.PositionalAudio( listener );
  const songElement3 = document.getElementById( 'Bass' );
  sound3.setMediaElementSource( songElement3 );
  sound3.setRefDistance( 20 );
  songElement3.play();
  mesh3.add( sound3 );
  ////////// end of adding sound


  //add event listener, when window is resized call onWindowResize callback
  window.addEventListener('resize', onWindowResize );

}

function animate() {
	requestAnimationFrame( animate );//manually call request next animation frame

  //render the scene
	renderer.render( scene, camera );

  //update stats
  stats.update();
}

function onWindowResize() {
  //resize everything on Window Resize
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}

