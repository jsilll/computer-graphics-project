//  ---------------- Three.js Global Variables ---------------- //

const clock = new THREE.Clock();

var geometry, mesh;
var camera, scene, renderer;

var cameras = new Array();

//  ---------------- Object Variables ---------------- //
const radius = 300;
const cone_collision_radius = 10;
const cube_collision_radius = 8 * Math.sqrt(3) / 2;

var planet;
var rocket;
var rocket_group;

// Quadrant Based Storing for the Cube Trashes
const cubeTrashes = {
    0: new Array(), 1: new Array(), 2: new Array(), 3: new Array(),
    4: new Array(), 5: new Array(), 6: new Array(), 7: new Array(),
}

// Quadrant Based Storing for the Cube Trashes
const coneTrashes = {
    0: new Array(), 1: new Array(), 2: new Array(), 3: new Array(),
    4: new Array(), 5: new Array(), 6: new Array(), 7: new Array(),
}

//  ---------------- Controllers ---------------- //

const rocket_jump = THREE.Math.degToRad(60);

var rocket_controller = {
    39: { pressed: false, offset: new THREE.Vector3(0, 0, rocket_jump), rotation: Math.PI / 2 },     // right
    37: { pressed: false, offset: new THREE.Vector3(0, 0, - rocket_jump), rotation: - Math.PI / 2 }, // left
    38: { pressed: false, offset: new THREE.Vector3(0, - rocket_jump, 0), rotation: 0 },             // up
    40: { pressed: false, offset: new THREE.Vector3(0, rocket_jump, 0), rotation: Math.PI },         // down
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
    const planet_geometry = new THREE.SphereGeometry(radius, 40, 256);

    const planet_material = new THREE.MeshPhongMaterial();
    planet_material.map = new THREE.TextureLoader().load('textures/mars_texture.jpg');
    planet_material.bumpMap = new THREE.TextureLoader().load('textures/mars_bump.png')
    planet_material.bumpScale = 10

    const planet_mesh = new THREE.Mesh(planet_geometry, planet_material);
    planet_mesh.position.set(x, y, z);
    scene.add(planet_mesh);
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
}

