const texture = new THREE.TextureLoader().load('textures/origami_texture.jpg');

//  ---------------- Materials ---------------- //
/* Phong Materials */
const phongMaterialFront = new THREE.MeshPhongMaterial({side : THREE.FrontSide, map: texture});
const phongMaterialBack = new THREE.MeshPhongMaterial({color : 0xffffff, side : THREE.BackSide});

const phongMaterialDoubleWhite = new THREE.MeshPhongMaterial({color : 0xffffff, side : THREE.DoubleSide});
const phongMaterialDoubleTexture = new THREE.MeshPhongMaterial({side : THREE.DoubleSide, map: texture});

/* Lambert Materials */
const lambertMaterialFront = new THREE.MeshLambertMaterial({side : THREE.FrontSide, map: texture});
const lambertMaterialBack = new THREE.MeshLambertMaterial({color : 0xffffff, side : THREE.BackSide});
const lambertMaterials = [lambertMaterialFront, lambertMaterialBack];

const lambertMaterialDoubleWhite = new THREE.MeshLambertMaterial({color : 0xffffff, side : THREE.DoubleSide});
const lambertMaterialDoubleTexture = new THREE.MeshLambertMaterial({side : THREE.DoubleSide, map: texture});

/* Basic Materials */
const basicMaterialFront = new THREE.MeshBasicMaterial({side : THREE.FrontSide, map: texture});
const basicMaterialBack = new THREE.MeshBasicMaterial({color : 0xffffff, side : THREE.BackSide});
const basicMaterials = [basicMaterialFront, basicMaterialBack];

const basicMaterialDoubleWhite = new THREE.MeshBasicMaterial({color : 0xffffff, side : THREE.DoubleSide});
const basicMaterialDoubleTexture = new THREE.MeshBasicMaterial({side : THREE.DoubleSide, map: texture});

//  ---------------- Origami Vertices ---------------- //
/* See drawings to understand the faces' labels */


/* Origami1 vertices */
const origami1_vertices = [
    // left
    { pos: [0, -0.7,  0], uv: [1, 0], },
    { pos: [ 0, 0.7,  0], uv: [0, 1], },
    { pos: [0.7, 0,  0], uv: [1, 1], },

    //right
    { pos: [0,  0.7,  0], uv: [0, 1], },
    { pos: [ 0, -0.7,  0], uv: [1,0], },
    { pos: [-0.7, 0,  0.2], uv: [0, 0], },

];

/* Origami2 vertices */
const origami2_colored_vertices = [
    // 1
    { pos: [0, -0.6,  0], uv: [1,0], },
    { pos: [ 0, 0.6,  0], uv: [0,1], },
    { pos: [-0.26, 0.43,  0], uv: [0, 1- 8/24], },

    // 2
    { pos: [0,  0.6,  0], uv: [0,1], },
    { pos: [ 0, -0.6,  0], uv: [1,0], },
    { pos: [0.26, 0.43,  0], uv: [8/24, 1], },

    // 6
    { pos: [0, 0.37,  0.01], uv: [1 - 5/12, 1], },
    { pos: [ 0, -0.6,  0], uv: [1,0], },
    { pos: [0.25 , 0.3,  0], uv: [1 - 5 / 24, 1], },

    // 5
    { pos: [0, 0.37,  0.01], uv: [0, 5/12], },
    { pos: [-0.25, 0.3,  0], uv: [0, 5 / 24], },
    { pos: [ 0, -0.6,  0], uv: [1,0], },

    // 8
    { pos: [0, 0.3,  -0.01], uv: [0, 0], },
    { pos: [ 0, -0.6,  0], uv: [1,0], },
    { pos: [-0.25, 0.3,  0], uv: [0, 5/24], },

    // 7
    { pos: [0, 0.3,  -0.01], uv: [1, 1], },
    { pos: [0.25 , 0.3,  0], uv: [1 - 5/24, 1], },
    { pos: [ 0, -0.6,  0], uv: [1,0], },

];

const origami2_uncolored_vertices = [
    // 3 - white
    { pos: [0, 0.37,  0.01], uv: [1, 0], },
    { pos: [-0.26, 0.43,  0], uv: [1, 0], },
    { pos: [ 0, -0.5,  0], uv: [1,1], },

    // 4 - white
    { pos:  [0, 0.37,  0.01], uv: [1, 0], },
    { pos: [ 0, -0.6,  0], uv: [1,1], },
    { pos: [0.26, 0.43,  0], uv: [1, 0], },
];

