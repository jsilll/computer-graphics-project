const texture = new THREE.TextureLoader().load('textures/origami_texture.jpg');

const phongMaterialFront = new THREE.MeshPhongMaterial({side : THREE.FrontSide, map: texture});
const phongMaterialBack = new THREE.MeshPhongMaterial({color : 0xffffff, side : THREE.BackSide});

const phongMaterialDoubleWhite = new THREE.MeshPhongMaterial({color : 0xffffff, side : THREE.DoubleSide});
const phongMaterialDoubleTexture = new THREE.MeshPhongMaterial({side : THREE.DoubleSide, map: texture});

const lambertMaterialFront = new THREE.MeshLambertMaterial({side : THREE.FrontSide, map: texture});
const lambertMaterialBack = new THREE.MeshLambertMaterial({color : 0xffffff, side : THREE.BackSide});
const lambertMaterials = [lambertMaterialFront, lambertMaterialBack];

const lambertMaterialDoubleWhite = new THREE.MeshLambertMaterial({color : 0xffffff, side : THREE.DoubleSide});
const lambertMaterialDoubleTexture = new THREE.MeshLambertMaterial({side : THREE.DoubleSide, map: texture});

const origami1_vertices = [
    // front
    { pos: [0, -0.5,  0], uv: [1, 0], },
    { pos: [ 0, 0.5,  0], uv: [0, 1], },
    { pos: [0.5, 0,  0], uv: [1, 1], },

    { pos: [0,  0.5,  0], uv: [0, 1], },
    { pos: [ 0, -0.5,  0], uv: [1,0], },
    { pos: [-0.5, 0,  0.2], uv: [0, 0], },

];

const origami2_colored_vertices = [
    // 1
    { pos: [0, -0.5,  0], uv: [1,0], },
    { pos: [ 0, 0.5,  0], uv: [0,1], },
    { pos: [-1/6, 1/3,  0], uv: [0, 1- 8/24], },

    // 2
    { pos: [0,  0.5,  0], uv: [0,1], },
    { pos: [ 0, -0.5,  0], uv: [1,0], },
    { pos: [1/6, 1/3,  0], uv: [8/24, 1], },

    // 8
    { pos: [0, 5/24,  -0.01], uv: [0, 0], },
    { pos: [ 0, -0.5,  0], uv: [1,0], },
    { pos: [(-5 * Math.sqrt(0.5)) /24, 5/24,  0], uv: [0, 5/24], },

    // 7
    { pos: [0, 5/24,  -0.01], uv: [1, 1], },
    { pos: [(5 * Math.sqrt(0.5)) /24, 5/24,  0], uv: [1 - 5/24, 1], },
    { pos: [ 0, -0.5,  0], uv: [1,0], },

    // 6
    { pos: [0, 13/48,  0.01], uv: [1 - 5/12, 1], },
    { pos: [ 0, -0.5,  0], uv: [1,0], },
    { pos: [(5 * Math.sqrt(0.5)) /24, 5/24,  0], uv: [1 - 5 / 24, 1], },

    // 5
    { pos: [0, 13/48,  0.01], uv: [0, 5/12], },
    { pos: [(-5 * Math.sqrt(0.5)) /24, 5/24,  0], uv: [0, 5 / 24], },
    { pos: [ 0, -0.5,  0], uv: [1,0], },

];

const origami2_uncolored_vertices = [
    // 3 - branco
    { pos: [0, 13/48,  0.01], uv: [1, 0], },
    { pos: [-1/6, 1/3,  0], uv: [1, 0], },
    { pos: [ 0, -0.5,  0], uv: [1,1], },

    // 4 -branco
    { pos:  [0, 13/48,  0.01], uv: [1, 0], },
    { pos: [ 0, -0.5,  0], uv: [1,1], },
    { pos: [1/6, 1/3,  0], uv: [1, 0], },
];

