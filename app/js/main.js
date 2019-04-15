import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import Car from './models/Car.js';
import Wheel from './models/Wheel.js';

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    // Enable antialias for smoother lines
    this.renderer = new THREE.WebGLRenderer({
      canvas: c,
      antialias: true
    });
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x23a3a1);
    // Use perspective camera:
    //   Field of view: 75 degrees
    //   Screen aspect ration 4:3
    //   Near plane at z=0.5, far plane at z=500
    this.camera = new THREE.PerspectiveCamera(75, 4 / 3, 0.5, 500);
    // Place the camera at (0,0,100)
    this.camera.position.z = 200;

    this.tracker = new TrackballControls(this.camera);
    this.tracker.rotateSpeed = 2.0;
    // Allow zoom and pan
    this.tracker.noZoom = false;
    this.tracker.noPan = false;

    //adding light so I can see what I am doing
    const lightOne = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    lightOne.position.set(10, 40, 100);
    this.scene.add(lightOne);

    const lightTwo = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    lightTwo.position.set(-10, -40, -100);
    this.scene.add(lightTwo);

    this.axesHelper = new THREE.AxesHelper(100);
    this.scene.add(this.axesHelper);

    this.createCar();

    this.createRoad();

    this.myCar.translateZ(160);
    this.myCar.translateY(-15);
    this.rotateObject(this.myCar, 0, 90, 0);


    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    requestAnimationFrame(() => this.render());
  }

  resizeHandler() {
    const canvas = document.getElementById("mycanvas");
    let w = window.innerWidth - 16;
    let h = 0.75 * w; /* maintain 4:3 ratio */
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

  createRoad() {
    /* ROAD */
    var planeGeometry = {},
      planeMaterial = {};

    const PLANE_WIDTH = 70,
      PLANE_LENGTH = 500,
      PADDING = PLANE_WIDTH / 5 * 2;

    planeGeometry = new THREE.BoxGeometry(PLANE_WIDTH, PLANE_LENGTH + PLANE_LENGTH / 10, 1);

    planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x696969 //some random color for now
    });

    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //rotate the plane so it looks like a straight, long road
    this.plane.rotation.x = 1.65;
    this.plane.receiveShadow = true;
    this.plane.translateZ(10);
    this.scene.add(this.plane);

  }

  createCar() {
    //adding body
    this.myCar = new Car();
    this.scene.add(this.myCar);

    // changed this to true, it would'nt let me move or 
    // rotate the car when it was false
    this.myCar.matrixAutoUpdate = true;

    //front right tire
    this.frtire = new Wheel(8);
    this.frtire.translateX(8);
    this.frtire.translateY(-5);
    this.frtire.translateZ(4);
    this.scene.add(this.frtire);

    //front left tire
    this.fltire = new Wheel(8);
    this.fltire.translateX(8);
    this.fltire.translateY(-5);
    this.fltire.translateZ(-4);
    this.scene.add(this.fltire);

    //back right tire
    this.brtire = new Wheel(8);
    this.brtire.translateX(-3);
    this.brtire.translateY(-5);
    this.brtire.translateZ(-4);
    this.scene.add(this.brtire);

    //back right tire
    this.bltire = new Wheel(8);
    this.bltire.translateX(-3);
    this.bltire.translateY(-5);
    this.bltire.translateZ(4);
    this.scene.add(this.bltire);
  }

  //rotates an object by the specified angle
  rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
  }
}