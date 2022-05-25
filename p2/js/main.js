//  ---------------- Three.js Global Variables ---------------- //
const clock = new THREE.Clock();
var camera, scene, renderer;
var geometry, mesh;

// 0 - front, 1 - top, 2 - right
var cameras = [];

// objects
var planet;

//  ---------------- Controllers ---------------- //

const head_group_position_controller = {
    39: { pressed: false, vec: new THREE.Vector3(1, 0, 0) },  // right
    37: { pressed: false, vec: new THREE.Vector3(-1, 0, 0) }, // left
    38: { pressed: false, vec: new THREE.Vector3(0, 1, 0) },  // up
    40: { pressed: false, vec: new THREE.Vector3(0, -1, 0) }, // down
    67: { pressed: false, vec: new THREE.Vector3(0, 0, 1) },  // 'c'
    68: { pressed: false, vec: new THREE.Vector3(0, 0, -1) }, // 'd'
}

// Controls the whole object
const head_group_rotation_controller = {
    81: { pressed: false, rotate: (obj, delta) => obj.rotateX(delta * 3) },  // q
    87: { pressed: false, rotate: (obj, delta) => obj.rotateX(-delta * 3) }, // w
}

// Controls the tail and the small sphere primitives
const body_group_rotation_controller = {
    65: { pressed: false, rotate: (obj, delta) => rotateAroundPoint(obj, big_sphere.position, new THREE.Vector3(0, 1, 0), delta * 3, false) },  // a
    83: { pressed: false, rotate: (obj, delta) => rotateAroundPoint(obj, big_sphere.position, new THREE.Vector3(0, 1, 0), -delta * 3, false) }, // s
}

// Controls the small sphere primitives
const tail_group_rotation_controller = {
    90: { pressed: false, rotate: (obj, delta) => rotateAroundPoint(obj, big_sphere.position, new THREE.Vector3(1, 1, 1).normalize(), delta * 3, false) },   // z 
    88: { pressed: false, rotate: (obj, delta) => rotateAroundPoint(obj, big_sphere.position, new THREE.Vector3(1, 1, 1).normalize(), -delta * 3, false) },  // x
}

//  ---------------- Object creation ------------------- //
function createPrimitive(x, y, z, obj_color, obj_geometry, rot_x, rot_y, rot_z, obj_side, texture) {
    if (texture != null) {
        material = new THREE.MeshBasicMaterial({ wireframe: true, side: obj_side, map: texture });
    }
    else {
        material = new THREE.MeshBasicMaterial({ color: obj_color, wireframe: true, side: obj_side });
    }
    geometry = obj_geometry;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.x = rot_x;
    mesh.rotation.y = rot_y;
    mesh.rotation.z = rot_z;
    return mesh;
}

function createPlanet(x, y, z) {
    const geometry = new THREE.SphereGeometry(60, 40, 10);
    const texture = new THREE.TextureLoader().load('textures/planet_texture.jpg');
    planet = createPrimitive(x, y, z, null, geometry, 0, 0, 0, null, texture);
    scene.add(planet);
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
    cameras.push(createOrthoCamera(0, 0, 600));
    cameras.push(createPerspectiveCamera(600, 600, 600));
    cameras.push(createPerspectiveCamera(0, 600, 0));
    camera = cameras[0];

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
    createPlanet(0, 0, 0);
}

// ---------------- Update Scene ---------------- //

function updatePositions() {
    const delta = clock.getDelta();

    // Update Position
    const obj1_velocity = new THREE.Vector3(0, 0, 0);
    Object.keys(head_group_position_controller).forEach((key) => {
        if (head_group_position_controller[key].pressed) {
            obj1_velocity.add(head_group_position_controller[key].vec);
        }
    });
    // head_group.position.add(obj1_velocity.normalize().multiplyScalar(delta * 80));

    // Update Rotation
    Object.keys(head_group_rotation_controller).forEach((key) => {
        if (head_group_rotation_controller[key].pressed) {
            // head_group_rotation_controller[key].rotate(head_group, delta);
        }
    });

    Object.keys(body_group_rotation_controller).forEach((key) => {
        if (body_group_rotation_controller[key].pressed) {
            // body_group_rotation_controller[key].rotate(body_group, delta);
        }
    });

    Object.keys(tail_group_rotation_controller).forEach((key) => {
        if (tail_group_rotation_controller[key].pressed) {
            // tail_group_rotation_controller[key].rotate(tail_group, delta);
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

function updateAspectRatio() {
    // TODO: if current camera is perspective or orthogonal
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
    scene.add(cam);
    return cam;
}

function createPerspectiveCamera(x, y, z) {
    'use strict';
    var cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    cam.position.x = x;
    cam.position.y = y;
    cam.position.z = z;
    cam.lookAt(scene.position);
    scene.add(cam)
    return cam;
}

// ---------------- Event Handlers ---------------- //

function onResize() {
    'use strict';
    updateAspectRatio();
}

function onKeyDown(e) {
    'use strict';

    // Move Whole Object
    if (head_group_position_controller[e.keyCode]) {
        head_group_position_controller[e.keyCode].pressed = true;
        return;
    }

    // Rotate Whole Object
    if (head_group_rotation_controller[e.keyCode]) {
        head_group_rotation_controller[e.keyCode].pressed = true;
        return;
    }

    // Rotate Body Group 
    if (body_group_rotation_controller[e.keyCode]) {
        body_group_rotation_controller[e.keyCode].pressed = true;
        return;
    }

    // Rotate Tail Group 
    if (tail_group_rotation_controller[e.keyCode]) {
        tail_group_rotation_controller[e.keyCode].pressed = true;
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
    if (head_group_position_controller[e.keyCode]) {
        head_group_position_controller[e.keyCode].pressed = false;
    }

    if (head_group_rotation_controller[e.keyCode]) {
        head_group_rotation_controller[e.keyCode].pressed = false;
    }

    if (body_group_rotation_controller[e.keyCode]) {
        body_group_rotation_controller[e.keyCode].pressed = false;
    }

    if (tail_group_rotation_controller[e.keyCode]) {
        tail_group_rotation_controller[e.keyCode].pressed = false;
    }
}

// ---------------- Helper Functions ---------------- //

function rotateAroundPoint(obj, point, axis, theta, pointIsWorld) {
    pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;
    if (pointIsWorld) {
        obj.parent.localToWorld(obj.position);
    }
    obj.position.sub(point);
    obj.position.applyAxisAngle(axis, theta);
    obj.position.add(point);
    if (pointIsWorld) {
        obj.parent.worldToLocal(obj.position);
    }
    obj.rotateOnAxis(axis, theta);
}