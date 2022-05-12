//  ---------------- Three.js Global Variables ---------------- //
const clock = new THREE.Clock();
var camera_front, camera_side, camera_top;
var camera, scene, renderer;
var geometry, mesh;

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
    camera_front = createOrthoCamera(0, 0, 100);
    camera_side = createOrthoCamera(100, 0, 0);
    camera_top = createOrthoCamera(0, 100, 0);
    camera = camera_front; // default

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
    requestAnimationFrame(animate);
    updatePositions();
    render();
}

// ---------------- Scene Setup ---------------- //

function setupScene() {
    'use strict';
    scene = new THREE.Scene();

    // Adding Axis to the Scene
    scene.add(new THREE.AxisHelper(50));

    // Creating an object
    var cube = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    var geometry = new THREE.BoxGeometry(50, 50, 50);
    var mesh = new THREE.Mesh(geometry, material);
    cube.add(mesh);
    cube.position.set(0, 0, 0);

    // Adding Objects to the Scene
    scene.add(cube);

    // Defining objects to be manipulated
    target_object = cube;
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
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
            camera = camera_front;
            break;
        case 50: // '2'
            camera = camera_top;
            break;
        case 51: // '3'
            camera = camera_side;
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