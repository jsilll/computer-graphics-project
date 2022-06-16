//  ---------------- Three.js Global Variables ---------------- //

const clock = new THREE.Clock();
var camera, scene, renderer;
var cameras = new Array();

//  ---------------- Object Variables ---------------- //

var podium;
var plane;

var origami1;
var origami2;
var origami3;

var spotlightobj1;
var spotlightobj2;
var spotlightobj3;

//  ---------------- Light Variables ---------------- //

const spotlights_height = 4;
const spotlights_intensity = 2;
const spotlights_color = 0x404040;
const spotlights_spread_angle = Math.PI / 12;

var spotlight1;
var spotlight2;
var spotlight3;

const directional_light_intensity = 2;
const directional_light_color = 0x404040;

var directional_light;

//  ---------------- Animation Variables ---------------- //

var animations_enabled = true;

//  ---------------- Controllers ---------------- //

const rotation_speed = THREE.Math.degToRad(60);

const origami1_controller = {
    81: { pressed: false, rotate: (obj, delta) => (obj.rotateY(-rotation_speed * delta)) },  // q
    87: { pressed: false, rotate: (obj, delta) => (obj.rotateY(rotation_speed * delta)) }, // w
}

const origami2_controller = {
    69: { pressed: false, rotate: (obj, delta) => (obj.rotateY(-rotation_speed * delta)) },  // e
    82: { pressed: false, rotate: (obj, delta) => (obj.rotateY(rotation_speed * delta)) }, // r
}

const origami3_controller = {
    84: { pressed: false, rotate: (obj, delta) => (obj.rotateY(-rotation_speed * delta)) },  // t
    89: { pressed: false, rotate: (obj, delta) => (obj.rotateY(rotation_speed * delta)) }, // y
}

//  ---------------- Animation Variables ---------------- //

older_time_offset = 0;

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
    // geometry.addAttribute(
    //     'normal',
    //     new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
    geometry.addAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

    geometry.computeVertexNormals();

    return geometry;

    // const geometry = new THREE.BufferGeometry();
    // geometry.addAttribute('position', new THREE.BufferAttribute(vertices,3) );


    //return geometry

}

function createFloor() {
    'use strict';
    const plane_size = 1000;
    const plane_segments = 10;
    const plane_color = 0x777777;

    var albedo = new THREE.TextureLoader().load('textures/floor_albedo.jpg');
    albedo.wrapS = albedo.wrapT = THREE.RepeatWrapping;
    albedo.repeat.set(256, 256);
    albedo.anisotropy = 16;
    albedo.encoding = THREE.sRGBEncoding;

    var aoMap = new THREE.TextureLoader().load('textures/floor_ao.jpg');
    aoMap.wrapS = aoMap.wrapT = THREE.RepeatWrapping;
    aoMap.repeat.set(256, 256);
    aoMap.anisotropy = 16;
    aoMap.encoding = THREE.sRGBEncoding;

    var specularMap = new THREE.TextureLoader().load('textures/floor_specular.jpg');
    specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
    specularMap.repeat.set(256, 256);
    specularMap.anisotropy = 16;
    specularMap.encoding = THREE.sRGBEncoding;

    var default_material = new THREE.MeshPhongMaterial({ map: albedo, aoMap: aoMap, specularMap: specularMap });
    var geometry = new THREE.PlaneGeometry(plane_size, plane_size, plane_segments, plane_segments);
    var mesh = new THREE.Mesh(geometry, default_material);
    mesh.userData = { PhongMaterial: default_material, LambertMaterial: new THREE.MeshLambertMaterial({ map: albedo, aoMap: aoMap, specularMap: specularMap }) }
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;

    scene.add(mesh);
    return mesh;
}