function createTrash() {
    const trash_radius = radius * 1.2;

    // Trash - cubes
    for (i = 0; i < 20; i++) {
        var cubeTrash = new THREE.Object3D();

        geometry = new THREE.BoxGeometry(8, 8, 8);
        mesh = createPrimitive(0, 0, 0, 0x0cbc1b9, geometry, null, null, null, null, null);

        cubeTrash.add(mesh);

        // Random Coordinates
        var phi = Math.random() * Math.PI * 2;
        var theta = Math.random() * Math.PI * 2;
        var cube_pos = new THREE.Vector3(...posFromSphericalCoords(trash_radius, phi, theta));
        while (trashIsColliding(cube_pos, cubeTrashes[getPositionQuadrant(cube_pos.x, cube_pos.y, cube_pos.z)], cube_collision_radius)) {
            phi = Math.random() * Math.PI * 2;
            theta = Math.random() * Math.PI * 2;
            cube_pos = new THREE.Vector3(...posFromSphericalCoords(trash_radius, phi, theta));
        }

        setFromSphericalCoords(cubeTrash, trash_radius, phi, theta);

        cubeTrash.rotateX(Math.random() * Math.PI * 2);
        cubeTrash.rotateY(Math.random() * Math.PI * 2);
        cubeTrash.rotateZ(Math.random() * Math.PI * 2);

        cubeTrashes[getPositionQuadrant(...cubeTrash.position)].push(cubeTrash);
        scene.add(cubeTrash);
    }

    // Trash - cylinder
    for (i = 0; i < 20; i++) {
        var coneTrash = new THREE.Object3D();

        geometry = new THREE.ConeGeometry(4, 15, 32);
        mesh = createPrimitive(0, 0, 0, 0x0a48984, geometry, null, null, null, null, null);

        coneTrash.add(mesh);

        // Random Coordinates
        var phi = Math.random() * Math.PI * 2;
        var theta = Math.random() * Math.PI * 2;
        var cone_pos = new THREE.Vector3(...posFromSphericalCoords(trash_radius, phi, theta));
        while (trashIsColliding(cone_pos, coneTrashes[getPositionQuadrant(cone_pos.x, cone_pos.y, cone_pos.z)], cone_collision_radius)) {
            phi = Math.random() * Math.PI * 2;
            theta = Math.random() * Math.PI * 2;
            cone_pos = new THREE.Vector3(...posFromSphericalCoords(trash_radius, phi, theta));
        }

        setFromSphericalCoords(coneTrash, trash_radius, phi, theta);

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

    setupObjects();
    setupCameras();
    setupRocketGroup();

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
    checkRocketTrashCollisions();
    render();
}

// ---------------- Scene Setup ---------------- //

function setupObjects() {
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

function setupCameras() {
    // Setting Up Cameras
    cameras.push(createOrthoCamera(0, 0, 600));
    cameras.push(createPerspectiveCamera(550, 550, 550, scene.position));
    cameras.push(createPerspectiveCamera(0, -50, -100, rocket.position));
    camera = cameras[1];
}

function setupRocketGroup() {
    rocket_group = new THREE.Group();
    rocket_group.add(cameras[2]);
    rocket_group.add(rocket);

    // Getting Random Coordinates
    var phi = Math.random() * Math.PI * 2;
    var theta = Math.random() * Math.PI * 2;
    setFromSphericalCoords(rocket_group, radius * 1.2, 3 * Math.PI / 2, 0);
    rocket_group.userData = { radius: radius * 1.2, phi: phi, theta: theta };
    rocket_group.lookAt(scene.position);
    scene.add(rocket_group);
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
        final_offset = final_offset.normalize()

        rocket_group.userData.radius += final_offset.x * delta;
        rocket_group.userData.phi += final_offset.y * delta;
        rocket_group.userData.theta += final_offset.z * delta;

        var needs_swapping = false;
        if (rocket_group.userData.phi <= 0) {
            needs_swapping = true;
            rocket_group.userData.phi = 0.01;
        }
        if (rocket_group.userData.phi >= Math.PI) {
            needs_swapping = true;
            rocket_group.userData.phi = Math.PI - 0.01;
        }
        if (needs_swapping) {
            rocket_group.userData.theta = rocket_group.userData.theta + Math.PI;

            // Swap Up and Down Keys
            rocket_controller[38].offset.y = - rocket_controller[38].offset.y;;
            rocket_controller[38].rotation = (rocket_controller[38].rotation == 0) ? Math.PI : 0;;

            rocket_controller[40].offset.y = - rocket_controller[40].offset.y;
            rocket_controller[40].rotation = (rocket_controller[40].rotation == 0) ? Math.PI : 0;

            // Swap Left and Right Keys
            rocket_controller[39].offset.z = - rocket_controller[39].offset.z;
            rocket_controller[39].rotation = - rocket_controller[39].rotation;;

            rocket_controller[37].offset.z = - rocket_controller[37].offset.z;;
            rocket_controller[37].rotation = - rocket_controller[37].rotation;;
        }

        setFromSphericalCoords(rocket_group, rocket_group.userData.radius, rocket_group.userData.phi, rocket_group.userData.theta)

        // Rocket Angle
        if (pair) {
            rocket_angle = rocket_angle / 2;
            // Edge Case
            if (rocket_controller[37].pressed && rocket_controller[40].pressed) {
                rocket_angle = rocket_angle + Math.PI;
            }
        }

        rocket_group.lookAt(scene.position);
        rocket_group.rotateZ(rocket_angle);
        rocket.rotateY(delta);
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
        } else if (c.isOrthographicCamera) {
            c.left = window.innerWidth / - 2
            c.right = window.innerWidth / 2
            c.top = window.innerHeight / 2
            c.bottom = window.innerHeight / - 2
        }

        c.updateProjectionMatrix();
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function checkRocketTrashCollisions() {
    const quadrant = getPositionQuadrant(...rocket_group.position);

    cubeTrashes[quadrant].filter((cube) => {
        if (areColliding(cube.position.clone(), rocket_group.position, 15, cube_collision_radius)) {
            scene.remove(cube);
            return true;
        }
        return false;

    });

    coneTrashes[quadrant].filter((cone) => {
        if (areColliding(cone.position.clone(), rocket_group.position, 15, cone_collision_radius)) {
            scene.remove(cone);
            return true;
        }
        return false;
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
    // Move Keys
    if (rocket_controller[e.keyCode]) {
        rocket_controller[e.keyCode].pressed = true;
        return;
    }

    // Toggles
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
    y_positive = y >= 0 ? 0 : 2;
    z_positive = z >= 0 ? 0 : 4;
    return x_positive + y_positive + z_positive;
}

function setFromSphericalCoords(object, radius, phi, theta) {
    const [x, y, z] = posFromSphericalCoords(radius, phi, theta);
    object.position.x = x;
    object.position.y = y;
    object.position.z = z;
}

function posFromSphericalCoords(radius, phi, theta) {
    return [radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.cos(theta)];
}

function trashIsColliding(pos, neighbors, r) {
    for (let i = 0; i < neighbors.length; i++) {
        if (areColliding(pos, neighbors, r, r)) {
            return true;
        }
    }
    return false;
}

function areColliding(pos1, pos2, r1, r2) {
    return pos1.sub(pos2).length() <= (r1 + r2)
}
