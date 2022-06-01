//  ---------------- Three.js Global Variables ---------------- //

const clock = new THREE.Clock();
var camera, scene, renderer;
var geometry, mesh;

// 0 - front, 1 - top, 2 - right
var cameras = new Array();

//  ---------------- Object Variables ---------------- //
const radius = 300;

var planet;
var rocket;

// quadrants
const cubeTrashes = {
    0: new Array(), 1: new Array(), 2: new Array(), 3: new Array(),
    4: new Array(), 5: new Array(), 6: new Array(), 7: new Array(),
}

const coneTrashes = {
    0: new Array(), 1: new Array(), 2: new Array(), 3: new Array(),
    4: new Array(), 5: new Array(), 6: new Array(), 7: new Array(),
}

//  ---------------- Controllers ---------------- //

const jump = THREE.Math.degToRad(60);

var rocket_controller = {
    39: { pressed: false, offset: new THREE.Vector3(0, 0, jump), rotation: Math.PI / 2 },     // right
    37: { pressed: false, offset: new THREE.Vector3(0, 0, - jump), rotation: - Math.PI / 2 }, // left
    38: { pressed: false, offset: new THREE.Vector3(0, - jump, 0), rotation: 0 },             // up
    40: { pressed: false, offset: new THREE.Vector3(0, jump, 0), rotation: Math.PI },         // down
}

//  ---------------- Object creation ------------------- //

function createPrimitive(x, y, z, obj_color, obj_geometry, rot_x, rot_y, rot_z, obj_side, texture) {
    material = new THREE.MeshPhongMaterial({ color: obj_color, wireframe: false, side: obj_side, map: texture });
    geometry = obj_geometry;
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.x = rot_x;
    mesh.rotation.y = rot_y;
    mesh.rotation.z = rot_z;
    return mesh;
}

function createPlanet(x, y, z) {
    const geometry = new THREE.SphereGeometry(radius, 40, 256);

    const material = new THREE.MeshPhongMaterial();
    material.map = new THREE.TextureLoader().load('textures/mars_texture.jpg');
    material.bumpMap = new THREE.TextureLoader().load('textures/mars_bump.png')
    material.bumpScale = 10

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
}

function createRocket() {
    rocket = new THREE.Object3D();

    // body
    var geometry = new THREE.CylinderGeometry(5, 5, 20, 30);
    mesh = createPrimitive(0, 0, 0, 0xeeeeee, geometry, null, null, null, null, null);
    rocket.add(mesh);

    // propulsors
    geometry = new THREE.CapsuleGeometry(1, 2, 10, 30);
    mesh = createPrimitive(5.5, -10, 0, 0xf73c3c, geometry, null, null, null, null, null);
    rocket.add(mesh);

    mesh = createPrimitive(-5.5, -10, 0, 0xf73c3c, geometry, null, null, null, null, null);
    rocket.add(mesh);

    mesh = createPrimitive(0, -10, -5.5, 0xf73c3c, geometry, null, null, null, null, null);
    rocket.add(mesh);

    mesh = createPrimitive(0, -10, 5.5, 0xf73c3c, geometry, null, null, null, null, null);
    rocket.add(mesh);

    // nose
    var geometry = new THREE.CylinderGeometry(0.1, 5, 9, 30);
    mesh = createPrimitive(0, 14.5, 0, 0xf73c3c, geometry, null, null, null, null, null);
    rocket.add(mesh);

    // random coordinates
    var phi = Math.random() * Math.PI * 2;
    var theta = Math.random() * Math.PI * 2;

    setFromSphericalCoords(rocket, radius * 1.2, 3 * Math.PI / 2, 0);
    rocket.lookAt(scene.position);

    scene.add(rocket);
}