function createPodium(x, y, z) {
    'use strict';
    const podium_length = 10;
    const podium_height = 2;
    const podium_width = 10;

    // Geometry
    var geometry1 = new THREE.BoxGeometry(podium_length, podium_height, podium_width);
    var geometry2 = new THREE.BoxGeometry(podium_length, podium_height, podium_width / 2);

    // Material
    var albedo = new THREE.TextureLoader().load('textures/wood_albedo.jpg');
    albedo.anisotropy = 16;
    albedo.encoding = THREE.sRGBEncoding;
    var aoMap = new THREE.TextureLoader().load('textures/wood_ao.jpg');
    aoMap.anisotropy = 16;
    aoMap.encoding = THREE.sRGBEncoding;
    // TODO:
    const default_material = new THREE.MeshPhongMaterial({ map: albedo, aoMap: aoMap });
    default_material.displacementScale = 25;
    default_material.bumpScale = 10;

    // Mesh
    const mesh1 = new THREE.Mesh(geometry1, default_material);
    mesh1.position.set(x, y, z);
    const mesh2 = new THREE.Mesh(geometry2, default_material);
    mesh2.position.set(x, y + 2, z);

    mesh1.userData = { PhongMaterial: default_material, LambertMaterial: new THREE.MeshLambertMaterial({ map: albedo, aoMap: aoMap }) }
    mesh2.userData = { PhongMaterial: default_material, LambertMaterial: new THREE.MeshLambertMaterial({ map: albedo, aoMap: aoMap }) }

    mesh1.receiveShadow = true;
    mesh2.receiveShadow = true;

    const mesh = new THREE.Object3D();
    mesh.add(mesh1);
    mesh.add(mesh2)
    scene.add(mesh);
    return mesh;
}

function createLightsSupport(x, y, z) {
    // radiusTop : Float, 
    // radiusBottom: Float,
    // height : Float,
    // radialSegments : Integer

    const texture = new THREE.TextureLoader().load('textures/metal_texture.jpg');
    texture.anisotropy = 16;
    texture.encoding = THREE.sRGBEncoding;
    const default_material = new THREE.MeshPhongMaterial({ map: texture });

    const vertical_cylinder_geometry = new THREE.CylinderGeometry(0.05, 0.05, 8.5, 32);

    const vertical_cylinder1 = new THREE.Mesh(vertical_cylinder_geometry, default_material);
    vertical_cylinder1.userData = { PhongMaterial: default_material, LambertMaterial: new THREE.MeshLambertMaterial({ map: texture }) }
    const vertical_cylinder2 = new THREE.Mesh(vertical_cylinder_geometry, default_material);
    vertical_cylinder2.userData = { PhongMaterial: default_material, LambertMaterial: new THREE.MeshLambertMaterial({ map: texture }) }

    vertical_cylinder1.position.set(x, y, z);
    vertical_cylinder1.position.x -= 6;

    vertical_cylinder2.position.set(x, y, z);
    vertical_cylinder2.position.x += 6;

    const horizontal_cylinder_geometry = new THREE.CylinderGeometry(0.05, 0.05, 12.5, 32);
    const horizontal_cylinder = new THREE.Mesh(horizontal_cylinder_geometry, default_material);
    horizontal_cylinder.userData = { PhongMaterial: default_material, LambertMaterial: new THREE.MeshLambertMaterial({ map: texture }) }

    horizontal_cylinder.rotateZ(- Math.PI / 2);
    horizontal_cylinder.position.set(x, y, z);
    horizontal_cylinder.position.y += 4.25;



    scene.add(vertical_cylinder1);
    scene.add(vertical_cylinder2);
    scene.add(horizontal_cylinder);
    return vertical_cylinder1;
}

