import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import Car from './models/Car.js';
import Wheel from './models/Wheel.js';
import Tree from './models/Tree.js';
import GLTFLoader from 'three-gltf-loader';
//import Car2 from 'three/examples/js/Car.js';  -->> need to figure out how to define THREE globally? 

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    // Enable antialias for smoother lines
    this.renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true });
    this.scene = new THREE.Scene();
    this.loader = new GLTFLoader();

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
 */

    this.rotZ1 = new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(1));
    this.createCar();
    //this.loadPoopingDog();
    //this.loadDeer(); 
    //this.loadGasCan(); 
    //this.loadDog(); 



    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();
    //var count = 0; //variable for key strokes
    //this.rotateWheels(); //I do not know why rotating and arrow keys do not work at same time
    this.onArrowPressed(); //moved key strokes to its own function for simplicity

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

  loadPoopingDog() {
    this.loader.load(
      'app/js/models/PoopingDog/scene.gltf',
      (gltf) => {
        // called when the resource is loaded
        // must translate the 3d here, when it is loaded (at least that's all I know how to do it)
        //gltf.scene.translateX(5); 
        this.scene.add(gltf.scene);
      },
      (xhr) => {
        // called while loading is progressing
        console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
      },
      (error) => {
        // called when loading has errors
        console.error('An error happened', error);
      },
    );
  }

  loadDeer() {
    this.loader.load(
      'app/js/models/Buck/scene.gltf',
      (gltf) => {
        // called when the resource is loaded
        // must translate the 3d here, when it is loaded (at least that's all I know how to do it)
        //gltf.scene.translateX(5); 
        this.scene.add(gltf.scene);
      },
      (xhr) => {
        // called while loading is progressing
        console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
      },
      (error) => {
        // called when loading has errors
        console.error('An error happened', error);
      },
    );
  }

  loadDog() {
    this.loader.load(
      'app/js/models/Dog/scene.gltf',
      (gltf) => {
        // called when the resource is loaded
        // must translate the 3d here, when it is loaded (at least that's all I know how to do it)
        //gltf.scene.translateX(5); 
        /*gltf.scene.position.y -= 1000; 
        gltf.scene.position.z -= 700; 
        gltf.scene.position.x -= 400; */
        this.scene.add(gltf.scene);
      },
      (xhr) => {
        // called while loading is progressing
        console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
      },
      (error) => {
        // called when loading has errors
        console.error('An error happened', error);
      },
    );
  }

  loadGasCan() {
    this.loader.load(
      'app/js/models/OldJerryCan/scene.gltf',
      (gltf) => {
        // called when the resource is loaded
        // must translate the 3d here, when it is loaded (at least that's all I know how to do it)
        //gltf.scene.translateX(5); 
        this.scene.add(gltf.scene);
      },
      (xhr) => {
        // called while loading is progressing
        console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
      },
      (error) => {
        // called when loading has errors
        console.error('An error happened', error);
      },
    );
  }

  //called when left key is pressed, turns tires left
  leftTurn() {
    this.fltire.rotateY(16);
    this.frtire.rotateY(16);
  }

  //returns front tires to original position when left key is released
  returnFromLeft() {
    this.fltire.rotateY(-16);
    this.frtire.rotateY(-16);
  }

  //called when right key is pressed, turns tires right
  rightTurn() {
    this.fltire.rotateY(-16);
    this.frtire.rotateY(-16);
  }

  //returns front tires to original position when right key is released
  returnFromRight() {
    this.fltire.rotateY(16);
    this.frtire.rotateY(16);
  }

  //rotating car wheels
  rotateWheels() {
    this.brtire.matrixAutoUpdate = false;
    this.bltire.matrixAutoUpdate = false;
    this.frtire.matrixAutoUpdate = false;
    this.fltire.matrixAutoUpdate = false; 

    this.bltire.matrix.multiply(this.rotZ1);
    this.brtire.matrix.multiply(this.rotZ1);
    this.frtire.matrix.multiply(this.rotZ1);
    this.fltire.matrix.multiply(this.rotZ1);
  }

  //handling key strokes, called in render()
  onArrowPressed() {
    var count = 0; 
    //listener to check / execute when buttons are pressed. 
    document.addEventListener('DOMContentLoaded', () => {
      'use strict';

      document.addEventListener('keydown', event => {
        const key = event.keyCode;
        if (key == 37) { //left arrow pressed
          if (count < 1) {
            this.leftTurn();
            count += 1;
          }
        }
        if (key == 39) { //right arrow pressed  
          if (count < 1) {
            this.rightTurn();
            count += 1;
          }
        }
      });
      document.addEventListener('keyup', event => {
        const key = event.keyCode;
        if (key == 37) { //left arrow released
          this.returnFromLeft();
          count = 0;
        }

        if (key == 39) { //right arrow released
          this.returnFromRight();
          count = 0;
        }
      });
    });
  }
}