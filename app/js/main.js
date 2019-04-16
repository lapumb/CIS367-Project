import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import Car from './models/Car.js';
import Wheel from './models/Wheel.js';
import Tree from './models/Tree.js';
import GLTFLoader from 'three-gltf-loader';
//import Car2 from 'three/examples/js/Car.js';  -->> need to figure out how to define THREE globally?
var time = 0;
var speedMult = 1; //multiplier for gas tank, change to .5 so everything slows down

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
    this.loader = new GLTFLoader();
    this.rotZ1 = new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(-10)); //user ties
    this.rotZ2 = new THREE.Matrix4().makeRotationZ(THREE.Math.degToRad(-5)); //opposing car tires


    // Use perspective camera:
    //   Field of view: 75 degrees
    //   Screen aspect ration 4:3
    //   Near plane at z=0.5, far plane at z=500
    this.camera = new THREE.PerspectiveCamera(75, 4 / 3, 0.5, 500);
    // Place the camera at (0,0,100)
    this.camera.position.z = 210;

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
    const lightOne = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    lightOne.position.set(10, 40, 100);
    this.scene.add(lightOne);
/*
    const lightTwo = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    lightTwo.position.set(-10, -40, -100);
    this.scene.add(lightTwo);*/

    this.createUserCar();
    this.createRoad();
    this.createGrass();
    //this.createRandomCar();
    //this.loadDeerLeft();
    //this.loadDeerRight();
    //this.loadPoopingDog();
    //this.placeTreeLeft(); 
    //this.placeTreeRight(); 

    //this.axesHelper = new THREE.AxesHelper(100);
    //this.scene.add(this.axesHelper);

    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
    //requestAnimationFrame(() => this.appearRandomObject());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();
    this.rotateUserWheels(); //I do not know why rotating and arrow keys do not work at same time
    this.onArrowPressed(); //moved key strokes to its own function for simplicity

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

  //creates car
  createUserCar() {
    //adding body
    this.myCar = new Car();
    //this.scene.add(this.myCar);
    // changed this to true, it would'nt let me move or
    // rotate the car when it was false
    this.myCar.matrixAutoUpdate = true;

    //front right tire
    this.frtire = new Wheel(8);
    this.frtire.translateX(8);
    this.frtire.translateY(-5);
    this.frtire.translateZ(4);
    //this.scene.add(this.frtire);
    //this.frtire.matrixAutoUpdate = false;

    //front left tire
    this.fltire = new Wheel(8);
    this.fltire.translateX(8);
    this.fltire.translateY(-5);
    this.fltire.translateZ(-4);
    //this.scene.add(this.fltire);
    //this.fltire.matrixAutoUpdate = false;

    //back right tire
    this.brtire = new Wheel(8);
    this.brtire.translateX(-3);
    this.brtire.translateY(-5);
    this.brtire.translateZ(-4);
    //this.scene.add(this.brtire);
    //this.brtire.matrixAutoUpdate = false;

    //back right tire
    this.bltire = new Wheel(8);
    this.bltire.translateX(-3);
    this.bltire.translateY(-5);
    this.bltire.translateZ(4);
    //this.scene.add(this.bltire);
    //this.bltire.matrixAutoUpdate = false;

    //added all car elements to a group so we can
    //move them all together with ease
    this.carGroup = new THREE.Group();
    this.carGroup.add(this.myCar);
    this.carGroup.add(this.fltire);
    this.carGroup.add(this.frtire);
    this.carGroup.add(this.bltire);
    this.carGroup.add(this.brtire);

    this.carGroup.translateZ(170);
    this.carGroup.translateY(-12);
    this.rotateObject(this.carGroup, 0, 90, 0);

    this.scene.add(this.carGroup);
  }

  //rotating car wheels
  rotateUserWheels() {
    this.brtire.matrixAutoUpdate = false;
    this.bltire.matrixAutoUpdate = false;
    this.frtire.matrixAutoUpdate = false;
    this.fltire.matrixAutoUpdate = false;

    this.bltire.matrix.multiply(this.rotZ1);
    this.brtire.matrix.multiply(this.rotZ1);
    this.frtire.matrix.multiply(this.rotZ1);
    this.fltire.matrix.multiply(this.rotZ1);
  }


  createRandomCar() {
    var randomColor = Math.floor(Math.random() * 0xFFFFFF);
    this.ranCar = new Car(randomColor);
    this.ranCar.matrixAutoUpdate = true;

    //front right tire
    this.ranfrtire = new Wheel(8);
    this.ranfrtire.translateX(8);
    this.ranfrtire.translateY(-5);
    this.ranfrtire.translateZ(4);
    //this.scene.add(this.frtire);
    //this.frtire.matrixAutoUpdate = false;

    //front left tire
    this.ranfltire = new Wheel(8);
    this.ranfltire.translateX(8);
    this.ranfltire.translateY(-5);
    this.ranfltire.translateZ(-4);

    //back right tire
    this.ranbrtire = new Wheel(8);
    this.ranbrtire.translateX(-3);
    this.ranbrtire.translateY(-5);
    this.ranbrtire.translateZ(-4);

    //back right tire
    this.ranbltire = new Wheel(8);
    this.ranbltire.translateX(-3);
    this.ranbltire.translateY(-5);
    this.ranbltire.translateZ(4);

    this.rancarGroup = new THREE.Group();
    this.rancarGroup.add(this.ranCar);
    this.rancarGroup.add(this.ranfltire);
    this.rancarGroup.add(this.ranfrtire);
    this.rancarGroup.add(this.ranbltire);
    this.rancarGroup.add(this.ranbrtire);

    this.rancarGroup.translateZ(-300);
    this.rancarGroup.translateY(18);

    //randomly place in a lane
    var lane = Math.floor(Math.random() * 3); //0-2
    switch (lane) {
      case 0:
        this.rancarGroup.translateX(21);
        break;
      case 1:
        this.rancarGroup.translateX(-21);
        break;
      default:
        break;
    }

    this.rotateObject(this.rancarGroup, 0, 90, 0);
    this.scene.add(this.rancarGroup);

    requestAnimationFrame(() => this.randomCarRender());
  }

  //rotating car wheels
  rotateRandomCarWheels() {
    this.ranbrtire.matrixAutoUpdate = false;
    this.ranbltire.matrixAutoUpdate = false;
    this.ranfrtire.matrixAutoUpdate = false;
    this.ranfltire.matrixAutoUpdate = false;

    this.ranbltire.matrix.multiply(this.rotZ2);
    this.ranbrtire.matrix.multiply(this.rotZ2);
    this.ranfrtire.matrix.multiply(this.rotZ2);
    this.ranfltire.matrix.multiply(this.rotZ2);
  }

  //this.rotateRandomCarWheels();
  randomCarRender() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();
    this.rotateRandomCarWheels(); //I do not know why rotating and arrow keys do not work at same time