function createSpotLightObject(x, y, z) {
    const sphere_radius = 0.25;
    const sphere_geometry = new THREE.SphereGeometry(sphere_radius, 8, 8);
    const cone_bottom_radius = 0.5;
    const cone_top_radius = 0;
    const cone_height = 0.5;
    const cone_geometry = new THREE.CylinderGeometry(cone_top_radius, cone_bottom_radius, cone_height, 32);

    const material = new THREE.MeshPhongMaterial();
    const texture = new THREE.TextureLoader().load('textures/metal_texture.jpg');
    texture.anisotropy = 16;
    texture.encoding = THREE.sRGBEncoding;
    const default_material_cone = new THREE.MeshPhongMaterial({ map: texture });

    const sphere = new THREE.Mesh(sphere_geometry, material);
    sphere.position.set(0, - cone_height / 2, 0);
    const cone = new THREE.Mesh(cone_geometry, default_material_cone);
    sphere.userData = { PhongMaterial: new THREE.MeshPhongMaterial(), LambertMaterial: new THREE.MeshLambertMaterial() }
    cone.userData = { PhongMaterial: default_material_cone, LambertMaterial: new THREE.MeshLambertMaterial({ map: texture }) }

    const obj = new THREE.Object3D();
    obj.add(sphere);
    obj.add(cone);
    obj.position.set(x, y, z);

    scene.add(obj);
    return obj;
}

function createOrigami1(x, y, z) {
    'use strict';

    const vertices = [
        // front
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [0, 0.5, 0], norm: [0, 0, 1], uv: [0, 1], },
        { pos: [0.5, 0, 0], norm: [0, 0, 1], uv: [1, 1], },

        { pos: [0, 0.5, 0], norm: [0, 0, 1], uv: [0, 1], },
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [-0.5, 0, 0.2], norm: [0, 0, 1], uv: [0, 0], },

    ];

    const geometry = setGeometry(vertices);

    const texture = new THREE.TextureLoader().load('textures/origami_texture.jpg');
    const materialFront = new THREE.MeshPhongMaterial({ side: THREE.FrontSide, map: texture });
    const materialBack = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.BackSide });
    var materials = [materialFront, materialBack];

    const obj = new THREE.SceneUtils.createMultiMaterialObject(geometry, materials);

    obj.position.set(x, y, z);
    obj.rotateY(Math.PI);
    obj.rotateX(Math.PI / 7);
    obj.receiveShadow = true;  // Shadows will show up on this object.
    obj.castShadow = true;
    obj.userData = { PhongMaterial: new THREE.MeshPhongMaterial(), LambertMaterial: new THREE.MeshLambertMaterial() }

    scene.add(obj);

    return obj;

}
function createOrigami2(x, y, z) {
    'use strict';
    const colored_vertices = [
        // 1
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [0, 0.5, 0], norm: [0, 0, 1], uv: [0, 1], },
        { pos: [-1 / 6, 1 / 3, 0], norm: [0, 0, 1], uv: [0, 1 - 8 / 24], },

        // 2
        { pos: [0, 0.5, 0], norm: [0, 0, 1], uv: [0, 1], },
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [1 / 6, 1 / 3, 0], norm: [0, 0, 1], uv: [8 / 24, 1], },

        // 8
        { pos: [0, 5 / 24, -0.01], norm: [0, 0, 1], uv: [0, 0], },
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [(-5 * Math.sqrt(0.5)) / 24, 5 / 24, 0], norm: [0, 0, 1], uv: [0, 5 / 24], },

        // 7
        { pos: [0, 5 / 24, -0.01], norm: [0, 0, 1], uv: [1, 1], },
        { pos: [(5 * Math.sqrt(0.5)) / 24, 5 / 24, 0], norm: [0, 0, 1], uv: [1 - 5 / 24, 1], },
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 0], },

        // 6
        { pos: [0, 13 / 48, 0.01], norm: [0, 0, 1], uv: [1 - 5 / 12, 1], },
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [(5 * Math.sqrt(0.5)) / 24, 5 / 24, 0], norm: [0, 0, 1], uv: [1 - 5 / 24, 1], },

        // 5
        { pos: [0, 13 / 48, 0.01], norm: [0, 0, 1], uv: [0, 5 / 12], },
        { pos: [(-5 * Math.sqrt(0.5)) / 24, 5 / 24, 0], norm: [0, 0, 1], uv: [0, 5 / 24], },
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 0], },

    ];

    const uncolored_vertices = [
        // 3 - branco
        { pos: [0, 13 / 48, 0.01], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [-1 / 6, 1 / 3, 0], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 1], },

        // 4 -branco
        { pos: [0, 13 / 48, 0.01], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [0, -0.5, 0], norm: [0, 0, 1], uv: [1, 1], },
        { pos: [1 / 6, 1 / 3, 0], norm: [0, 0, 1], uv: [1, 0], },
    ];

    const colored_geometry = setGeometry(colored_vertices);
    const texture = new THREE.TextureLoader().load('textures/origami_texture.jpg');
    const materialFront = new THREE.MeshPhongMaterial({ side: THREE.FrontSide, map: texture });
    const materialBack = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.BackSide });
    const materials = [materialFront, materialBack];

    const origami2_colored = new THREE.SceneUtils.createMultiMaterialObject(colored_geometry, materials);

    const uncolored_geometry = setGeometry(uncolored_vertices);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const origami2_uncolored = new THREE.Mesh(uncolored_geometry, material);

    const obj = new THREE.Group();
    obj.add(origami2_colored);
    obj.add(origami2_uncolored);

    obj.position.set(x, y, z);
    obj.rotateX(-Math.PI / 7);
    obj.castShadow = true;
    obj.userData = { PhongMaterial: material, LambertMaterial: new THREE.MeshLambertMaterial() }

    obj.receiveShadow = true;  // Shadows will show up on this object.
    scene.add(obj);
    return obj;

}

