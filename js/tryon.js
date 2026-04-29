import * as THREE from "https://unpkg.com/three@0.158/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.158/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.158/examples/jsm/controls/OrbitControls.js";

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

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5,5,5);
scene.add(light);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Load model
const loader = new GLTFLoader();
loader.load("./models/avatar.glb", (gltf) => {
    model = gltf.scene;

    // center + scale
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();

    model.position.sub(center);
    model.scale.setScalar(2 / size);

    scene.add(model);
});

// Update model based on numbers
function updateModel() {
    if (!model) return;

    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    const chest = Number(document.getElementById("chest").value);
    const waist = Number(document.getElementById("waist").value);
    const hips = Number(document.getElementById("hips").value);

    const heightScale = height / 175;
    const bodyWidth = (chest + waist + hips) / 300;

    model.scale.x += (bodyWidth - model.scale.x) * 0.1;
    model.scale.y += (heightScale - model.scale.y) * 0.1;
    model.scale.z += (bodyWidth - model.scale.z) * 0.1;
}

// Listen to input changes
["height","weight","chest","waist","hips"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateModel);
});

// Animate
function animate() {
    requestAnimationFrame(animate);
    controls.update();
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
