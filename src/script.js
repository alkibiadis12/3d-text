import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { gsap } from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl');
const dots = document.querySelector('canvas.dots');
const ctx = dots.getContext('2d');

//background image
const bg = new Image();
bg.src = './img/dots.png';

bg.onload = () => {
  console.log('loaded');
};

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTextureArray = [];
for (let i = 1; i < 9; i++) {
  matcapTextureArray.push(textureLoader.load(`./textures/matcaps/${i}.png`));
}

/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let dotsResized = false;
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  //DOTS
  dots.width = sizes.width;
  dots.height = sizes.height;
  dotsResized = true;
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// 1 1 2
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 9;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//DOTS BACKGROUND
dots.width = sizes.width;
dots.height = sizes.height;
for (let y = 20; y < canvas.height; y += 20) {
  for (let x = 20; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}

////////////////from here

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

const fontLoader = new FontLoader();
fontLoader.load('./fonts/helvetiker_regular.typeface.json', font => {
  const textGeometry = new TextGeometry('Alkis Spyridopoulos', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5, //trianges
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4, //trianges
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  textGeometry.center();

  const textMaterial = new THREE.MeshBasicMaterial();

  const matcapMaterial = new THREE.MeshMatcapMaterial();
  matcapMaterial.matcap = matcapTextureArray[2];

  textMaterial.wireframe = true;
  const text = new THREE.Mesh(textGeometry, matcapMaterial);
  scene.add(text);
});

////////
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
// const donutMaterial = new THREE.MeshMatcapMaterial({
//   matcap: matcapTextureArray[4],
// });
const donutMaterial = new THREE.MeshNormalMaterial();

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshNormalMaterial();

for (let i = 0; i < 500; i++) {
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  const cube = new THREE.Mesh(boxGeometry, boxMaterial);

  donut.position.set(
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 35
  );

  cube.position.set(
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 35
  );

  donut.rotation.x = Math.random() * Math.PI;
  cube.rotation.x = Math.random() * Math.PI;
  const scale = Math.random();
  donut.scale.set(scale, scale, scale);
  cube.scale.set(scale, scale, scale);

  scene.add(donut);
  scene.add(cube);
}

const cursor = {
  x: 0.5,
  y: 0.5,
};
window.addEventListener('mousemove', e => {
  cursor.x = Math.abs(-(e.clientX / sizes.width - 0.5));
  cursor.y = Math.abs(e.clientY / sizes.height - 0.5);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  gsap.to(camera.position, {
    duration: 1,
    delay: 0,
    ease: 'power1.out',
    x: Math.sin(elapsedTime * Math.PI * 0.3) * 4,
  });
  // camera.position.x = Math.sin(elapsedTime * Math.PI * 0.15) * 2;
  // camera.position.y = Math.cos(elapsedTime * Math.PI * 0.15) * 2;
  gsap.to(camera.position, {
    duration: 1,
    delay: 0,
    ease: 'power3.out',
    y: Math.cos(elapsedTime * Math.PI * 0.3) * 4,
  });
  // camera.position.z = Math.max(
  //   Math.tan(cursor.y * Math.PI * 0.9) + 2,
  //   Math.tan(cursor.x * Math.PI * 0.9) + 2
  // );
  gsap.to(camera.position, {
    duration: 1,
    delay: 0,
    ease: 'power2.out',
    z: Math.max(
      Math.tan(cursor.y * Math.PI * 0.9) + 1,
      Math.tan(cursor.x * Math.PI * 0.9) + 1
    ),
  });

  // camera.lookAt(new THREE.Vector3(0, 0, 0));

  // Update controls
  controls.update();

  //   camera.lookAt(new THREE.Vector3(camera.position));

  //DOTS
  if (dotsResized) {
    for (let y = 20; y < canvas.height; y += 20) {
      for (let x = 20; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    }
    dotsResized = false;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
