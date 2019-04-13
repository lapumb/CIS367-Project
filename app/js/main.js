import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import Car from './models/Car.js';
import Wheel from './models/Wheel.js';
//import OBJLoader from 'three-obj-loader';
//OBJLoader(THREE); 
import './loaders/OBJLoader.js'


export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    // Enable antialias for smoother lines
    this.renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true });
    this.scene = new THREE.Scene();

    // Use perspective camera:
    //   Field of view: 75 degrees
    //   Screen aspect ration 4:3
    //   Near plane at z=0.5, far plane at z=500
    this.camera = new THREE.PerspectiveCamera(75, 4 / 3, 0.5, 500);
    // Place the camera at (0,0,100)
    this.camera.position.z = 100;

    this.tracker = new TrackballControls(this.camera);
    this.tracker.rotateSpeed = 2.0;
    // Allow zoom and pan
    this.tracker.noZoom = false;
    this.tracker.noPan = false;

    const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    const fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    this.scene.add(keyLight);
    this.scene.add(fillLight);
    this.scene.add(backLight);

    //adding light so I can see what I am doing
    /*const lightOne = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    lightOne.position.set(10, 40, 100);
    this.scene.add(lightOne);

    const lightTwo = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    lightTwo.position.set(-10, -40, -100);
    this.scene.add(lightTwo);

    //loading in the deer, possibly
    // instantiate a loader
    /*var loader = new THREE.OBJLoader();

    // load a resource
    loader.load(
      // resource URL
      'models/Deer.obj',
      // called when resource is loaded
      function (object) {

        scene.add(object);

      },
      // called when loading is in progresses
      function (xhr) {

        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      // called when loading has errors
      function (error) {

        console.log('An error happened');

      }
    ); */
    
    this.loader = new OBJLoader(); 
    this.loader.setPath('/app/js/models/');
    this.loader.load('Deer.obj', function(object){
        object.position.y -= 60; 
        this.scene.add(object); 
    }); 

    //this.createCar();

    this.rotZ1 = new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(1));

    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    document.onkeydown = function(event) {
      switch (event.keyCode) {
         case 37:
              alert('Left key pressed');
            break;
         case 38:
              alert('Up key pressed');
            break;
         case 39:
              alert('Right key pressed');
              //this.fltire.translateX(20); 
            break;
         case 40:
              alert('Down key pressed');
            break;
         default:
            break; 
      }
    };

    //making tires spin
    /*
    this.bltire.matrix.multiply (this.rotZ1);
    this.brtire.matrix.multiply (this.rotZ1);
    this.frtire.matrix.multiply (this.rotZ1);
    this.fltire.matrix.multiply (this.rotZ1); */

    requestAnimationFrame(() => this.render());
  }

  resizeHandler() {
    const canvas = document.getElementById("mycanvas");
    let w = window.innerWidth - 16;
    let h = 0.75 * w;  /* maintain 4:3 ratio */
    if (canvas.offsetTop + h > window.innerHeight) {
      h = window.innerHeight - canvas.offsetTop - 16;
      w = 4 / 3 * h;
    }
    canvas.width = w;
    canvas.height = h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.tracker.handleResize();
  }

  createCar() {
    //adding body
    this.myCar = new Car();
    this.scene.add(this.myCar);
    this.myCar.matrixAutoUpdate = false;

    //front right tire
    this.frtire = new Wheel(8);
    this.frtire.translateX(8);
    this.frtire.translateY(-5);
    this.frtire.translateZ(4);
    this.scene.add(this.frtire);
    //this.frtire.matrixAutoUpdate = false;

    //front left tire
    this.fltire = new Wheel(8);
    this.fltire.translateX(8);
    this.fltire.translateY(-5);
    this.fltire.translateZ(-4);
    this.scene.add(this.fltire);
    //this.fltire.matrixAutoUpdate = false;

    //back right tire
    this.brtire = new Wheel(8);
    this.brtire.translateX(-3);
    this.brtire.translateY(-5);
    this.brtire.translateZ(-4);
    this.scene.add(this.brtire);
    //this.brtire.matrixAutoUpdate = false;

    //back right tire
    this.bltire = new Wheel(8);
    this.bltire.translateX(-3);
    this.bltire.translateY(-5);
    this.bltire.translateZ(4);
    this.scene.add(this.bltire);
    //this.bltire.matrixAutoUpdate = false;
  }
}