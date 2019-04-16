import {
  MeshPhongMaterial,
  Mesh,
  Group,
  CylinderGeometry
} from 'three';

export default class Car extends Group {
  constructor(color = 0xB52A2A) { // number of spokes on the wheel
    super(); // invoke the super class constructor

    //body of car
    const CAR_WIDTH = 12; //x
    const CAR_HEIGHT = 8; //y
    const CAR_DEBTH = 10; //z
    //const carGeo = new BoxGeometry(CAR_WIDTH, CAR_HEIGHT, CAR_DEBTH, 4, 4);
    const carGeo = new CylinderGeometry(8, 8, 8, 4);
    const carMat = new MeshPhongMaterial({
      color: color
    });
    const carBody = new Mesh(carGeo, carMat);
    carBody.rotation.y = Math.PI / 4;
    this.add(carBody);

    //hood of car (front)
    const HOOD_DEBTH = CAR_DEBTH; //z
    const HOOD_HEIGHT = 4; //y
    const HOOD_WIDTH = 8; //x
    //const hoodGeo = new BoxGeometry(HOOD_WIDTH, HOOD_HEIGHT, HOOD_DEBTH, 4, 4);
    const hoodGeo = new CylinderGeometry(5, 6, 4, 4);
    const hoodMat = new MeshPhongMaterial({
      color: color
    });
    const hood = new Mesh(hoodGeo, hoodMat);
    hood.translateX(CAR_DEBTH);
    hood.translateY(-(CAR_HEIGHT / 4));

    hood.rotation.y = Math.PI / 4;
    this.add(hood);
  }
}