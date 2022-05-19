//  ---------------- Three.js Global Variables ---------------- //
const clock = new THREE.Clock();
var camera, scene, renderer;
var geometry, mesh;

// 0 - front, 1 - top, 2 - right
var cameras = [];

//  ---------------- Controllers ---------------- //
var target_object, sub_target_object, mesh1, mesh2, mesh3

const position_controller = {
    39: { pressed: false, vec: new THREE.Vector3(1, 0, 0) },  // right
    37: { pressed: false, vec: new THREE.Vector3(-1, 0, 0) }, // left
    38: { pressed: false, vec: new THREE.Vector3(0, 1, 0) },  // up
    40: { pressed: false, vec: new THREE.Vector3(0, -1, 0) }, // down
    67: { pressed: false, vec: new THREE.Vector3(0, 0, 1) },  // 'c'
    68: { pressed: false, vec: new THREE.Vector3(0, 0, -1) }, // 'd'
}

const target_object_controller = {
    81: { pressed: false, rotate: (obj, delta) => obj.rotateX(delta * 3) },  // q
    87: { pressed: false, rotate: (obj, delta) => obj.rotateX(-delta * 3) }, // w
}

const mesh2_controller = {
    65: { pressed: false, rotate: (obj, delta) => rotateAroundPoint(obj, mesh1.position, new THREE.Vector3(0, 1, 0), delta * 3, false) },  // a
    83: { pressed: false, rotate: (obj, delta) => rotateAroundPoint(obj, mesh1.position, new THREE.Vector3(0, 1, 0), -delta * 3, false) }, // s
}