function createOrigami3(x, y, z) {
    'use strict';
    // TODO: Model This
    const colored_vertices = [
        // 1 OK
        { pos: [-0.1, 0, 0.1], norm: [0, 0, 1], uv: [0, 1 - 1 / 3], },
        { pos: [-0.017, 1 / 6, 0], norm: [0, 0, 1], uv: [5 / 24, 1 - 5 / 24], },
        { pos: [-0.27, 1 / 6, 0], norm: [0, 0, 1], uv: [0, 1], },

        // 3 OK
        { pos: [0.03, 0.018, 0.101], norm: [0, 0, 1], uv: [0, 5 / 24], },
        { pos: [0.24, 0.15, 0], norm: [0, 0, 1], uv: [1 / 3, 1 / 4], },
        { pos: [-0.017, 1 / 6, 0], norm: [0, 0, 1], uv: [0, 5 / 12], },

        // 4 OK
        { pos: [0.03, 0.018, 0.101], norm: [0, 0, 1], uv: [0, 5 / 24], },
        { pos: [0.19, 0.04, 0.1], norm: [0, 0, 1], uv: [1 / 4, 1 / 8], },
        { pos: [0.24, 0.15, 0], norm: [0, 0, 1], uv: [1 / 3, 1 / 4], },

        // 7
        { pos: [0.03, 0.39, 0.03], norm: [0, 0, 1], uv: [1 - 5 / 24, 1 / 24], },
        { pos: [0.17, 0.4, 0], norm: [0, 0, 1], uv: [1, 0], },
        { pos: [0.06, 0.42, 0], norm: [0, 0, 1], uv: [1 - 5 / 24, 1 / 12], },

        // 1 atras OK
        { pos: [-0.1, 0, -0.1], norm: [0, 0, 1], uv: [1 / 3, 1], },
        { pos: [-0.27, 1 / 6, 0], norm: [0, 0, 1], uv: [0, 1], },
        { pos: [-0.017, 1 / 6, 0], norm: [0, 0, 1], uv: [5 / 24, 1 - 5 / 24], },

        // 3 atras OK
        { pos: [0.03, 0.018, -0.101], norm: [0, 0, 1], uv: [1 - 5 / 24, 1], },
        { pos: [-0.017, 1 / 6, 0], norm: [0, 0, 1], uv: [1 - 5 / 12, 1], },
        { pos: [0.24, 0.15, 0], norm: [0, 0, 1], uv: [3 / 4, 2 / 3], },

        // 4 atras OK
        { pos: [0.03, 0.018, -0.101], norm: [0, 0, 1], uv: [1 - 5 / 24, 1], },
        { pos: [0.24, 0.15, 0], norm: [0, 0, 1], uv: [3 / 4, 2 / 3], },
        { pos: [0.19, 0.04, -0.1], norm: [0, 0, 1], uv: [7 / 8, 3 / 4], },

        // 7 atras
        { pos: [0.03, 0.39, -0.03], norm: [0, 0, 1], uv: [1 - 5 / 24, 1 / 24], },
        { pos: [0.06, 0.42, 0], norm: [0, 0, 1], uv: [11 / 12, 5 / 24], },
        { pos: [0.17, 0.4, 0], norm: [0, 0, 1], uv: [1, 0], },

    ];

    const uncolored_vertices = [
        // 2 - branco
        { pos: [-0.1, 0, 0.1], norm: [0, 0, 1], uv: [0.5, 0.5], },
        { pos: [0.03, 0.018, 0.1], norm: [0, 0, 1], uv: [1, 1], },
        { pos: [-0.017, 1 / 6, 0.001], norm: [0, 0, 1], uv: [1, 0], },

        // 2 atras - branco
        { pos: [-0.1, 0, -0.1], norm: [0, 0, 1], uv: [0.5, 0.5], },
        { pos: [0.03, 0.018, -0.1], norm: [0, 0, 1], uv: [1, 1], },
        { pos: [-0.017, 1 / 6, 0.001], norm: [0, 0, 1], uv: [1, 0], },
    ];

    const doublesided_vertices = [
        // 5 OK
        { pos: [0.19, 0.04, 0.1], norm: [0, 0, 1], uv: [1 / 4, 1 / 8], },
        { pos: [0.24, 0.15, 0], norm: [0, 0, 1], uv: [7 / 24, 0] },
        { pos: [0.06, 0.42, 0], norm: [0, 0, 1], uv: [1 - 5 / 24, 0], },

        // 6 OK
        { pos: [0.19, 0.04, 0.1], norm: [0, 0, 1], uv: [1 / 4, 1 / 8], },
        { pos: [0.06, 0.42, 0], norm: [0, 0, 1], uv: [1 - 5 / 24, 0], },
        { pos: [0.03, 0.39, 0.03], norm: [0, 0, 1], uv: [1 - 5 / 24, 1 / 24], },

        // 5 atras OK
        { pos: [0.19, 0.04, -0.1], norm: [0, 0, 1], uv: [7 / 8, 3 / 4], },
        { pos: [0.24, 0.15, 0], norm: [0, 0, 1], uv: [1, 1 - 7 / 24], },
        { pos: [0.06, 0.42, 0], norm: [0, 0, 1], uv: [1, 5 / 24], },

        // 6 atras OK
        { pos: [0.19, 0.04, -0.1], norm: [0, 0, 1], uv: [7 / 8, 3 / 4], },
        { pos: [0.06, 0.42, 0], norm: [0, 0, 1], uv: [1, 5 / 24], },
        { pos: [0.03, 0.39, -0.03], norm: [0, 0, 1], uv: [23 / 24, 5 / 24], },
    ];

    const colored_geometry = setGeometry(colored_vertices);
    const texture = new THREE.TextureLoader().load('textures/origami_texture.jpg');
    const materialFront = new THREE.MeshPhongMaterial({ side: THREE.FrontSide, map: texture });
    const materialBack = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.BackSide });
    const materials = [materialFront, materialBack];
    const origami3_colored = new THREE.SceneUtils.createMultiMaterialObject(colored_geometry, materials);


    const uncolored_geometry = setGeometry(uncolored_vertices);
    const materialWhite = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const origami3_uncolored = new THREE.Mesh(uncolored_geometry, materialWhite);

    const doublesided_geometry = setGeometry(doublesided_vertices);
    const materialDouble = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: texture });
    const origami3_doublesided = new THREE.Mesh(doublesided_geometry, materialDouble);


    const obj = new THREE.Group();
    obj.add(origami3_colored);
    obj.add(origami3_uncolored);
    obj.add(origami3_doublesided);


    obj.position.set(x, y, z);
    obj.castShadow = true;
    obj.receiveShadow = true;  // Shadows will show up on this object.
    scene.add(obj);
    return obj;

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

    // Ambient Light
    scene.add(new THREE.AmbientLight(0x404040, 3));
}

