var camera_front, camera_side, camera_top;
var camera, scene, renderer;
var geometry, mesh;

var object1;
const position_controller = {
    39: { pressed: false, vec: new THREE.Vector3(1, 0, 0) },
    37: { pressed: false, vec: new THREE.Vector3(-1, 0, 0) },
    38: { pressed: false, vec: new THREE.Vector3(0, 1, 0) },
    40: { pressed: false, vec: new THREE.Vector3(0, -1, 0) },
    67: { pressed: false, vec: new THREE.Vector3(0, 0, 1) },
    68: { pressed: false, vec: new THREE.Vector3(0, 0, -1) },
}

const rotation_controller = {
    81: { pressde: false, vec: new THREE.Vector3(1, 0, 0) },
    87: { pressde: false, vec: new THREE.Vector3(-1, 0, 0) },
    65: { pressde: false, vec: new THREE.Vector3(0, 1, 0) },
    83: { pressde: false, vec: new THREE.Vector3(0, -1, 0) },
    90: { pressde: false, vec: new THREE.Vector3(0, 0, 1) },
    88: { pressde: false, vec: new THREE.Vector3(0, 0, -1) },
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
    update();
    render();
}

function update() {
    const obj1_velocity = new THREE.Vector3(0, 0, 0);
    Object.keys(position_controller).forEach((key) => {
        if (position_controller[key].pressed) {
            obj1_velocity.add(position_controller[key].vec);
        }
    });
    object1.position.add(obj1_velocity.normalize());
    const obj1_rotation = new THREE.Vector3(0, 0, 0);
    Object.keys(rotation_controller).forEach((key) => {
        if (rotation_controller[key].pressed) {
            obj1_rotation.add(rotation_controller[key].vec);
        }
    });
    // object1.rotation.add(obj1_rotation.normalize());
}

// ---------------- Scene ---------------- //

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
    object1 = cube;
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
        // Toggle Views
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
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    if (position_controller[e.keyCode]) {
        position_controller[e.keyCode].pressed = false;
    }
    if (position_controller[e.keyCode]) {
        position_controller[e.keyCode].pressed = false;
    }
}