function createTrash() {
    // Trash - cubes
    for (i = 0; i < 10; i++) {
        var cubeTrash = new THREE.Object3D();

        geometry = new THREE.BoxGeometry(8, 8, 8);
        mesh = createPrimitive(0, 0, 0, 0x0cbc1b9, geometry, null, null, null, null, null);

        cubeTrash.add(mesh);

        // random coordinates
        var phi = Math.random() * Math.PI * 2;
        var theta = Math.random() * Math.PI * 2;

        setFromSphericalCoords(cubeTrash, radius * 1.2, phi, theta);

        cubeTrash.rotateX(Math.random() * Math.PI * 2);
        cubeTrash.rotateY(Math.random() * Math.PI * 2);
        cubeTrash.rotateZ(Math.random() * Math.PI * 2);

        cubeTrashes[getPositionQuadrant(...cubeTrash.position)].push(cubeTrash);
        scene.add(cubeTrash);
    }

    // Trash - cylinder
    for (i = 0; i < 10; i++) {
        var coneTrash = new THREE.Object3D();

        geometry = new THREE.ConeGeometry(4, 15, 32);
        mesh = createPrimitive(0, 0, 0, 0x0a48984, geometry, null, null, null, null, null);

        coneTrash.add(mesh);

        // random coordinates
        var phi = Math.random() * Math.PI * 2;
        var theta = Math.random() * Math.PI * 2;

        setFromSphericalCoords(coneTrash, radius * 1.2, phi, theta);

        coneTrash.rotateX(Math.random() * Math.PI * 2);
        coneTrash.rotateY(Math.random() * Math.PI * 2);
        coneTrash.rotateZ(Math.random() * Math.PI * 2);

        coneTrashes[getPositionQuadrant(...coneTrash.position)].push(coneTrash);
        scene.add(coneTrash);
    }

}

//  ---------------- Lights Creation ---------------- //

function createLights() {
    const dlight = new THREE.DirectionalLight(0x404040, 7);
    const alight = new THREE.AmbientLight(0x404040, 1);
    scene.add(dlight);
    scene.add(alight);
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
    cameras.push(createPerspectiveCamera(550, 550, 550, scene.position));
    cameras.push(createPerspectiveCamera(0, - 50, radius * 1.2 + 100, rocket.position));
    camera = cameras[1];

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
    updateVirtualCamera();
    checkCollisions();
    requestAnimationFrame(animate);
    render();
}

// ---------------- Scene Setup ---------------- //

function setupScene() {
    'use strict';
    scene = new THREE.Scene();

    // Add scene background
    scene.background = new THREE.TextureLoader().load('textures/stars_texture.jpg');

    // Adding Axis to the Scene
    scene.add(new THREE.AxesHelper(50));

    // Creating objects
    createPlanet(0, 0, 0);
    createRocket();
    createTrash();

    // Creating Lights
    createLights();
}

// ------------ Update Virtual Camera ------------ //

function updateVirtualCamera() {
    // rocket position in spherical coords
    rocket_pos = new THREE.Spherical().setFromVector3(rocket.position);

    // virtual camera position
    setFromSphericalCoords(cameras[2], rocket_pos.radius + 150, rocket_pos.phi + Math.PI / 20, rocket_pos.theta);

    // virtual camera looking at rocket
    cameras[2].lookAt(rocket.position);
}

// ---------------- Update Scene ---------------- //

