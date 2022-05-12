//  ---------------- Three.js Global Variables ---------------- //
const clock = new THREE.Clock();
var camera, scene, renderer;
var geometry, mesh;

// 0 - front, 1 - top, 2 - right
var cameras = [];

//  ---------------- Controllers ---------------- //
var target_object;

const position_controller = {
    39: { pressed: false, vec: new THREE.Vector3(1, 0, 0) },  // right
    37: { pressed: false, vec: new THREE.Vector3(-1, 0, 0) }, // left
    38: { pressed: false, vec: new THREE.Vector3(0, 1, 0) },  // up
    40: { pressed: false, vec: new THREE.Vector3(0, -1, 0) }, // down
    67: { pressed: false, vec: new THREE.Vector3(0, 0, 1) },  // 'c'
    68: { pressed: false, vec: new THREE.Vector3(0, 0, -1) }, // 'd'
}

const rotation_controller = {
    81: { pressde: false, rotate: (obj, delta) => obj.rotateX(delta * 1) },  // q
    87: { pressde: false, rotate: (obj, delta) => obj.rotateX(delta * -1) }, // w
    65: { pressde: false, rotate: (obj, delta) => obj.rotateY(delta * 1) },  // a
    83: { pressde: false, rotate: (obj, delta) => obj.rotateY(delta * -1) }, // s
    90: { pressde: false, rotate: (obj, delta) => obj.rotateZ(delta * 1) },  // z 
    88: { pressde: false, rotate: (obj, delta) => obj.rotateZ(delta * -1) }, // x
}

//  ---------------- Object creation ------------------- //
function createPrimitive(x, y, z, obj_color, obj_geometry, rot_x, rot_y, rot_z, obj_side) {
    material = new THREE.MeshBasicMaterial({ color: obj_color, wireframe: true, side: obj_side });
    geometry = obj_geometry;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.x = rot_x;
    mesh.rotation.y = rot_y;
    mesh.rotation.z = rot_z;
    return mesh;
}

function createTower(x, y, z) {
    'use strict';

    var tower = new THREE.Object3D();

    // box
    mesh = createPrimitive(x, y, z, 0xf94848, new THREE.BoxGeometry(50, 50, 50, 10), 0, 0, 0, null);
    tower.add(mesh);

    // plane
    mesh = createPrimitive(x, y + 35, z, 0xf97d48, new THREE.CircleGeometry(25, 10), 1.6, 0, 0, THREE.DoubleSide)
    tower.add(mesh);

    // // cone
    mesh = createPrimitive(x, y + 65, z, 0x00ff00, new THREE.ConeGeometry(26, 35, 12), 0, 0, 0, null)
    tower.add(mesh);

    scene.add(tower);

    tower.position.x = x;
    tower.position.y = y;
    tower.position.z = z;

}

function createPlanet(x, y, z) {
    'use strict';

    var planet = new THREE.Object3D();

    // big sphere
    mesh = createPrimitive(x, y, z, 0xf9c348, new THREE.SphereGeometry(40, 7, 7), 0, 0, 0, null);
    planet.add(mesh);

    // ring geometry
    mesh = createPrimitive(x, y, z, 0xf89c47, new THREE.RingGeometry(70, 65, 20), 2, 0, 0, THREE.DoubleSide);
    planet.add(mesh);

    // small sphere
    mesh = createPrimitive(x + 70, y + 15, z, 0xf9c348, new THREE.SphereGeometry(7, 7, 7), 0, 0, 0, null);
    planet.add(mesh);

    scene.add(planet);

    planet.position.x = x;
    planet.position.y = y;
    planet.position.z = z;
}

function createAbstract(x, y, z) {

    var abstract = new THREE.Object3D();

    mesh = createPrimitive(x, y + 10, z, 0x47d6f8, new THREE.SphereGeometry(40, 10, 5, Math.PI * 0.1, Math.PI * 1.5, Math.PI * 0.1, Math.PI * 0.5), 0, 0, 0, null);
    abstract.add(mesh);

    mesh = createPrimitive(x + 15, y - 80, z - 15, 0x00ff00, new THREE.TubeGeometry(new CustomSinCurve(20), 20, 5, 8, false), 0, 1, 2, null);
    abstract.add(mesh);

    // small sphere
    mesh = createPrimitive(x + 45, y - 90, z + 4, 0xf9c348, new THREE.SphereGeometry(7, 7, 7), 0, 0, 0, null);
    abstract.add(mesh);

    scene.add(abstract);

    abstract.position.x = x;
    abstract.position.y = y;
    abstract.position.z = z;

    // Defining objects to be manipulated
    target_object = abstract;

}

function createMoustache(x, y, z) {

    var moustache = new THREE.Object3D();

    // tube
    mesh = createPrimitive(x, y, z, 0x6425ff, new THREE.TubeGeometry(new CustomSinCurve(20), 20, 5, 8, false), 0, 0, 0, null)
    moustache.add(mesh);

    // sphere
    mesh = createPrimitive(x + 21, y - 15, z, 0xFF00FF, new THREE.SphereGeometry(15, 32, 16), 0, 0, 0, false);
    moustache.add(mesh);

    // left cylinder
    mesh = createPrimitive(x - 30, y + 17, z, 0xf9c348, new THREE.CylinderGeometry(20, 20, 10, 32), 0, 0, Math.PI / 2, false);
    moustache.add(mesh);

    // right cylinder
    mesh = createPrimitive(x + 70, y + 17, z, 0xf9c348, new THREE.CylinderGeometry(20, 20, 10, 32), 0, 0, Math.PI / 2, false);
    moustache.add(mesh);

    scene.add(moustache);
}

