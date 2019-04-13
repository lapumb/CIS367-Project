import { MeshPhongMaterial, Mesh, Group, BoxGeometry } from 'three';

export default class Car extends Group {
    constructor() { // number of spokes on the wheel
        super();    // invoke the super class constructor

        //body of car
        const CAR_WIDTH = 12; //x
        const CAR_HEIGHT = 8; //y
        const CAR_DEBTH = 10; //z
        const carGeo = new BoxGeometry(CAR_WIDTH, CAR_HEIGHT, CAR_DEBTH, 4, 4);
        const carMat = new MeshPhongMaterial({ color: 0xB52A2A }); //currently a green color
        const carBody = new Mesh(carGeo, carMat);
        this.add(carBody);

        //hood of car (front)
        const HOOD_DEBTH = CAR_DEBTH; //z
        const HOOD_HEIGHT = 4; //y
        const HOOD_WIDTH = 8; //x
        const hoodGeo = new BoxGeometry(HOOD_WIDTH, HOOD_HEIGHT, HOOD_DEBTH, 4, 4);
        const hoodMat = new MeshPhongMaterial({ color: 0xB52A2A });
        const hood = new Mesh(hoodGeo, hoodMat);
        hood.translateX(CAR_DEBTH);
        hood.translateY(-(CAR_HEIGHT/4));
        this.add(hood);
    }
}