function updatePositions() {
    const delta = clock.getDelta();

    var pair = true;
    var move = false;
    var rocket_angle = 0;
    var final_offset = new THREE.Vector3(0, 0, 0);
    Object.keys(rocket_controller).forEach((key) => {
        if (rocket_controller[key].pressed) {
            pair = !pair;
            move = true;

            final_offset = final_offset.add(rocket_controller[key].offset);
            rocket_angle = rocket_angle + rocket_controller[key].rotation;
        }
    });


    if (move) {
        // add offset to old position
        const rocket_old_pos_spherical = new THREE.Spherical().setFromVector3(rocket.position);

        final_offset = final_offset.normalize()

        var new_radius = rocket_old_pos_spherical.radius + final_offset.x * delta;
        var new_phi = rocket_old_pos_spherical.phi + final_offset.y * delta;
        var new_theta = rocket_old_pos_spherical.theta + final_offset.z * delta;

        var flag = false;
        if (new_phi <= 0) {
            flag = true;
            new_phi = Math.PI / 10;
            console.log("1", rocket_controller)
        }
        if (new_phi >= Math.PI) {
            flag = true;
            new_phi = Math.PI - Math.PI / 10;
            console.log("2", rocket_controller)
        }
        if (flag) {
            new_theta = new_theta + Math.PI;
            const new_jump_38 = - rocket_controller[38].offset[1];
            const new_rotation_38 = (rocket_controller[38].rotation == 0) ? Math.PI : 0;
            rocket_controller[38].offset[1] = new_jump_38;
            rocket_controller[38].rotation = new_rotation_38;
            const new_jump_40 = - rocket_controller[40].offset[1];
            const new_rotation_40 = (rocket_controller[40].rotation == 0) ? Math.PI : 0;
            rocket_controller[40].offset[1] = new_jump_40;
            rocket_controller[40].rotation = new_rotation_40;

            // TODO
            const new_jump_39 = - rocket_controller[39].offset[2];
            const new_rotation_39 = - rocket_controller[39].rotation;
            rocket_controller[39].offset[2] = new_jump_39;
            rocket_controller[39].rotation = new_rotation_39;

            const new_jump_37 = - rocket_controller[37].offset[2];
            const new_rotation_37 = - rocket_controller[37].rotation;
            rocket_controller[37].offset[2] = new_jump_37;
            rocket_controller[37].rotation = new_rotation_37;

        }

        setFromSphericalCoords(rocket,
            new_radius,
            new_phi,
            new_theta
        )

        // rocket angle
        if (pair) {
            rocket_angle = rocket_angle / 2;
            // special case
            if (rocket_controller[37].pressed && rocket_controller[40].pressed) {
                rocket_angle = rocket_angle + Math.PI;
            }
        }

        rocket.lookAt(scene.position);
        rocket.rotateZ(rocket_angle);
    }

}

function updateDisplayType() {
    scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = !node.material.wireframe;
        }
    });
}

function updateCameras() {
    cameras.forEach((c) => {
        if (c.isPerspectiveCamera) {
            c.aspect = window.innerWidth / window.innerHeight;
            c.updateProjectionMatrix();
        } else if (c.isOrthographicCamera) {
            c.left = window.innerWidth / - 2
            c.right = window.innerWidth / 2
            c.top = window.innerHeight / 2
            c.bottom = window.innerHeight / - 2
            c.updateProjectionMatrix();
        }
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function checkCollisions() {
    // TODO: dois lixos podem colidir logo desde o inicio?
    const quadrant = getPositionQuadrant(...rocket.position);

    cubeTrashes[quadrant].forEach((cube, idx) => {
        const cube_sphere_radius = 8 * Math.sqrt(3) / 2;
        if (cube.position.clone().sub(rocket.position).length() <= (15 + cube_sphere_radius)) {
            cube.clear();
        }
    });

    coneTrashes[quadrant].forEach((cone, idx) => {
        const cone_sphere_radius = 10;
        if (cone.position.clone().sub(rocket.position).length() <= (15 + cone_sphere_radius)) {
            cone.clear();
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
    scene.add(cam);
    return cam;
}

function createPerspectiveCamera(x, y, z, lookAt) {
    'use strict';
    var cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    cam.position.x = x;
    cam.position.y = y;
    cam.position.z = z;
    cam.lookAt(lookAt);
    scene.add(cam)
    return cam;
}

// ---------------- Event Handlers ---------------- //

function onResize() {
    updateCameras();
}

function onKeyDown(e) {
    // Move Whole Object
    if (rocket_controller[e.keyCode]) {
        rocket_controller[e.keyCode].pressed = true;
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
    if (rocket_controller[e.keyCode]) {
        rocket_controller[e.keyCode].pressed = false;
    }
}

// ---------------- Helper Functions ---------------- //

function getPositionQuadrant(x, y, z) {
    x_positive = x >= 0 ? 0 : 1;
    y_positive = y >= 0 ? 0 : 1;
    z_positive = z >= 0 ? 0 : 1;
    return x_positive + y_positive * 2 + z_positive * 4;
}

function setFromSphericalCoords(object, radius, phi, theta) {
    object.position.x = radius * Math.sin(phi) * Math.sin(theta);
    object.position.y = radius * Math.cos(phi);
    object.position.z = radius * Math.sin(phi) * Math.cos(theta);
}