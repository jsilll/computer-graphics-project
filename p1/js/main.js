var camera_front, camera_side, camera_top;
var camera, scene, renderer;
var geometry, mesh;

var object1;
const position_controller = {
    39: { pressed: false, vec: [1, 0, 0] },
    37: { pressed: false, vec: [-1, 0, 0] },
    38: { pressed: false, vec: [0, 1, 0] },
    40: { pressed: false, vec: [0, -1, 0] },
    67: { pressed: false, vec: [0, 0, 1] },
    68: { pressed: false, vec: [0, 0, -1] },
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

    render();
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function animate() {
    'use strict';
    requestAnimationFrame(animate);

    // Update obj1's position
    const obj1_velocity = new THREE.Vector3(0, 0, 0);
    Object.keys(position_controller).forEach((key) => {
        if (position_controller[key].pressed) {
            obj1_velocity.add(new THREE.Vector3(...position_controller[key].vec));
        }
    });

    object1.position.add(obj1_velocity.normalize());

    render();
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

    // TODO: Bug, faz stretch quando a window faz resize

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

        // TODO: Rotation Handling
        case 81: // 'q' 'Q'
            break;
        case 87: // 'w' 'W'
            break;
        case 65: // 'a' 'A'
            break;
        case 83: // 's' 'S'
            break;
        case 90: // 'z' 'Z'
            break;
        case 88: // 'x' 'X'
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    if (position_controller[e.keyCode]) {
        position_controller[e.keyCode].pressed = false;
    }
}