const origami3_colored_vertices = [
    // 1 OK
    { pos: [-0.1, 0,  0.1], uv: [0, 1 - 1/3], },
    { pos: [ -0.017, 1/6,  0], uv: [5/24, 1 - 5/24], },
    { pos: [-0.27, 1/6,  0], uv: [0, 1], },

    // 3 OK
    { pos: [0.03,  0.018,  0.101], uv: [0, 5/24], },
    { pos: [ 0.24, 0.15,  0], uv: [1/3,1/4], },
    { pos: [-0.017, 1/6,  0], uv: [0, 5/12], },

    // 4 OK
    { pos: [0.03, 0.018,  0.101], uv: [0, 5/24], },
    { pos: [0.19,  0.04,  0.1], uv: [1/4, 1/8], },
    { pos: [0.24, 0.15,  0], uv: [1/3, 1/4], },

    // 7
    { pos: [0.03, 0.39,  0.03], uv: [1-5/24, 1/24], },
    { pos: [0.17,  0.4,  0], uv: [1,  0], },
    { pos: [0.06, 0.42,  0], uv: [1 - 5/24, 1/12], },

    // 1 atras OK
    { pos: [-0.1, 0,  -0.1], uv: [1/3, 1], },
    { pos: [-0.27, 1/6,  0], uv: [0, 1], },
    { pos: [ -0.017, 1/6,  0], uv: [5/24, 1 - 5/24], },

    // 3 atras OK
    { pos: [0.03,  0.018,  -0.101], uv: [1 - 5/24, 1], },
    { pos: [-0.017, 1/6,  0], uv: [1 - 5/12, 1], },
    { pos: [0.24, 0.15,  0], uv: [3/4, 2/3], },

    // 4 atras OK
    { pos: [ 0.03, 0.018,  -0.101], uv: [1 - 5/24, 1], },
    { pos: [0.24, 0.15,  0], uv: [3/4, 2/3], },
    { pos: [0.19,  0.04,  -0.1], uv: [7/8, 3/4], },

    // 7 atras
    { pos: [ 0.03, 0.39,  -0.03], uv: [1-5/24, 1/24], },
    { pos: [0.06, 0.42,  0], uv: [11/12, 5/24], },
    { pos: [0.17,  0.4,  0], uv: [1, 0], },

];

const origami3_uncolored_vertices = [
    // 2 - branco
    { pos: [-0.1,  0,  0.1], uv: [0.5, 0.5], },
    { pos: [ 0.03, 0.018,  0.1], uv: [1,1], },
    { pos: [-0.017, 1/6,  0.001], uv: [1, 0], },

    // 2 atras - branco
    { pos: [-0.1,  0,  -0.1], uv: [0.5, 0.5], },
    { pos: [ 0.03, 0.018,  -0.1], uv: [1,1], },
    { pos: [-0.017, 1/6,  0.001], uv: [1, 0], },
];

const origami3_double_colored_vertices = [
    // 5 OK
    { pos: [0.19,  0.04,  0.1], uv: [1/4, 1/8], },
    { pos: [ 0.24, 0.15,  0], uv: [7/24, 0] },
    { pos: [0.06, 0.42,  0], uv: [1 - 5/24, 0], },

    // 6 OK
    { pos: [0.19,  0.04,  0.1], uv: [1/4, 1/8], },
    { pos: [0.06, 0.42,  0], uv: [1 - 5/24, 0], },
    { pos: [ 0.03, 0.39,  0.03], uv: [1 - 5/24, 1/24], },

    // 5 atras OK
    { pos: [0.19,  0.04,  -0.1], uv: [7/8, 3/4], },
    { pos: [ 0.24, 0.15,  0], uv: [1, 1-7/24], },
    { pos: [0.06, 0.42,  0], uv: [1, 5/24], },

    // 6 atras OK
    { pos: [0.19,  0.04,  -0.1], uv: [7/8, 3/4], },
    { pos: [0.06, 0.42,  0], uv: [1, 5/24], },
    { pos: [ 0.03, 0.39,  -0.03], uv: [23/24, 5/24], },
];