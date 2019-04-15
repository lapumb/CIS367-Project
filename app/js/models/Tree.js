import { ConeGeometry, CylinderGeometry, MeshPhongMaterial, Mesh, Group} from 'three';

export default class Tree extends Group {
    constructor () { // number of spokes on the wheel
      super();    // invoke the super class constructor
  
      const TRUNK_RADIUS = 5;
      const TRUNK_HEIGHT = 15; 
      //const TIRE_THICKNESS = 20;
      const trunkGeo = new CylinderGeometry(TRUNK_RADIUS, TRUNK_RADIUS, TRUNK_HEIGHT, 30, 10);
      const trunkMat = new MeshPhongMaterial ({color: 0xcc6600});
      const trunk = new Mesh (trunkGeo, trunkMat);
  
      this.add (trunk);  // place the torus in the group

      const TREE_RADIUS = 8; 
      const TREE_HEIGHT = 20; 
      const treeGeo = new ConeGeometry(TREE_RADIUS, TREE_HEIGHT, 30, 10); 
      const treeMat = new MeshPhongMaterial({color: 0x66cc00}); 
      const tree = new Mesh (treeGeo, treeMat); 
      tree.translateY(TRUNK_HEIGHT-5);
      this.add(tree); 
  
      // default to "return this;"
    }
  }