function createIceCream(x, y, z) {

    var iceCream = new THREE.Object3D();

    // cone
    mesh = createPrimitive(x, y, z, 0xf9c348, new THREE.ConeGeometry(30, 70, 32), 0, 0, Math.PI, false);
    iceCream.add(mesh);

    // sphere
    mesh = createPrimitive(x, y + 45, z, 0xA52A2A, new THREE.SphereGeometry(30, 32, 16), 0, 0, 0, false);
    iceCream.add(mesh);

    // torus
    mesh = createPrimitive(x, y, z, 0x0076DC, new THREE.TorusGeometry(30, 15, 16, 100), Math.PI / 2, 0, 0, false);
    iceCream.add(mesh);

    scene.add(iceCream);
}

function createCurvedTube(x, y, z) {

    var curvedTube = new THREE.Object3D();

    mesh = createPrimitive(x, y, z, 0x812458, new THREE.BoxGeometry(30, 75, 50, 4), 0, 0, 0, null);
    curvedTube.add(mesh);

    mesh = createPrimitive(x + 37, y - 15, z, 0x455797, new THREE.ConeGeometry(20, 45, 22), 0, 0, Math.PI, false);
    curvedTube.add(mesh);

    mesh = createPrimitive(x, y + 45, z, 0x637872, new THREE.TorusGeometry(15, 5, 16, 100), Math.PI / 2, 0, 0, false);
    curvedTube.add(mesh);

    mesh = createPrimitive(x + 50, y + 30, z, 0xFFFFFF, new THREE.ParametricGeometry(paraFunction, 8, 8), Math.PI / 2, Math.PI / 2, 0, false);
    curvedTube.add(mesh);

    scene.add(curvedTube);
}

//  ---------------- Auxiliary function to ParametricGeometry ---------------- //
var paraFunction = function (u, v) {

    u *= Math.PI;
    v *= 2 * Math.PI;
    u = u * 2;

    let x;
    let z;

    if (u < Math.PI) {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
        z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
    }

    const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

    return new THREE.Vector3(x, y, z).multiplyScalar(3);

}

//  ---------------- Auxiliary function to TubeGeometry ---------------- //

class CustomSinCurve extends THREE.Curve {
    constructor(scale) {
        super();
        this.scale = scale;
    }

    getPoint(t) {
        const tx = t * 5 - 1.5;
        const ty = Math.cos(2 * Math.PI * t);
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
}

//  ---------------- Three.js Functions ---------------- //

function init() {
    'use strict';
    // Setting up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Setting up Scene
    setupScene();

    // Setting Up Cameras
    cameras.push(createOrthoCamera(0, 0, 300));
    cameras.push(createOrthoCamera(300, 0, 0));
    cameras.push(createOrthoCamera(0, 300, 0));
    camera = cameras[0]; // default

    // Event Listeners for User Interactions
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function animate() {
    'use strict';
    updatePositions();
    requestAnimationFrame(animate);
    render();
}

// ---------------- Scene Setup ---------------- //

function setupScene() {
    'use strict';
    scene = new THREE.Scene();

    // Adding Axis to the Scene
    scene.add(new THREE.AxisHelper(50));

    // Creating objects
    createTower(0, 0, 0);
    createPlanet(50, 90, 50);
    createAbstract(50, 0, 10);
    createMoustache(-150, 10, 10);
    createIceCream(-150, -150, 80);
    createCurvedTube(-55, -175, 80);
}

// ---------------- Update Scene ---------------- //

function updatePositions() {
    const delta = clock.getDelta();

    // Update Position
    const obj1_velocity = new THREE.Vector3(0, 0, 0);
    Object.keys(position_controller).forEach((key) => {
        if (position_controller[key].pressed) {
            obj1_velocity.add(position_controller[key].vec);
        }
    });
    target_object.position.add(obj1_velocity.normalize().multiplyScalar(delta * 80));

    // Update Rotation
    Object.keys(rotation_controller).forEach((key) => {
        if (rotation_controller[key].pressed) {
            rotation_controller[key].rotate(target_object, delta);
        }
    });
}

function updateDisplayType() {
    scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = !node.material.wireframe;
        }
    });
}

function updateAspectRation() {
    cameras.forEach((c) => {
        c.left = window.innerWidth / - 2
        c.right = window.innerWidth / 2
        c.top = window.innerHeight / 2
        c.bottom = window.innerHeight / - 2
        c.updateProjectionMatrix();
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ---------------- Cameras ---------------- //

function createOrthoCamera(x, y, z) {
    'use strict';
    var cam = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    cam.position.x = x;
    cam.position.y = y;
    cam.position.z = z;
    cam.lookAt(scene.position);
    return cam;
}

// ---------------- Event Handlers ---------------- //

function onResize() {
    'use strict';
    updateAspectRation();
}

function onKeyDown(e) {
    'use strict';
    // Move Whole Object
    if (position_controller[e.keyCode]) {
        position_controller[e.keyCode].pressed = true;
        return;
    }
    // Rotate Whole Object
    if (rotation_controller[e.keyCode]) {
        rotation_controller[e.keyCode].pressed = true;
        return;
    }
    switch (e.keyCode) {
        // Toggle Camera Views
        case 49: // '1'
            camera = cameras[0];
            break;
        case 50: // '2'
            camera = cameras[1];
            break;
        case 51: // '3'
            camera = cameras[2];
            break;

        // Toggle Wireframe / Solid Mode 
        case 52: // '4'
            updateDisplayType();
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    if (position_controller[e.keyCode]) {
        position_controller[e.keyCode].pressed = false;
    }
    if (rotation_controller[e.keyCode]) {
        rotation_controller[e.keyCode].pressed = false;
    }
}