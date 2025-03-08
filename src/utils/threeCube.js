import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap'; // 使用 GSAP 实现动画

let scene, camera, renderer, cube, controls;

const colors = [
  0x777777, 0x333333, 0x555555, 0x777777, 0x999999, 0xBBBBBB
]; // 灰色调

/**
 * 初始化 Three.js 场景
 * @param {HTMLElement} container - 渲染的 HTML 容器
 * @param {Object} dimensions - 立方体初始尺寸 { width, height, depth }
 */
export function initScene(container, dimensions) {
  scene = new THREE.Scene();

  // 正交相机设置
  const aspect = container.clientWidth / container.clientHeight;
  const frustumSize = 200;
  camera = new THREE.OrthographicCamera(
    (-frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    1000
  );
  camera.position.set(200, 200, 300);
  camera.lookAt(0, 0, 0);

  // 初始化 WebGL 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0); // 透明背景
  container.appendChild(renderer.domElement);

  // 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  createCube(dimensions);
  animate();
}

/**
 * 创建立方体
 * @param {Object} dimensions - 尺寸 { width, height, length }
 */
function createCube(dimensions) {
  const { width, height, length } = dimensions;

  const geometry = new THREE.BoxGeometry(1, 1, 1); // 基础立方体
  const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));
  cube = new THREE.Mesh(geometry, materials);
  cube.scale.set(width, height, length); // 初始缩放
  scene.add(cube);
}

/**
 * 平滑更新立方体尺寸
 * @param {Object} newDimensions - 新的尺寸 { width, height, depth }
 */
export function updateCube(newDimensions) {
  const { width, height, length } = newDimensions;

  // 使用 GSAP 实现平滑缩放
  gsap.to(cube.scale, {
    x: width,
    y: height,
    z: length,
    duration: 1, // 动画持续时间（秒）
    ease: 'power2.out', // 缓动函数
  });
}

/**
 * 渲染循环
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