/* Origami3 vertices */
const origami3_colored_vertices = [
    // 1
    { pos: [-0.2, -0.2,  0.2], uv: [0, 1 - 1/3], },
    { pos: [ -0.034, 0.13,  0], uv: [5/24, 1 - 5/24], },
    { pos: [-0.54, 0.13,  0], uv: [0, 1], },

    // 3
    { pos: [0.06,  -0.164, 0.201], uv: [0, 5/24], },
    { pos: [ 0.48, 0.13,  0], uv: [1/3,1/4], },
    { pos: [-0.034, 0.13,  0], uv: [0, 5/12], },

    // 4
    { pos: [0.06, -0.164,  0.201], uv: [0, 5/24], },
    { pos: [0.38,  -0.12,  0.2], uv: [1/4, 1/8], },
    { pos: [0.48, 0.13,  0], uv: [1/3, 1/4], },

    // 7
    { pos: [0.06, 0.58,  0.06], uv: [1-5/24, 1/24], },
    { pos: [0.34,  0.6,  0], uv: [1,  0], },
    { pos: [0.12, 0.64,  0], uv: [1 - 5/24, 1/12], },

    // 1 back
    { pos: [-0.2, -0.2,  -0.2], uv: [1/3, 1], },
    { pos: [-0.54, 0.13,  0], uv: [0, 1], },
    { pos: [ -0.034, 0.13,  0], uv: [5/24, 1 - 5/24], },

    // 3 back
    { pos: [0.06,  -0.164,  -0.201], uv: [1 - 5/24, 1], },
    { pos: [-0.034, 0.13,  0], uv: [1 - 5/12, 1], },
    { pos: [0.48, 0.13,  0], uv: [3/4, 2/3], },

    // 4 back
    { pos: [ 0.06, -0.164,  -0.201], uv: [1 - 5/24, 1], },
    { pos: [0.48, 0.13,  0], uv: [3/4, 2/3], },
    { pos: [0.38,  -0.12,  -0.2], uv: [7/8, 3/4], },

    // 7 back
    { pos: [ 0.06, 0.58,  -0.06], uv: [1-5/24, 1/24], },
    { pos: [0.12, 0.64,  0], uv: [11/12, 5/24], },
    { pos: [0.34,  0.6,  0], uv: [1, 0], },

];

const origami3_uncolored_vertices = [
    // 2 - white
    { pos: [-0.2,  -0.2,  0.2], uv: [0.5, 0.5], },
    { pos: [ 0.06, -0.164,  0.2], uv: [1,1], },
    { pos: [-0.034, 0.13,  0.002], uv: [1, 0], },

    // 2 back - white
    { pos: [-0.2,  -0.2,  -0.2], uv: [0.5, 0.5], },
    { pos: [ 0.06, -0.164,  -0.2], uv: [1,1], },
    { pos: [-0.034, 0.13,  -0.002], uv: [1, 0], },
];

const origami3_double_colored_vertices = [
    // 5
    { pos: [0.38,  -0.12,  0.2], uv: [1/4, 1/8], },
    { pos: [ 0.48, 0.13,  0], uv: [7/24, 0] },
    { pos: [0.12, 0.64,  0], uv: [1 - 5/24, 0], },

    // 6
    { pos: [0.38,  -0.12,  0.2], uv: [1/4, 1/8], },
    { pos: [0.12, 0.64,  0], uv: [1 - 5/24, 0], },
    { pos: [ 0.06, 0.58,  0.06], uv: [1 - 5/24, 1/24], },

    // 5 back
    { pos: [0.38,  -0.12,  -0.2], uv: [7/8, 3/4], },
    { pos: [ 0.48, 0.13,  0], uv: [1, 1-7/24], },
    { pos: [0.12, 0.64,  0], uv: [1, 5/24], },

    // 6 back
    { pos: [0.38,  -0.12,  -0.2], uv: [7/8, 3/4], },
    { pos: [0.12, 0.64,  0], uv: [1, 5/24], },
    { pos: [ 0.06, 0.58,  -0.06], uv: [23/24, 5/24], },
];