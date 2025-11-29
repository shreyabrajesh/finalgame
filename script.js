// Subway Surfers Clone using Three.js

// Renderer
const canvas = document.getElementById("gameCanvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

// Camera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(0, 7, 15);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 20, 10);
scene.add(light);

const ambient = new THREE.AmbientLight(0x888888, 1);
scene.add(ambient);

// Player (3D Box)
const playerGeometry = new THREE.BoxGeometry(1.2, 2.2, 1.2);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ccff });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1.3, 5);
scene.add(player);

// Ground
const groundGeo = new THREE.PlaneGeometry(20, 800);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.z = -200;
scene.add(ground);

// Lane system
let lane = 0;
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && lane > -1) lane--;
    if (e.key === "ArrowRight" && lane < 1) lane++;
});

// Obstacles
let obstacles = [];
function createObstacle() {
    const geo = new THREE.BoxGeometry(2, 3, 2);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff4444 });
    const obs = new THREE.Mesh(geo, mat);

    const lanes = [-5, 0, 5];
    obs.position.set(lanes[Math.floor(Math.random() * 3)], 1.5, -120);

    obstacles.push(obs);
    scene.add(obs);
}
setInterval(createObstacle, 1500);

// Score system
let score = 0;
setInterval(() => {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
}, 400);

// Collision check
function detectCollision() {
    const pBox = new THREE.Box3().setFromObject(player);

    for (let obs of obstacles) {
        const oBox = new THREE.Box3().setFromObject(obs);
        if (pBox.intersectsBox(oBox)) {
            alert("Game Over! Score: " + score);
            location.reload();
        }
    }
}

// Game loop
function animate() {
    requestAnimationFrame(animate);

    // Smooth lane movement
    player.position.x += ((lane * 5) - player.position.x) * 0.1;

    // Move ground
    ground.position.z += 1;
    if (ground.position.z > 0) ground.position.z = -200;

    // Move obstacles
    obstacles.forEach((o, i) => {
        o.position.z += 1;

        if (o.position.z > 20) {
            scene.remove(o);
            obstacles.splice(i, 1);
        }
    });

    detectCollision();

    renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