//  ---------------- Three.js Functions ---------------- //

function init() {
    'use strict';
    // Setting up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
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
    // scene.add(new THREE.AxesHelper(50));
    // Creating objects and setting assigning global variables
    plane = createFloor();
    podium = createPodium(0, 0, 0);
    origami1 = createOrigami1(-3, 2, 3.5)
    origami2 = createOrigami2(0, 2, 3.5);
    origami3 = createOrigami3(3, 2, 3.5);
    createLightsSupport(0, 0, 3.5);
    spotlightobj1 = createSpotLightObject(-3, spotlights_height, 3.5);
    spotlightobj2 = createSpotLightObject(0, spotlights_height, 3.5);
    spotlightobj3 = createSpotLightObject(3, spotlights_height, 3.5);

}

function setupCameras() {
    'use strict';
    cameras.push(createPerspectiveCamera(0, 3, 13, scene.position));
    // TODO: maybe mudar os tamanhos de todos os objetos para se ver alguma coisa com a camera ortogonal
    cameras.push(createOrthoCamera(0, 3, 15, scene.position));
    camera = cameras[0];
}

// ---------------- Updating Scene ---------------- //

function updatePositions() {
    'use strict';
    if (animations_enabled) {
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
        origami1.position.y = origami1.position.y + Math.sin(time + older_time_offset) * 0.0025;
        origami2.position.y = origami2.position.y + Math.sin(time + older_time_offset) * 0.0025;
        origami3.position.y = origami3.position.y + Math.sin(time + older_time_offset) * 0.0025;
    }
}

