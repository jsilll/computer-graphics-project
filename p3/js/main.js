//  ---------------- Three.js Global Variables ---------------- //

const clock = new THREE.Clock();
var camera, scene, renderer;
var cameras = new Array();

//  ---------------- Info Message ---------------- //

const info_msg = document.getElementById("info");

function updateInfoMsg(msg) {
    info_msg.innerText = msg;
}

//  ---------------- Object Variables ---------------- //

var origami1;
var origami2;
var origami3;

//  ---------------- Light Variables ---------------- //

const spotlights_color = 0x404040;
const spotlights_intensity = 4;
const spotlights_spread_angle = Math.PI / 12;
const spotlights_height = 4;
var spotlight1;
var spotlight2;
var spotlight3;

const directional_light_color = 0x404040;
const directional_light_intensity = 2;
var directional_light;

//  ---------------- Animation Variables ---------------- //

animation_enabled = true;

//  ---------------- Controllers ---------------- //

const rotation_speed = THREE.Math.degToRad(60);

const origami1_controller = {
    81: { pressed: false, rotate: (obj, delta) => (obj.rotateY(rotation_speed * delta)) },  // q
    87: { pressed: false, rotate: (obj, delta) => (obj.rotateY(-rotation_speed * delta)) }, // w
}

const origami2_controller = {
    69: { pressed: false, rotate: (obj, delta) => (obj.rotateY(rotation_speed * delta)) },  // e
    82: { pressed: false, rotate: (obj, delta) => (obj.rotateY(-rotation_speed * delta)) }, // r
}

const origami3_controller = {
    84: { pressed: false, rotate: (obj, delta) => (obj.rotateY(rotation_speed * delta)) },  // t
    89: { pressed: false, rotate: (obj, delta) => (obj.rotateY(-rotation_speed * delta)) }, // y
}

//  ---------------- Object creation ------------------- //

function setGeometry(vertices) {
    const positions = [];
    const normals = [];
    const uvs = [];
    for (const vertex of vertices) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    }

    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    geometry.addAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
    geometry.addAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometry.addAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

    return geometry;

}

function createPlane() {
    'use strict';
    const plane_size = 1000;
    const plane_segments = 10;
    const plane_color = 0x777777;
    var material = new THREE.MeshPhongMaterial({ color: plane_color });
    var geometry = new THREE.PlaneGeometry(plane_size, plane_size, plane_segments, plane_segments);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
}

function createPodium(x, y, z) {
    'use strict';
    const podium_length = 5;
    const podium_height = 2;
    const podium_width = 5;

    // Geometry
    var geometry1 = new THREE.BoxGeometry(podium_length, podium_height, podium_width);
    var geometry2 = new THREE.BoxGeometry(podium_length, podium_height, podium_width / 2);

    // Material
    const material = new THREE.MeshPhongMaterial();
    // material.map = new THREE.TextureLoader().load('textures/mars_texture.jpg');
    // material.bumpMap = new THREE.TextureLoader().load('textures/mars_bump.png');
    // material.displacementMap = new THREE.TextureLoader().load('textures/mars_displacement.jpg');
    // TODO:
    material.displacementScale = 25;
    material.bumpScale = 10;

    // Mesh
    const mesh1 = new THREE.Mesh(geometry1, material);
    mesh1.position.set(x, y, z);
    const mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.set(x, y + 2, z);

    mesh1.receiveShadow = true;
    mesh2.receiveShadow = true;
    scene.add(mesh1);
    scene.add(mesh2);
}

function createSpotLightObject(x, y, z) {
    const sphere_radius = 0.25;
    const sphere_geometry = new THREE.SphereGeometry(sphere_radius, 8, 8);
    const cone_bottom_radius = 0.5;
    const cone_top_radius = 0;
    const cone_height = 0.5;
    const cone_geometry = new THREE.CylinderGeometry(cone_top_radius, cone_bottom_radius, cone_height, 32);

    const material = new THREE.MeshPhongMaterial();
    const sphere = new THREE.Mesh(sphere_geometry, material);
    sphere.position.set(0, cone_height / 2, 0);
    const cone = new THREE.Mesh(cone_geometry, material);

    const obj = new THREE.Object3D();
    obj.add(sphere);
    obj.add(cone);
    obj.position.set(x, y, z);
    scene.add(obj);
}

