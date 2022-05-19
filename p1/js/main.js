//  ---------------- Three.js Global Variables ---------------- //
const clock = new THREE.Clock();
var camera, scene, renderer;
var geometry, mesh;

// 0 - front, 1 - top, 2 - right
var cameras = [];

//  ---------------- Controllers ---------------- //
var head_group, body_group, big_sphere;

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
    material = new THREE.MeshBasicMaterial({ color: obj_color, wireframe: true, side: obj_side, map : texture});
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
    var color = 0xf94848;
    var geometry = new THREE.BoxGeometry(70, 70, 70, 10);
    mesh = createPrimitive(x, y, z, color, geometry, 0, 0, 0, null, null);
    tower.add(mesh);

    // plane
    color = 0xf97d48;
    geometry = new THREE.CircleGeometry(45, 10);
    const rot_x = Math.PI / 2;
    const side_type = THREE.DoubleSide;
    mesh = createPrimitive(x, y + 60, z, color, geometry, rot_x, 0, 0, side_type, null)
    tower.add(mesh);

    // // cone
    color = 0x8bfc74;
    geometry = new THREE.ConeGeometry(45, 70, 12);
    mesh = createPrimitive(x, y + 115, z, color, geometry, 0, 0, 0, null, null);
    tower.add(mesh);

    scene.add(tower);

    tower.rotateX(Math.PI / 4);
    tower.rotateY(Math.PI / 7);
    tower.rotateZ(Math.PI / 3.5);

    tower.position.x = x;
    tower.position.y = y;
    tower.position.z = z;

}

function createPlanet(x, y, z) {
    'use strict';

    var planet = new THREE.Object3D();

    // big sphere
    var geometry =  new THREE.SphereGeometry(60, 40, 10);
    const texture = new THREE.TextureLoader().load('textures/planet_texture.jpg');
    mesh = createPrimitive(x, y, z, null, geometry, 0, 0, 0, null, texture);
    planet.add(mesh);

    // ring geometry
    var color = 0x7a33ff;
    geometry = new THREE.RingGeometry(100, 110, 50);
    const side_type = THREE.DoubleSide;
    const rot_x = Math.PI / 2;
    mesh = createPrimitive(x, y, z, color, geometry, rot_x, 0, 0, side_type, null);
    planet.add(mesh);

    // small sphere
    color = 0xec54ba;
    geometry = new THREE.SphereGeometry(10, 10, 10);
    mesh = createPrimitive(x + 105, y + 20, z, color, geometry, 0, 0, 0, null, null);
    planet.add(mesh);

    scene.add(planet);

    planet.rotateX(Math.PI / 7);

    planet.position.x = x;
    planet.position.y = y;
    planet.position.z = z;
}

function createAbstract(x, y, z) {
    
    // head - this is a global variable, to accessing it's position
    var geometry = new THREE.SphereGeometry(70, 20, 5, Math.PI / 10, Math.PI * 3/2, Math.PI / 10, Math.PI / 2);
    const side_type = THREE.DoubleSide;
    var texture = new THREE.TextureLoader().load('textures/abstract_texture.jpg');
    big_sphere = createPrimitive(x, y, z, null, geometry, 0, 0, 0, side_type, texture);
    
    // tail
    geometry = new THREE.TubeGeometry(new CustomSinCurve(150, 4), 20, 5, 8, false);
    texture = new THREE.TextureLoader().load('textures/abstract_spiral.jpg');
    const rot_x = Math.PI;
    const rot_z = Math.PI / 2;
    var tube = createPrimitive(x, y - 40, z, null, geometry, rot_x, 0, rot_z, null,  texture);
    
    // ball
    geometry = new THREE.SphereGeometry(10, 7, 7);
    texture = new THREE.TextureLoader().load('textures/abstract_ball.jpg');
    var small_sphere = createPrimitive(x + 40, y - 190, z, null, geometry, 0, 0, 0, null, texture);
    
    tail_group = new THREE.Object3D();
    tail_group.add(small_sphere);

    body_group = new THREE.Object3D();
    body_group.add(tail_group);
    body_group.add(tube);

    head_group = new THREE.Object3D();
    head_group.add(body_group);
    head_group.add(big_sphere);

    head_group.position.x = x;
    head_group.position.y = y;
    head_group.position.z = z;

    head_group.rotateY(Math.PI / 3.5);
    head_group.rotateX(-Math.PI / 8);

    scene.add(head_group);
}

function createMoustache(x, y, z) {

    var moustache = new THREE.Object3D();

    // tube
    var geometry = new THREE.TubeGeometry(new CustomCosCurve(50), 20, 10, 8, false);
    var texture = new THREE.TextureLoader().load('textures/moustache_texture.jpg');
    mesh = createPrimitive(x, y, z, null, geometry, 0, 0, 0, null, texture);
    moustache.add(mesh);

    // sphere
    geometry = new THREE.SphereGeometry(20, 32, 16);
    texture = new THREE.TextureLoader().load('textures/moustache_ball.jpg');
    mesh = createPrimitive(x + 125, y - 45, z, null, geometry, 0, 0, 0, null, texture);
    moustache.add(mesh);

    // left cylinder
    const color = 0x8bfc74;
    geometry = new THREE.CylinderGeometry(30, 30, 20, 30);
    rot_z = Math.PI / 2;
    mesh = createPrimitive(x, y + 50, z, color, geometry, 0, 0, rot_z, null, null);
    moustache.add(mesh);

    // right cylinder
    mesh = createPrimitive(x + 250, y + 50, z, color, geometry, 0, 0, rot_z, null, null);
    moustache.add(mesh);

    moustache.rotateX(Math.PI / 10);
    moustache.rotateY(Math.PI / 8);
    moustache.rotateZ(Math.PI / 20);


    scene.add(moustache);
}

