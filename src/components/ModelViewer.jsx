import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

const ModelViewer = ({ modelUrl }) => {
  const mountRef = useRef();

  useEffect(() => {
    if (!modelUrl) return;

    let mount = mountRef.current;
    if (!mount) return;

    const width = 600;
    const height = 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    //Vérifie avant de manipuler le DOM
    if (mount) {
      mount.innerHTML = "";
      mount.appendChild(renderer.domElement);
    }

    // Lumière principale (Key Light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(10, 10, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Lumière d’appoint (Fill Light)
    const fillLight = new THREE.DirectionalLight(0x88ccff, 1.2);
    fillLight.position.set(-10, 5, 5);
    scene.add(fillLight);

    // Lumière arrière  (Back Light)
    const backLight = new THREE.DirectionalLight(0xffffff, 1.8);
    backLight.position.set(0, 5, -10);
    scene.add(backLight);

    // Légère lumière ambiante globale
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    // environnement de fond légèrement lumineux
    const envLight = new THREE.HemisphereLight(0x99ccff, 0x222233, 0.4);
    scene.add(envLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let loadedObject = null;
    let isUnmounted = false;

    const ext = modelUrl.split("?")[0].split(".").pop().toLowerCase();

    const onLoaded = (obj) => {
      if (isUnmounted) return;
      if (obj.isBufferGeometry || obj.isGeometry) {
        const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const mesh = new THREE.Mesh(obj, material);
        loadedObject = mesh;
        scene.add(mesh);
      } else {
        loadedObject = obj.scene || obj;
        scene.add(loadedObject);
      }

      // orientation et centrage
      loadedObject.rotation.x = Math.PI / 2; // redresse (vertical vers horizontal)
      loadedObject.rotation.y = Math.PI;

      const box = new THREE.Box3().setFromObject(loadedObject);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      loadedObject.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.set(0, 0, maxDim * 1.5 + 1);
      camera.lookAt(0, 0, 0);
    };

    const loaderError = (err) => console.error("Loader error:", err);

    if (ext === "ply") {
      const loader = new PLYLoader();
      loader.load(
        modelUrl,
        (geometry) => onLoaded(geometry),
        undefined,
        loaderError
      );
    } else {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => onLoaded(gltf), undefined, loaderError);
    }

    const animate = () => {
      if (isUnmounted) return;
      requestAnimationFrame(animate);
      if (loadedObject) {
        //Rotation naturelle façon planète terre
        loadedObject.rotation.z += 0.005;
      }
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    //Nettoyage sécurisé
    return () => {
      isUnmounted = true;
      renderer.dispose();
      if (mount && mount.firstChild) mount.removeChild(renderer.domElement);
    };
  }, [modelUrl]);

  return <div ref={mountRef} />;
};

export default ModelViewer;