/*
    if (time === 600) { //makes deer less laggy
      var random = Math.floor(Math.random() * 3); //0-2
      if (random === 1) { cancelAnimationFrame(() => this.moveDeerLeft()); this.loadDeerLeft(); }
      else { cancelAnimationFrame(() => this.moveDeerRight()); this.loadDeerRight(); }
      time = 0;
    }
    else {
      time += 1;
    } 
*/

    if (this.rancarGroup.position.z < 300) {
      this.rancarGroup.translateX(-1);
      this.rancarGroup.translateY(-0.066);
    }
    else {
      this.scene.remove(this.rancarGroup);
      this.createRandomCar();
    }

    requestAnimationFrame(() => this.randomCarRender());
  }

  //loads in the pooping dog (lmao)
  loadPoopingDog() {
    this.loader.load(
      'app/js/models/PoopingDog/scene.gltf',
      (gltf) => {
        // called when the resource is loaded
        gltf.scene.scale.set(8, 8, 8);
        this.dog = gltf.scene;
        this.dog.translateZ(-300); 
        this.dog.translateY(10); 

        //randomly place in a lane
        var lane = Math.floor(Math.random() * 3); //0-2
        switch (lane) {
          case 0:
            this.dog.translateX(21);
            break;
          case 1:
            this.dog.translateX(-21);
            break;
          default:
            break;
        }
        this.scene.add(this.dog);


        requestAnimationFrame(() => this.poopingDogTranslation());
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

  poopingDogTranslation() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    if (this.dog.position.z < 300) {
      this.dog.translateZ(2);
      this.dog.translateY(-0.09);
    }
    else {
      this.scene.remove(this.dog);
      cancelAnimationFrame(() => this.poopingDogTranslation());
    }


    requestAnimationFrame(() => this.poopingDogTranslation());
  }

  //loads the whitetail buck
  loadDeerRight() {
    this.loader.load(
      'app/js/models/Buck/scene.gltf',
      (gltf) => {
        // called when the resource is loaded
        // must translate the 3d here, when it is loaded (at least that's all I know how to do it)
        //gltf.scene.translateX(5);
        //gltf.scene.scale.set(2, 2, 2); //this is how you scale
        gltf.scene.scale.set(.3, .3, .3);
        this.deerR = gltf.scene;
        this.deerR.translateX(40);
        this.deerR.translateZ(150);
        this.deerR.translateY(-3);
        this.scene.add(this.deerR);

        requestAnimationFrame(() => this.moveDeerRight());
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

  //render function to make deer move across road
  moveDeerRight() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    if (this.deerR.position.z < 230) {
      this.deerR.translateX(-0.6);
      this.deerR.translateZ(.7);
      this.deerR.translateY(-0.01);
    }
    else {
      cancelAnimationFrame(() => this.moveDeerRight());
      this.scene.remove(this.deerR);
    }

    requestAnimationFrame(() => this.moveDeerRight());
  }

  //loads the whitetail buck
  loadDeerLeft() {
    this.loader.load(
      'app/js/models/Buck/scene.gltf',
      (gltf) => {
        // called when the resource is loaded
        gltf.scene.scale.set(.3, .3, .3);
        this.deerL = gltf.scene;
        this.deerL.translateX(-40);
        this.deerL.translateZ(150);
        this.deerL.translateY(-3);
        this.deerL.rotateY(8);
        this.scene.add(this.deerL);

        requestAnimationFrame(() => this.moveDeerLeft());
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

  //render function to make deer move across road
  moveDeerLeft() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    if (this.deerL.position.z < 230) {
      this.deerL.translateX(-0.6);
      this.deerL.translateZ(.35);
      this.deerL.translateY(-0.01);
    }
    else {
      cancelAnimationFrame(() => this.moveDeerLeft());
      this.scene.remove(this.deerL);
    }

    requestAnimationFrame(() => this.moveDeerLeft());
  }

  //loads gas can (boost?)
  loadGasCan() {
    this.loader.load(
      'app/js/models/OldJerryCan/scene.gltf',
      (gltf) => {
        // called when the resource is loaded
        // must translate the 3d here, when it is loaded (at least that's all I know how to do it)
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

  //moves the car to the left
  moveToLeft() {
    if (this.carGroup.position.x < -41) {
      return;
    } else {
      this.carGroup.translateZ(-21);
      console.log(this.carGroup.position);
    }
  }

  // moves the car to the right
  moveToRight() {
    if (this.carGroup.position.x > 41) {
      return;
    } else {
      this.carGroup.translateZ(21);
      console.log(this.carGroup.position);
    }
  }

  //handling key strokes (left and right arrows, respectively), called in render()
  onArrowPressed() {
    var count = 0;
    //listener to check / execute when buttons are pressed.
    document.addEventListener('DOMContentLoaded', () => {
      'use strict';

      document.addEventListener('keydown', event => {
        const key = event.keyCode;
        if (key === 37) { //left arrow pressed
          if (count < 1) {
            this.moveToLeft();
            this.leftTurn();
            count += 1;
          }
        }
        if (key === 39) { //right arrow pressed
          if (count < 1) {
            this.moveToRight();
            this.rightTurn();
            count += 1;
          }
        }
      });
      document.addEventListener('keyup', event => {
        const key = event.keyCode;
        if (key == 37) { //left arrow released
          //this.moveToRight();
          this.returnFromLeft();
          count = 0;
        }

        if (key == 39) { //right arrow released
          //this.moveToLeft();
          this.returnFromRight();
          count = 0;
        }
      });
    });
  }

  //creating the road
  createRoad() {
    /* ROAD */
    var planeGeometry = {},
      planeMaterial = {};

    const PLANE_WIDTH = 70,
      PLANE_LENGTH = 500,
      PADDING = PLANE_WIDTH / 5 * 2;

    planeGeometry = new THREE.BoxGeometry(PLANE_WIDTH, PLANE_LENGTH + PLANE_LENGTH / 10, 1);

    planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x2C2D2D //some random color for now
    });

    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //rotate the plane so it looks like a straight, long road
    this.plane.rotation.x = 1.65;
    this.plane.receiveShadow = true;
    this.plane.translateZ(10);
    this.scene.add(this.plane);
  }

  //placing tree on the right side of the road
  placeTreeRight() {
    this.myTreeR = new Tree();
    this.myTreeR.translateZ(-300);
    this.myTreeR.translateX(70);
    this.myTreeR.translateY(20);
    this.scene.add(this.myTreeR);

    requestAnimationFrame(() => this.handleTreeMovementRight());
  }

  placeTreeLeft() {
    this.myTreeL = new Tree();
    this.myTreeL.translateZ(-300);
    this.myTreeL.translateX(-70);
    this.myTreeL.translateY(20);
    this.scene.add(this.myTreeL);

    requestAnimationFrame(() => this.handleTreeMovementLeft());
  }

  //handling tree movement
  handleTreeMovementLeft() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    if(this.myTreeL.position.z === 200) {
      this.placeTreeLeft(); 
    }

    if (this.myTreeL.position.z < 300) { //when tree is on right side
      this.myTreeL.translateZ(1);
      this.myTreeL.translateY(-0.075);
      this.myTreeL.translateX(0.062);
      //this.placeTreeLeft(); 
    }
    else{
      cancelAnimationFrame(() => this.handleTreeMovementLeft());
      this.scene.remove(this.myTreeL);
    }

    requestAnimationFrame(() => this.handleTreeMovementLeft());
  }

  handleTreeMovementRight() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    if(this.myTreeR.position.z === 200) {
      this.placeTreeRight(); 
    }

    if (this.myTreeR.position.z < 300) { //when tree is on right side
      this.myTreeR.translateZ(1);
      this.myTreeR.translateY(-0.075);
      this.myTreeR.translateX(-0.062);
    }
    
    else{
      cancelAnimationFrame(() => this.handleTreeMovementRight());
      this.scene.remove(this.myTreeR);
    }

    requestAnimationFrame(() => this.handleTreeMovementRight());
  }

  createGrass() {
    var leftSideGeometry = {},
      leftSideMaterial = {};

    const PLANE_WIDTH = 400,
      PLANE_LENGTH = 500,
      PADDING = PLANE_WIDTH / 5 * 2;

    leftSideGeometry = new THREE.BoxGeometry(PLANE_WIDTH, PLANE_LENGTH + PLANE_LENGTH / 10, 1);

    leftSideMaterial = new THREE.MeshBasicMaterial({
      color: 0x488214
    });

    this.leftSide = new THREE.Mesh(leftSideGeometry, leftSideMaterial);
    this.leftSide.rotation.x = 1.65;
    this.leftSide.receiveShadow = true;
    this.leftSide.position.x = -235;
    this.leftSide.position.y = 1;
    this.leftSide.translateZ(10);

    this.rightSide = this.leftSide.clone();
    this.rightSide.position.x = 235;

    this.scene.add(this.leftSide, this.rightSide);
  }

  //rotate an object
  rotateObject(object, degreeX = 0, degreeY = 0, degreeZ = 0) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
  }

  //appear objects at random. 
  appearRandomObject() {
    var random = Math.floor(Math.random() * 11); //0-10

    switch (random) {
      case 0: //deer
        this.placeTreeLeft();
        this.handleTreeMovementLeft();
        break;
      case 1: //tree

        break;
      case 2: //car

        break;
      case 3: //pooping dog

        break;
      case 4: //deer

        break;
      case 5: //tree

        break;
      case 6: //pooping dog

        break;
      case 7: //car

        break;
      case 8: //tree

        break;
      case 9: //pooping dog
        break;
      case 10: //gas can
        break;
      default:
        break;
    }

    requestAnimationFrame(() => this.appearRandomObject());
  }

  // Collision Detection
  // we would use this.carGroup instead of hero

  detectCollisions(objects) {
    var origin = this.carGroup.position.clone();

    for (var v = 0, vMax = this.carGroup.geometry.vertices.length; v < vMax; v += 1) {
      var localVertex = this.carGroup.geometry.vertices[v].clone();
      var globalVertex = localVertex.applyMatrix4(this.carGroup.matrix);
      var directionVector = globalVertex.sub(this.carGroup.position);

      var ray = new THREE.Raycaster(origin, directionVector.clone().normalize());
      var intersections = ray.intersectObjects(objects);
      if (intersections.length > 0 &&
        intersections[0].distance < directionVector.length()) {
        return true;
      }
    }
    return false;
  }
}