function createOrigami1(x, y, z) {
    'use strict';

    const vertices = [
        // front
        { pos: [0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0, 0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.5, 0,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        { pos: [0,  0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [-0.5, 0,  0.2], norm: [ 0,  0,  1], uv: [1, 0], },

    ];

    const geometry = setGeometry(vertices);
    
    // TODO: posso usar double side ou cada lado é uma outra face? e se sim como as ponho de "costas" uma para a outra
    const texture = new THREE.TextureLoader().load('textures/origami_texture.jpg');
    const material = new THREE.MeshPhongMaterial({side : THREE.DoubleSide, map: texture});

        
    origami1 = new THREE.Mesh(geometry, material);
    origami1.position.set(x, y, z);
    origami1.rotateX(Math.PI / 4);
    origami1.castShadow = true;
    scene.add(origami1);
    
    // TODO: Model This
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
}
function createOrigami2(x, y, z) {
    'use strict';
    // TODO: Model This
    const vertices = [
        // 1
        { pos: [0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0, 0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [-1/6, 1/3,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 2
        { pos: [0,  0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [1/6, 1/3,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 3
        { pos: [0, 13/48,  0.01], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [-1/6, 1/3,  0], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [ 0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },

        // 4
        { pos: [0, 13/48,  0.01], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [ 0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [1/6, 1/3,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 7 confirmar
        { pos: [0, 5/24,  -0.01], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [(-5 * Math.sqrt(0.5)) /24, 5/24,  0], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [ 0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },

        // 8 confirmar
        { pos: [0, 5/24,  -0.01], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [ 0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [(5 * Math.sqrt(0.5)) /24, 5/24,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 5
        { pos: [0, 13/48,  0.01], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [ 0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [(5 * Math.sqrt(0.5)) /24, 5/24,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 6
        { pos: [0, 13/48,  0.01], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [(-5 * Math.sqrt(0.5)) /24, 5/24,  0], norm: [ 0,  0,  1], uv: [1, 0], },
        { pos: [ 0, -0.5,  0], norm: [ 0,  0,  1], uv: [1,1], },

    ];

    const geometry = setGeometry(vertices);
    
    // TODO: posso usar double side ou cada lado é uma outra face? e se sim como as ponho de "costas" uma para a outra
    const texture = new THREE.TextureLoader().load('textures/origami_texture.jpg');
    const material = new THREE.MeshPhongMaterial({side : THREE.DoubleSide, map: texture});
    origami2 = new THREE.Mesh(geometry, material);
    origami2.position.set(x, y, z);
    origami2.castShadow = true;
    scene.add(origami2);
}
function createOrigami3(x, y, z) {
    'use strict';
    // TODO: Model This
    const vertices = [
        // 1
        { pos: [0, 0,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 1/12, 1/6,  0], norm: [ 0,  0,  1], uv: [0,1], },
        { pos: [-1/6, 1/6,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 2
        { pos: [0,  0,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0.13, 0.018,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [1/12, 1/6,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 3
        { pos: [0.13,  0.018,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0.24, 1/6,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [1/12, 1/6,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 4
        { pos: [ 0.13, 0.018,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.29,  0.04,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.24, 1/6,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 5
        { pos: [0.29,  0.04,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0.34, 0.15,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.2, 0.35,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 6
        { pos: [0.29,  0.04,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.2, 0.35,  0], norm: [ 0,  0,  1], uv: [1, 1], },
        { pos: [ 0.13, 0.39,  0], norm: [ 0,  0,  1], uv: [1,0], },

        // 7
        { pos: [ 0.13, 0.39,  0], norm: [ 0,  0,  1], uv: [1,0], },
        { pos: [0.27,  0.31,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.16, 0.42,  0], norm: [ 0,  0,  1], uv: [1, 1], },

        // 8
        { pos: [0.29,  0.04,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.34, 0.15,  0], norm: [ 0,  0,  1], uv: [1, 1], },
        { pos: [ 0.24, 1/6,  0], norm: [ 0,  0,  1], uv: [1,0], },

        // 1 atras
        { pos: [0, 0,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 1/12, 1/6,  0], norm: [ 0,  0,  1], uv: [0,1], },
        { pos: [-1/6, 1/6,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 2 atras
        { pos: [0,  0,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0.13, 0.018,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [1/12, 1/6,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 3 atras
        { pos: [0.13,  0.018,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0.24, 1/6,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [1/12, 1/6,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 4 atras
        { pos: [ 0.13, 0.018,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.29,  0.04,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.24, 1/6,  0], norm: [ 0,  0,  1], uv: [1, 0], },

        // 5 atras
        { pos: [0.29,  0.04,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [ 0.34, 0.15,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.16, 0.42,  -0.01], norm: [ 0,  0,  1], uv: [1, 0], },

        // 6 atras
        { pos: [0.29,  0.04,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.16, 0.42,  0], norm: [ 0,  0,  1], uv: [1, 1], },
        { pos: [ 0.13, 0.39,  -0.05], norm: [ 0,  0,  1], uv: [1,0], },

        // 7 atras
        { pos: [ 0.13, 0.39,  -0.05], norm: [ 0,  0,  1], uv: [1,0], },
        { pos: [0.27,  0.31,  0], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.16, 0.42,  0], norm: [ 0,  0,  1], uv: [1, 1], },

        // 8 atras
        { pos: [0.29,  0.04,  -0.1], norm: [ 0,  0,  1], uv: [1,1], },
        { pos: [0.34, 0.15,  0], norm: [ 0,  0,  1], uv: [1, 1], },
        { pos: [ 0.24, 1/6,  0], norm: [ 0,  0,  1], uv: [1,0], },


    ];

    const geometry = setGeometry(vertices);
    
    // TODO: posso usar double side ou cada lado é uma outra face? e se sim como as ponho de "costas" uma para a outra
    const texture = new THREE.TextureLoader().load('textures/origami_texture.jpg');
    const material = new THREE.MeshPhongMaterial({side : THREE.DoubleSide, map: texture});
    origami3 = new THREE.Mesh(geometry, material);
    origami3.position.set(x, y, z);
    origami3.castShadow = true;
    scene.add(origami3);
}

//  ---------------- Lights Creation ---------------- //

function setupLights() {
    'use strict';
    // Directional Light
    directional_light = new THREE.DirectionalLight(directional_light_color, directional_light_intensity);
    directional_light.position.set(10, 10, 10);
    scene.add(directional_light);

    // SpotLight 1
    spotlight1 = new THREE.SpotLight(spotlights_color, spotlights_intensity);
    spotlight1.angle = spotlights_spread_angle;
    spotlight1.position.set(origami1.position.x, spotlights_height, origami1.position.z);
    spotlight1.castShadow = true;
    spotlight1.target = origami1;
    scene.add(spotlight1);

    // SpotLight 2
    spotlight2 = new THREE.SpotLight(spotlights_color, spotlights_intensity);
    spotlight2.angle = spotlights_spread_angle;
    spotlight2.position.set(origami2.position.x, spotlights_height, origami2.position.z);
    spotlight2.castShadow = true;
    spotlight2.target = origami2;
    scene.add(spotlight2);

    // SpotLight 3
    spotlight3 = new THREE.SpotLight(spotlights_color, spotlights_intensity);
    spotlight3.angle = spotlights_spread_angle;
    spotlight3.position.set(origami3.position.x, spotlights_height, origami3.position.z);
    spotlight3.castShadow = true;
    spotlight3.target = origami3;
    scene.add(spotlight3);
}

//  ---------------- Three.js Functions ---------------- //

function init() {
    'use strict';
    // Setting up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Objects, Lights and Cameras
    setupObjects();
    setupCameras();
    setupLights();

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

function setupObjects() {
    'use strict';
    scene = new THREE.Scene();
    // Adding Axis to the Scene
    scene.add(new THREE.AxisHelper(50));
    // Creating objects
    createPlane();
    createPodium(0, 0, 0);
    createOrigami1(-2, 2, 2);
    createOrigami2(0, 2, 2);
    createOrigami3(2, 2, 2);
    createSpotLightObject(-2, spotlights_height, 2);
    createSpotLightObject(0, spotlights_height, 2);
    createSpotLightObject(2, spotlights_height, 2);
}

function setupCameras() {
    'use strict';
    cameras.push(createPerspectiveCamera(1, 3.5, 5, scene.position));
    cameras.push(createOrthoCamera(0, 3.5, 15, scene.position));
    camera = cameras[0];
}

// ---------------- Updating Scene ---------------- //

function updatePositions() {
    'use strict';
    if (animation_enabled) {
        const delta = clock.getDelta();
        Object.keys(origami1_controller).forEach((key) => {
            if (origami1_controller[key].pressed) {
                origami1_controller[key].rotate(origami1, delta);
            }
        });
        Object.keys(origami2_controller).forEach((key) => {
            if (origami2_controller[key].pressed) {
                origami2_controller[key].rotate(origami2, delta);
            }
        });
        Object.keys(origami3_controller).forEach((key) => {
            if (origami3_controller[key].pressed) {
                origami3_controller[key].rotate(origami3, delta);
            }
        });

        const time = clock.getElapsedTime();
        origami1.position.y = origami1.position.y + Math.sin(time) * 0.0025;
        origami2.position.y = origami2.position.y + Math.sin(time) * 0.0025;
        origami3.position.y = origami3.position.y + Math.sin(time) * 0.0025;
    }
}

function updateDisplayType() {
    'use strict';
    scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = !node.material.wireframe;
        }
    });
}

function updateCameras() {
    'use strict';
    cameras.forEach((c) => {
        if (c.isPerspectiveCamera || c instanceof THREE.PerspectiveCamera) {
            c.aspect = window.innerWidth / window.innerHeight;
        } else if (c.isOrthographicCamera || c instanceof THREE.OrthographicCamera) {
            c.left = window.innerWidth / - 2
            c.right = window.innerWidth / 2
            c.top = window.innerHeight / 2
            c.bottom = window.innerHeight / - 2
        }
        c.updateProjectionMatrix();
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ---------------- Camera Creation ---------------- //

function createOrthoCamera(x, y, z, target) {
    'use strict';
    var cam = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000);
    cam.position.set(x, y, z);
    cam.lookAt(target);
    scene.add(cam);
    return cam;
}

function createPerspectiveCamera(x, y, z, lookAt) {
    'use strict';
    var cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    cam.position.set(x, y, z);
    cam.lookAt(lookAt);
    scene.add(cam)
    return cam;
}

// ---------------- Event Listeners ---------------- //

function onResize() {
    'use strict';
    updateCameras();
}

function onKeyDown(e) {
    'use strict';
    if (origami1_controller[e.keyCode]) {
        origami1_controller[e.keyCode].pressed = true;
        return;
    }

    if (origami2_controller[e.keyCode]) {
        origami2_controller[e.keyCode].pressed = true;
        return;
    }

    if (origami3_controller[e.keyCode]) {
        origami3_controller[e.keyCode].pressed = true;
        return;
    }

    // Toggles
    switch (e.keyCode) {

        // TODO: oggle Shading Type
        case 65: // A
            break;
        // TODO: Toggle Illumnation Calculations & Animations
        case 83: // S
            animation_enabled = !animation_enabled;
            if (animation_enabled) { updateInfoMsg(""); } else { updateInfoMsg("Paused"); }
            break;
        // Toggle Directional Light
        case 68: // D
            directional_light.intensity = directional_light.intensity == 0 ? directional_light_intensity : 0;
            break;

        // SpotLights Toggle
        case 90: // Z
            spotlight1.intensity = spotlight1.intensity == 0 ? spotlights_intensity : 0;
            break;
        case 88: // X
            spotlight2.intensity = spotlight2.intensity == 0 ? spotlights_intensity : 0;
            break;
        case 67: // C
            spotlight3.intensity = spotlight3.intensity == 0 ? spotlights_intensity : 0;
            break;

        // Cameras Toggle
        case 49:
            camera = cameras[0];
            break;
        case 50:
            camera = cameras[1];
            break;

        // Toggle Wireframe / Solid Mode 
        case 52: // '4'
            updateDisplayType();
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    if (origami1_controller[e.keyCode]) {
        origami1_controller[e.keyCode].pressed = false;
        return;
    }

    if (origami2_controller[e.keyCode]) {
        origami2_controller[e.keyCode].pressed = false;
        return;
    }

    if (origami3_controller[e.keyCode]) {
        origami3_controller[e.keyCode].pressed = false;
        return;
    }
}