const mesh3_controller = {
    90: { pressed: false, rotate: (obj, delta) => rotateAroundPoint(obj, mesh1.position, new THREE.Vector3(1, 1, 1).normalize(), delta * 3, false) },   // z 
    88: { pressed: false, rotate: (obj, delta) => rotateAroundPoint(obj, mesh1.position, new THREE.Vector3(1, 1, 1).normalize(), -delta * 3, false) },  // x
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

function createTower(x, y, z) {
    'use strict';

    var tower = new THREE.Object3D();

    // box
    mesh = createPrimitive(x, y, z, 0xf94848, new THREE.BoxGeometry(70, 70, 70, 10), 0, 0, 0, null, null);
    tower.add(mesh);

    // plane
    mesh = createPrimitive(x, y + 60, z, 0xf97d48, new THREE.CircleGeometry(45, 10), Math.PI / 2, 0, 0, THREE.DoubleSide)
    tower.add(mesh);

    // // cone
    mesh = createPrimitive(x, y + 115, z, 0x8bfc74, new THREE.ConeGeometry(45, 70, 12), 0, 0, 0, null, null);
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
    mesh = createPrimitive(x, y, z, null, new THREE.SphereGeometry(60, 40, 10), 0, 0, 0, null, new THREE.TextureLoader().load('textures/planet_texture.jpg'));
    planet.add(mesh);

    // ring geometry
    mesh = createPrimitive(x, y, z, 0x7a33ff, new THREE.RingGeometry(100, 110, 50), Math.PI / 2, 0, 0, THREE.DoubleSide);
    planet.add(mesh);

    // small sphere
    mesh = createPrimitive(x + 105, y + 20, z, 0xec54ba, new THREE.SphereGeometry(10, 10, 10), 0, 0, 0, null, null);
    planet.add(mesh);

    scene.add(planet);

    planet.rotateX(Math.PI / 7);

    planet.position.x = x;
    planet.position.y = y;
    planet.position.z = z;
}

function createAbstract(x, y, z) {
    class CustomCubicCurve extends THREE.Curve {
        constructor(scale) {
            super();
            this.scale = scale;
        }
        getPoint(t) {
            const tx = t;
            const ty = Math.sin(t * 7.5) / 4;
            const tz = 0;
            return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    const path = new CustomCubicCurve(150);
    const tubularSegments = 20;                                         // ui: tubularSegments
    const radius = 5;                                                   // ui: radius
    const radialSegments = 8;                                           // ui: radialSegments
    const closed = false;                                               // ui: closed
    const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed);

    target_object = new THREE.Object3D();
    target_object.position.x = x;
    target_object.position.y = y;
    target_object.position.z = z;

    mesh1 = createPrimitive(x, y, z, 0x47d6f8, new THREE.SphereGeometry(70, 20, 5, Math.PI / 10, Math.PI * 3 / 2, Math.PI / 10, Math.PI / 2), 0, 0, 0, THREE.DoubleSide, new THREE.TextureLoader().load('textures/abstract_texture.jpg'));
    mesh2 = createPrimitive(x, y - 40, z, 0x00ff00, geometry, Math.PI, 0, Math.PI / 2, null, new THREE.TextureLoader().load('textures/abstract_spiral.jpg'));
    mesh3 = createPrimitive(x + 40, y - 190, z, 0xf9c348, new THREE.SphereGeometry(10, 7, 7), 0, 0, 0, null, new THREE.TextureLoader().load('textures/abstract_ball.jpg'));

    sub_target_object = new THREE.Object3D();
    sub_target_object.add(mesh2);
    sub_target_object.add(mesh3);

    target_object.add(mesh1);
    target_object.add(sub_target_object);

    target_object.rotateY(Math.PI / 3.5);
    target_object.rotateX(-Math.PI / 8);
    scene.add(target_object);
}

function createMoustache(x, y, z) {

    var moustache = new THREE.Object3D();

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

    // tube
    mesh = createPrimitive(x, y, z, null, new THREE.TubeGeometry(new CustomCosCurve(50), 20, 10, 8, false), 0, 0, 0, null, new THREE.TextureLoader().load('textures/moustache_texture.jpg'));
    moustache.add(mesh);

    // sphere
    mesh = createPrimitive(x + 125, y - 45, z, null, new THREE.SphereGeometry(20, 32, 16), 0, 0, 0, null, new THREE.TextureLoader().load('textures/moustache_ball.jpg'));
    moustache.add(mesh);

    // left cylinder
    mesh = createPrimitive(x, y + 50, z, 0x8bfc74, new THREE.CylinderGeometry(30, 30, 20, 30), 0, 0, Math.PI / 2, null, null);
    moustache.add(mesh);

    // right cylinder
    mesh = createPrimitive(x + 250, y + 50, z, 0x8bfc74, new THREE.CylinderGeometry(30, 30, 20, 30), 0, 0, Math.PI / 2, null, null);
    moustache.add(mesh);

    moustache.rotateX(Math.PI / 10);
    moustache.rotateY(Math.PI / 8);
    moustache.rotateZ(Math.PI / 20);


    scene.add(moustache);
}

function createIceCream(x, y, z) {

    var iceCream = new THREE.Object3D();

    // cone
    mesh = createPrimitive(x, y, z, 0x8234f3, new THREE.ConeGeometry(70, 140, 100), 0, 0, Math.PI, null, null);
    iceCream.add(mesh);

    // sphere
    mesh = createPrimitive(x, y + 70, z, null, new THREE.SphereGeometry(70, 20, 20, 2 * Math.PI, 2 * Math.PI, 2 * Math.PI, Math.PI / 2), 0, 0, 0, null, new THREE.TextureLoader().load('textures/icecream_texture.jpg'));
    iceCream.add(mesh);

    // torus
    mesh = createPrimitive(x, y, z, 0x0076DC, new THREE.TorusGeometry(50, 20, 16, 100), Math.PI / 2, 0, 0, null, new THREE.TextureLoader().load('textures/icecream_torus.jpg'));
    iceCream.add(mesh);

    iceCream.rotateX(Math.PI / 8);
    iceCream.rotateZ(-Math.PI / 8);

    scene.add(iceCream);
}

function createFlyingCat(x, y, z) {
    var flyingCat = new THREE.Object3D();

    class CustomCubicCurve extends THREE.Curve {
        constructor(scale) {
            super();
            this.scale = scale;
        }
        getPoint(t) {
            const tx = t;
            const ty = Math.sin(t * 7.5) / 7;
            const tz = 0;
            return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    const path = new CustomCubicCurve(170);
    const tubularSegments = 30;  // ui: tubularSegments
    const radius = 15;  // ui: radius
    const radialSegments = 8;  // ui: radialSegments
    const closed = false;  // ui: closed
    const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed);

    mesh = createPrimitive(x + 215, y - 10, z, 0xfcc05e, new THREE.BoxGeometry(100, 100, 30, 10, 10, 10), 0, 0, 0, null, null);
    flyingCat.add(mesh);

    mesh = createPrimitive(x, y, z, 0xfffc53, new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed), 0, 0, 0, null, null);
    flyingCat.add(mesh);

    mesh = createPrimitive(x, y - 30, z, 0x71fcf3, new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed), 0, 0, 0, null, null);
    flyingCat.add(mesh);

    mesh = createPrimitive(x, y - 60, z, 0x71fc88, new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed), 0, 0, 0, null, null);
    flyingCat.add(mesh);

    mesh = createPrimitive(x + 180, y + 58, z, 0xfc6c52, new THREE.ConeGeometry(15, 30, 4), 0, 0, 0, null, null);
    flyingCat.add(mesh);

    mesh = createPrimitive(x + 250, y + 58, z, 0xfc6c52, new THREE.ConeGeometry(15, 30, 4), 0, 0, 0, null, null);
    flyingCat.add(mesh);

    scene.add(flyingCat);

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
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);; // default
    camera.position.x = 0;
    camera.position.y = 600;
    camera.position.z = 600;
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
    Object.keys(position_controller).forEach((key) => {
        if (position_controller[key].pressed) {
            obj1_velocity.add(position_controller[key].vec);
        }
    });
    target_object.position.add(obj1_velocity.normalize().multiplyScalar(delta * 80));

    // Update Rotation
    Object.keys(target_object_controller).forEach((key) => {
        if (target_object_controller[key].pressed) {
            target_object_controller[key].rotate(target_object, delta);
        }
    });

    Object.keys(mesh2_controller).forEach((key) => {
        if (mesh2_controller[key].pressed) {
            mesh2_controller[key].rotate(sub_target_object, delta);
        }
    });

    Object.keys(mesh3_controller).forEach((key) => {
        if (mesh3_controller[key].pressed) {
            mesh3_controller[key].rotate(mesh3, delta);
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
    if (position_controller[e.keyCode]) {
        position_controller[e.keyCode].pressed = true;
        return;
    }

    // Rotate target_object 
    if (target_object_controller[e.keyCode]) {
        target_object_controller[e.keyCode].pressed = true;
        return;
    }

    // Rotate Mesh2 
    if (mesh2_controller[e.keyCode]) {
        mesh2_controller[e.keyCode].pressed = true;
        return;
    }

    // Rotate Mesh3 
    if (mesh3_controller[e.keyCode]) {
        mesh3_controller[e.keyCode].pressed = true;
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

    if (target_object_controller[e.keyCode]) {
        target_object_controller[e.keyCode].pressed = false;
    }

    if (mesh2_controller[e.keyCode]) {
        mesh2_controller[e.keyCode].pressed = false;
    }

    if (mesh3_controller[e.keyCode]) {
        mesh3_controller[e.keyCode].pressed = false;
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