function resetPositions() {
    origami1.position.set(-2, 2, 2);
    origami1.rotateY(0);
    origami2.position.set(0, 2, 2);
    origami2.rotateY(0);
    origami3.position.set(2, 2, 2);
    origami3.rotateY(0);
}

function updateDisplayType() {
    'use strict';
    scene.traverse((node) => {
        if (node instanceof THREE.Mesh) { node.material.wireframe = !node.material.wireframe; }
    });
}

function toggleAllMeshesMaterial() {
    const objects = [origami1, origami2, origami3, podium, plane, spotlightobj1, spotlightobj2, spotlightobj3];

    function toggleObject3DMaterial(object3D) {
        object3D.children.forEach((obj) => {
            if (obj instanceof THREE.Mesh) {
                if (obj.material instanceof THREE.MeshPhongMaterial) {
                    obj.material = obj.userData.LambertMaterial;
                }
                else {
                    obj.material = obj.userData.PhongMaterial;
                }
            } else {
                toggleObject3DMaterial(obj);
            }
        });
    }

    objects.forEach((obj) => {
        if (obj instanceof THREE.Mesh) {
            if (obj.material instanceof THREE.MeshPhongMaterial) {
                obj.material = obj.userData.LambertMaterial;
            }
            else {
                obj.material = obj.userData.PhongMaterial;
            }
        } else {
            toggleObject3DMaterial(obj);
        }
    });
}

// TODO: É possivel deslocar os objetos de sitio se carregarmos no pause em comprimentos de onda certos
function toggleAnimations() {
    if (animations_enabled) {
        clock.stop(); older_time_offset += clock.getElapsedTime() % (Math.PI * 2);
    } else {
        clock.start();
    }
    animations_enabled = !animations_enabled;
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

        // TODO: Toggle Shading Type
        case 65: // A
            toggleAllMeshesMaterial();
            break;
        // TODO: Toggle Illumnation Calculations & Animations
        case 83: // S
            toggleAnimations();
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

        // Reset Scene
        case 79: // O
            resetPositions();
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