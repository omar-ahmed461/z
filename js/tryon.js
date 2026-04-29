import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/controls/OrbitControls.js";

let model;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8f4ef);

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 4);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
document.getElementById("canvas").appendChild(renderer.domElement);

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.5));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5,5,5);
scene.add(dirLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Load model
const loader = new GLTFLoader();
loader.load("./models/avatar.glb", (gltf) => {
    model = gltf.scene;
    model.position.set(0, -1, 0);
    scene.add(model);
});

// Smooth scaling
function updateModel() {
    if (!model) return;

    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const chest = document.getElementById("chest").value;
    const waist = document.getElementById("waist").value;
    const hips = document.getElementById("hips").value;

    const heightScale = height / 175;
    const weightScale = weight / 100;
    const bodyWidth = (chest + waist + hips) / 300;

    model.scale.x += (bodyWidth - model.scale.x) * 0.1;
    model.scale.y += (heightScale - model.scale.y) * 0.1;
    model.scale.z += (bodyWidth - model.scale.z) * 0.1;
}

// Presets
window.preset = function(type) {
    if (type === "slim") {
        height.value = 175; weight.value = 60; chest.value = 85; waist.value = 65; hips.value = 90;
    }
    if (type === "athletic") {
        height.value = 180; weight.value = 80; chest.value = 100; waist.value = 80; hips.value = 100;
    }
    if (type === "plus") {
        height.value = 170; weight.value = 95; chest.value = 115; waist.value = 105; hips.value = 120;
    }
}

// Animate
function animate() {
    requestAnimationFrame(animate);
    updateModel();
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight);
    camera.aspect = (window.innerWidth * 0.7) / window.innerHeight;
    camera.updateProjectionMatrix();
});
