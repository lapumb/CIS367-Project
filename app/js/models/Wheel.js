import { TorusGeometry, CylinderGeometry, MeshPhongMaterial, Mesh, Group} from 'three';

export default class Wheel extends Group {
  constructor (numSpokes) { // number of spokes on the wheel
    super();    // invoke the super class constructor

    const WHEEL_RADIUS = 2;
    const TIRE_THICKNESS = 1;
    const tubeGeo = new TorusGeometry (WHEEL_RADIUS, TIRE_THICKNESS, 6, 30);
    const tubeMat = new MeshPhongMaterial ({color: 0x000000});
    const tube = new Mesh (tubeGeo, tubeMat);

    this.add (tube);  // place the torus in the group

    for (let k = 0; k < numSpokes; k++) {
      const spGeo = new CylinderGeometry (0.7 * TIRE_THICKNESS, 0.7 * TIRE_THICKNESS,
        WHEEL_RADIUS, 10, 10);
      const spMat = new MeshPhongMaterial({color: 0x756C6C});
      const sp = new Mesh (spGeo, spMat);
      sp.rotateZ (k * 2 * Math.PI / numSpokes);
      sp.translateY (WHEEL_RADIUS / 2);
      this.add (sp);   // place the cylinder in the group
    }
    // default to "return this;"
  }
}