function createIceCream(x, y, z) {

    var iceCream = new THREE.Object3D();

    // cone
    var color = 0x8234f3;
    var geometry = new THREE.ConeGeometry(70, 140, 100);
    const rot_z = Math.PI;
    mesh = createPrimitive(x, y, z, color, geometry, 0, 0, rot_z, null, null);
    iceCream.add(mesh);

    // sphere
    geometry = new THREE.SphereGeometry(70, 20, 20, 2 * Math.PI, 2 * Math.PI, 2 * Math.PI, Math.PI / 2);
    var texture = new THREE.TextureLoader().load('textures/icecream_texture.jpg');
    mesh = createPrimitive(x, y + 70, z, null, geometry, 0, 0, 0, null, texture);
    iceCream.add(mesh);

    // torus
    color = 0x0076DC;
    geometry = new THREE.TorusGeometry(50, 20, 16, 100);
    const rot_x = Math.PI / 2;
    texture = new THREE.TextureLoader().load('textures/icecream_torus.jpg');
    mesh = createPrimitive(x, y, z, null, geometry, rot_x, 0, 0, null, texture);
    iceCream.add(mesh);

    iceCream.rotateX(Math.PI / 8);
    iceCream.rotateZ(-Math.PI / 8);

    scene.add(iceCream);
}

function createFlyingCat(x, y, z) {
    var flyingCat = new THREE.Object3D();

    // head
    var color = 0xfcc05e;
    var geometry = new THREE.BoxGeometry(100, 100, 30, 10, 10, 10);
    mesh = createPrimitive(x + 215, y - 10, z, color, geometry, 0, 0, 0, null, null);
    flyingCat.add(mesh);
    
    // tails
    color = 0xfffc53;
    geometry = new THREE.TubeGeometry(new CustomSinCurve(170, 7), 30, 15, 8, false);
    mesh = createPrimitive(x, y, z, color, geometry, 0, 0, 0, null, null);
    flyingCat.add(mesh);

    color = 0x71fcf3;
    mesh = createPrimitive(x, y - 30, z, color, geometry, 0, 0, 0, null, null);
    flyingCat.add(mesh);

    color = 0x71fc88;
    mesh = createPrimitive(x, y - 60, z, color, geometry, 0, 0, 0, null, null);
    flyingCat.add(mesh);

    // ears
    color = 0xfc6c52;
    geometry = new THREE.ConeGeometry(15, 30, 4);
    mesh = createPrimitive(x + 180, y + 58, z, color, geometry, 0, 0, 0, null, null);
    flyingCat.add(mesh);

    mesh = createPrimitive(x + 250, y + 58, z, color, geometry, 0, 0, 0, null, null);
    flyingCat.add(mesh);

    scene.add(flyingCat);

}

//  ---------------- Auxiliary functions and classes to generate geometries ---------------- //
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

class CustomSinCurve extends THREE.Curve {
    constructor(scale, y_scaling) {
      super();
      this.scale = scale;
      this.y_scaling = y_scaling
    }
    getPoint(t) {
        const tx = t;
        const ty = Math.sin(t * 7.5) / this.y_scaling;
        const tz = 0;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
}

class CustomCosCurve extends THREE.Curve {
    constructor(scale) {
        super();
        this.scale = scale;
    }

    getPoint(t) {
        const tx = t * 5;
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
    cameras.push(createOrthoCamera(0, 0, 600));
    cameras.push(createOrthoCamera(600, 0, 0));
    cameras.push(createOrthoCamera(0, 600, 0));
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);; // default
    camera.position.x = 0;
    camera.position.y = 800;
    camera.position.z = 800;
    camera.lookAt(scene.position);
    scene.add(camera)

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
    createTower(150, 0, 100);
    createPlanet(50, 150, -100);
    createAbstract(-20, 40, 0);
    createMoustache(-350, 300, 0);
    createIceCream(-200, - 300, -100);
    createFlyingCat(-50, -200, 150);
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
    head_group.position.add(obj1_velocity.normalize().multiplyScalar(delta * 150));

    // Update Rotation
    Object.keys(head_group_rotation_controller).forEach((key) => {
        if (head_group_rotation_controller[key].pressed) {
            head_group_rotation_controller[key].rotate(head_group, delta);
        }
    });

    Object.keys(body_group_rotation_controller).forEach((key) => {
        if (body_group_rotation_controller[key].pressed) {
            body_group_rotation_controller[key].rotate(body_group, delta);
        }
    });

    Object.keys(tail_group_rotation_controller).forEach((key) => {
        if (tail_group_rotation_controller[key].pressed) {
            tail_group_rotation_controller[key].rotate(tail_group, delta);
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
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if (pointIsWorld) {
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
