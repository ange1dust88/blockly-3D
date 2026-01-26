import * as THREE from "three";

(window as any).THREE = THREE;

export function initThree(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const objects: THREE.Mesh[] = [];

  function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  return { scene, camera, renderer, objects };
}

const objectsMap: Record<string, THREE.Mesh> = {};

export function addObject(
  threeObjects: any,
  objectType: string,
  varName: string,
) {
  if (!threeObjects) return;

  let geometry: THREE.BufferGeometry;

  switch (objectType) {
    case "sphere":
      geometry = new THREE.SphereGeometry(1, 32, 32);
      break;
    case "cylinder":
      geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
      break;
    case "cone":
      geometry = new THREE.ConeGeometry(1, 2, 32);
      break;
    case "torus":
      geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
      break;
    case "cube":
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
  }

  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);

  threeObjects.scene.add(mesh);
  threeObjects.objects.push(mesh);

  // Сохраняем объект в мапе по имени переменной
  objectsMap[varName] = mesh;
  mesh.userData = { varName };
}

export function setObjectPosition(
  varName: string,
  x: number,
  y: number,
  z: number,
) {
  const mesh = objectsMap[varName];
  if (!mesh) {
    console.warn(`Object ${varName} not found`);
    return;
  }

  mesh.position.set(x, y, z);
}

export function setObjectRotation(
  varName: string,
  x: number,
  y: number,
  z: number,
) {
  const mesh = objectsMap[varName];
  if (!mesh) {
    console.warn(`Object ${varName} not found`);
    return;
  }

  mesh.rotation.set(x, y, z);
}

export function setObjectColor(
  varName: string,
  r: number,
  g: number,
  b: number,
) {
  const mesh = objectsMap[varName];
  if (!mesh || !(mesh.material instanceof THREE.MeshBasicMaterial)) {
    console.warn(
      `Object ${varName} not found or material doesn't support color`,
    );
    return;
  }

  mesh.material.color.setRGB(r / 255, g / 255, b / 255);
}

export function clearScene(threeObjects: any) {
  if (!threeObjects) return;

  const objects = threeObjects.objects as THREE.Object3D[];
  objects.forEach((obj: THREE.Object3D) => {
    threeObjects.scene.remove(obj);
  });

  threeObjects.objects.length = 0;

  // Очищаем мапу объектов
  Object.keys(objectsMap).forEach((key) => {
    delete objectsMap[key];
  });
}
