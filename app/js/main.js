import * as THREE from 'three';

export default class App {
    constructor() {
        const c = document.getElementById('mycanvas');
        // Enable antialias for smoother lines
        this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
        this.scene = new THREE.Scene();
        // Use perspective camera:
        //   Field of view: 75 degrees
        //   Screen aspect ration 4:3
        //   Near plane at z=0.5, far plane at z=500
        this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.5, 500);
        // Place the camera at (0,0,100)
        this.camera.position.z = 100;
    
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
        let h = 0.75 * w;  /* maintain 4:3 ratio */
        if (canvas.offsetTop + h > window.innerHeight) {
          h = window.innerHeight - canvas.offsetTop - 16;
          w = 4/3 * h;
        }
        canvas.width = w;
        canvas.height = h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.tracker.handleResize();
      }
}