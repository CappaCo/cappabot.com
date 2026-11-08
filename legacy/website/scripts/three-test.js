// deno-lint-ignore-file no-window
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

// Export the functions to the window scope so they can be used on the page
window.cylinder = cylinder;
window.someShapes = someShapes;

function cylinder() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    testContainer.append(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(35, ratio, 0.1, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 0, 10);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");

    const geometry = new THREE.CylinderGeometry(1, 1, 5, 16, 4);
    const material = new THREE.MeshStandardMaterial({ color: "white" });
    const cylinder = new THREE.Mesh(geometry, material);
    scene.add(cylinder);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(20, 10, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xff0000, 0.1);
    scene.add(ambientLight);

    animate();
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
}

function someShapes() {
    let camera, scene, renderer;

    init();

    function init() {
        camera = new THREE.PerspectiveCamera(45, ratio, 1, 2000);
        camera.position.y = 400;

        scene = new THREE.Scene();

        let object;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);
        camera.add(pointLight);
        scene.add(camera);

        const material = new THREE.MeshStandardMaterial({ color: "white" });

        //

        object = new THREE.Mesh(new THREE.SphereGeometry(75, 20, 10), material);
        object.position.set(-300, 0, 200);
        scene.add(object);

        object = new THREE.Mesh(new THREE.IcosahedronGeometry(75, 1), material);
        object.position.set(-100, 0, 200);
        scene.add(object);

        object = new THREE.Mesh(new THREE.OctahedronGeometry(75, 2), material);
        object.position.set(100, 0, 200);
        scene.add(object);

        object = new THREE.Mesh(new THREE.TetrahedronGeometry(75, 0), material);
        object.position.set(300, 0, 200);
        scene.add(object);

        //

        object = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 4, 4),
            material,
        );
        object.position.set(-300, 0, 0);
        scene.add(object);

        object = new THREE.Mesh(
            new THREE.BoxGeometry(100, 100, 100, 4, 4, 4),
            material,
        );
        object.position.set(-100, 0, 0);
        scene.add(object);

        object = new THREE.Mesh(
            new THREE.CircleGeometry(50, 20, 0, Math.PI * 2),
            material,
        );
        object.position.set(100, 0, 0);
        scene.add(object);

        object = new THREE.Mesh(
            new THREE.RingGeometry(10, 50, 20, 5, 0, Math.PI * 2),
            material,
        );
        object.position.set(300, 0, 0);
        scene.add(object);

        //

        object = new THREE.Mesh(
            new THREE.CylinderGeometry(25, 75, 100, 40, 5),
            material,
        );
        object.position.set(-300, 0, -200);
        scene.add(object);

        const points = [];

        for (let i = 0; i < 50; i++) {
            points.push(
                new THREE.Vector2(
                    Math.sin(i * 0.2) * Math.sin(i * 0.1) * 15 + 50,
                    (i - 5) * 2,
                ),
            );
        }

        object = new THREE.Mesh(new THREE.LatheGeometry(points, 20), material);
        object.position.set(-100, 0, -200);
        scene.add(object);

        object = new THREE.Mesh(
            new THREE.TorusGeometry(50, 20, 20, 20),
            material,
        );
        object.position.set(100, 0, -200);
        scene.add(object);

        object = new THREE.Mesh(
            new THREE.TorusKnotGeometry(50, 10, 50, 20),
            material,
        );
        object.position.set(300, 0, -200);
        scene.add(object);

        //

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setAnimationLoop(render);
        testContainer.appendChild(renderer.domElement);
    }

    function render() {
        const timer = Date.now() * 0.0001;

        camera.position.x = Math.cos(timer) * 800;
        camera.position.z = Math.sin(timer) * 800;

        camera.lookAt(scene.position);

        scene.traverse(function (object) {
            if (object.isMesh === true) {
                object.rotation.x = timer * 5;
                object.rotation.y = timer * 2.5;
            }
        });

        renderer.render(scene, camera);
    }
}
