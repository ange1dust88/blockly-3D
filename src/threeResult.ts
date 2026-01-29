import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

(window as any).THREE = THREE;

let orbitControls: OrbitControls | null = null;

export function initThree(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

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

  orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.05;
  orbitControls.screenSpacePanning = false;
  orbitControls.minDistance = 1;
  orbitControls.maxDistance = 100;
  orbitControls.maxPolarAngle = Math.PI;

  const objects: THREE.Mesh[] = [];

  function animate() {
    requestAnimationFrame(animate);

    if (orbitControls) {
      orbitControls.update();
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  return { scene, camera, renderer, objects, controls: orbitControls };
}

export function setCameraControls(enabled: boolean) {
  if (orbitControls) {
    orbitControls.enabled = enabled;
  }
}

export function resetCamera() {
  if (orbitControls) {
    orbitControls.reset();
  }
}

export function setCameraConstraints(
  minDistance: number,
  maxDistance: number,
  enableRotate: boolean,
  enableZoom: boolean,
  enablePan: boolean,
) {
  if (!orbitControls) return;

  orbitControls.minDistance = minDistance;
  orbitControls.maxDistance = maxDistance;
  orbitControls.enableRotate = enableRotate;
  orbitControls.enableZoom = enableZoom;
  orbitControls.enablePan = enablePan;
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

export function setObjectMaterial(varName: string, materialType: string) {
  const mesh = objectsMap[varName];
  if (!mesh) {
    console.warn(`Object ${varName} not found`);
    return;
  }

  let newMaterial: THREE.Material;

  switch (materialType) {
    case "phong":
      newMaterial = new THREE.MeshPhongMaterial({
        color:
          mesh.material instanceof THREE.MeshBasicMaterial
            ? mesh.material.color.getHex()
            : 0x00ff00,
      });
      break;
    case "standard":
      newMaterial = new THREE.MeshStandardMaterial({
        color:
          mesh.material instanceof THREE.MeshBasicMaterial
            ? mesh.material.color.getHex()
            : 0x00ff00,
      });
      break;
    case "wireframe":
      newMaterial = new THREE.MeshBasicMaterial({
        color:
          mesh.material instanceof THREE.MeshBasicMaterial
            ? mesh.material.color.getHex()
            : 0x00ff00,
        wireframe: true,
      });
      break;
    case "basic":
    default:
      newMaterial = new THREE.MeshBasicMaterial({
        color:
          mesh.material instanceof THREE.MeshBasicMaterial
            ? mesh.material.color.getHex()
            : 0x00ff00,
      });
      break;
  }

  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat) => mat.dispose());
    } else {
      mesh.material.dispose();
    }
  }

  mesh.material = newMaterial;
}

export function setObjectScale(
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

  mesh.scale.set(x, y, z);
}

export function clearScene(threeObjects: any) {
  if (!threeObjects) return;

  const objects = threeObjects.objects as THREE.Object3D[];
  objects.forEach((obj: THREE.Object3D) => {
    threeObjects.scene.remove(obj);
  });

  threeObjects.objects.length = 0;

  Object.keys(objectsMap).forEach((key) => {
    delete objectsMap[key];
  });
}

function performCSGOperation(
  threeObjects: any,
  varA: string,
  varB: string,
  resultName: string,
  operation: "union" | "subtract" | "intersect",
) {
  console.log(`CSG ${operation} called: ${varA}, ${varB}, ${resultName}`);

  if (!threeObjects) {
    console.error("Three.js not initialized");
    return;
  }

  const meshA = objectsMap[varA];
  const meshB = objectsMap[varB];

  if (!meshA || !meshB) {
    console.warn(`Objects ${varA} or ${varB} not found for CSG ${operation}`);
    return;
  }

  const meshAClone = meshA.clone();
  const meshBClone = meshB.clone();

  meshAClone.updateMatrix();
  meshBClone.updateMatrix();

  try {
    const bspA = CSG.fromMesh(meshAClone);
    const bspB = CSG.fromMesh(meshBClone);
    let bspResult;

    switch (operation) {
      case "union":
        bspResult = bspA.union(bspB);
        break;
      case "subtract":
        bspResult = bspB.subtract(bspA);
        break;
      case "intersect":
        bspResult = bspA.intersect(bspB);
        break;
    }

    const resultMesh = CSG.toMesh(bspResult, meshA.matrix);

    if (meshA.material instanceof THREE.Material) {
      resultMesh.material = meshA.material.clone();
    } else if (Array.isArray(meshA.material)) {
      if (meshA.material.length > 0) {
        resultMesh.material = meshA.material[0].clone();
      } else {
        resultMesh.material = new THREE.MeshBasicMaterial({
          color:
            operation === "union"
              ? 0x00ff00
              : operation === "subtract"
                ? 0xff0000
                : 0x0000ff,
        });
      }
    } else {
      resultMesh.material = new THREE.MeshBasicMaterial({
        color:
          operation === "union"
            ? 0x00ff00
            : operation === "subtract"
              ? 0xff0000
              : 0x0000ff,
      });
    }

    threeObjects.scene.add(resultMesh);
    threeObjects.objects.push(resultMesh);
    objectsMap[resultName] = resultMesh;

    meshA.visible = false;
    meshB.visible = false;
  } catch (error) {
    console.error(`CSG ${operation} failed:`, error);
  }
}

export function csgSubtract(
  threeObjects: any,
  varA: string,
  varB: string,
  resultName: string,
) {
  performCSGOperation(threeObjects, varA, varB, resultName, "subtract");
}

export function csgUnion(
  threeObjects: any,
  varA: string,
  varB: string,
  resultName: string,
) {
  performCSGOperation(threeObjects, varA, varB, resultName, "union");
}

export function csgIntersect(
  threeObjects: any,
  varA: string,
  varB: string,
  resultName: string,
) {
  performCSGOperation(threeObjects, varA, varB, resultName, "intersect");
}
