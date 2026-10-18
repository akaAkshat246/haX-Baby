import * as THREE from "three";
import { Panda3DModel, PandaAnimState } from "./Panda3DModel";

export class Room3DScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public panda: Panda3DModel;

  private floorPlane: THREE.Mesh;
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;
  private container: HTMLElement;
  private animId: number | null = null;
  private clock: THREE.Clock;

  // Dust particles in sunbeams
  private dustPoints: THREE.Points;

  // Walkable Floor 3D Boundaries
  public bounds = {
    minX: -4.8,
    maxX: 4.8,
    minZ: -2.5, // near the window
    maxZ: 4.5,  // foreground near camera
  };

  public isFollowingCursor: boolean = true;
  public onPandaPoke?: (part: string) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();

    // 1. Camera setup with cinematic warm lens
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    this.camera.position.set(0, 3.8, 8.5);
    this.camera.lookAt(0, 1.6, 0);

    // 2. WebGL Renderer with High-End Lighting & Soft Shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 3. Lighting: Warm Afternoon Sunlight + Cozy Indoor Glow
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffe4b5, 0x4a2e18, 0.75);
    this.scene.add(hemiLight);

    // Main Directional Sunlight pouring in from window (top-left)
    const sunLight = new THREE.DirectionalLight(0xfff0d0, 2.4);
    sunLight.position.set(-6, 9, -2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -8;
    sunLight.shadow.camera.right = 8;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -8;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // Cozy Desk Lamp Point Light
    const deskLampLight = new THREE.PointLight(0xffaa44, 1.8, 8);
    deskLampLight.position.set(-4.2, 2.9, -1.8);
    this.scene.add(deskLampLight);

    // 4. Build 3D Room Environment
    this.floorPlane = this.buildRoom();

    // 5. Add 3D Panda Model
    this.panda = new Panda3DModel();
    this.panda.group.position.set(0, 0, 1.2);
    this.panda.targetPos.set(0, 0, 1.2);
    this.scene.add(this.panda.group);

    // 6. Floating Sunbeam Dust Particles
    this.dustPoints = this.buildSunbeamDust();
    this.scene.add(this.dustPoints);

    // Event listeners
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);

    window.addEventListener("resize", this.onWindowResize);
    container.addEventListener("pointermove", this.onPointerMove);
    container.addEventListener("pointerdown", this.onPointerDown);

    // Start 60fps render loop
    this.animate = this.animate.bind(this);
    this.animId = requestAnimationFrame(this.animate);
  }

  // Build the complete 3D Room Furniture & Architecture
  private buildRoom(): THREE.Mesh {
    // A. 3D Wooden Floor with warm parquet material
    const floorGeo = new THREE.PlaneGeometry(18, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xc48247, // Warm rich honey parquet
      roughness: 0.38,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // B. Back Wall with floor-to-ceiling panoramic window
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xf5eee6,
      roughness: 0.9,
    });

    // Left wall section
    const leftWallGeo = new THREE.BoxGeometry(4, 8, 0.4);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-6.5, 4, -4);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right wall section
    const rightWallGeo = new THREE.BoxGeometry(4.5, 8, 0.4);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.position.set(6.8, 4, -4);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // Header above window
    const windowHeaderGeo = new THREE.BoxGeometry(9.5, 1.8, 0.4);
    const windowHeader = new THREE.Mesh(windowHeaderGeo, wallMat);
    windowHeader.position.set(0.2, 7.1, -4);
    this.scene.add(windowHeader);

    // C. 3D Window Frame & City Skyline Panorama Backdrop
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, roughness: 0.4, metalness: 0.7 });
    const frameGeo = new THREE.BoxGeometry(9.6, 6.2, 0.2);
    // Outer frame and mullions
    const mullionV1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.2, 0.25), frameMat);
    mullionV1.position.set(-1.6, 3.1, -3.9);
    this.scene.add(mullionV1);

    const mullionV2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.2, 0.25), frameMat);
    mullionV2.position.set(1.8, 3.1, -3.9);
    this.scene.add(mullionV2);

    // City Skyline Backdrop plane behind window
    const skyTextureLoader = new THREE.TextureLoader();
    const skyGeo = new THREE.PlaneGeometry(22, 14);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xffd8b4, // Warm sunset city skyline glow
    });
    // If room_bg is loaded, map it as background
    skyTextureLoader.load("/assets/panda/room_bg.jpg", (tex) => {
      skyMat.map = tex;
      skyMat.color.setHex(0xffffff);
      skyMat.needsUpdate = true;
    });
    const skyPlane = new THREE.Mesh(skyGeo, skyMat);
    skyPlane.position.set(0, 4.5, -7.5);
    this.scene.add(skyPlane);

    // D. 3D Modern Sofa (Right Side)
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(4.2, 0, -0.8);
    sofaGroup.rotation.y = -0.15;

    const sofaFabricMat = new THREE.MeshStandardMaterial({ color: 0xd9caba, roughness: 0.85 });
    const cushionBlueMat = new THREE.MeshStandardMaterial({ color: 0x6ba4b8, roughness: 0.8 });
    const cushionCreamMat = new THREE.MeshStandardMaterial({ color: 0xf5ecd7, roughness: 0.8 });

    // Base seat
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.65, 1.6), sofaFabricMat);
    sofaBase.position.y = 0.55;
    sofaBase.castShadow = true;
    sofaBase.receiveShadow = true;
    sofaGroup.add(sofaBase);

    // Backrest
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 0.45), sofaFabricMat);
    sofaBack.position.set(0, 1.25, -0.6);
    sofaBack.castShadow = true;
    sofaGroup.add(sofaBack);

    // Armrests
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.9, 1.6), sofaFabricMat);
    leftArm.position.set(-1.7, 0.9, 0);
    leftArm.castShadow = true;
    sofaGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.9, 1.6), sofaFabricMat);
    rightArm.position.set(1.7, 0.9, 0);
    rightArm.castShadow = true;
    sofaGroup.add(rightArm);

    // Cushions
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.25), cushionBlueMat);
    c1.position.set(-1.1, 1.1, -0.3);
    c1.rotation.y = 0.2;
    sofaGroup.add(c1);

    const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.25), cushionCreamMat);
    c2.position.set(1.1, 1.1, -0.3);
    c2.rotation.y = -0.2;
    sofaGroup.add(c2);

    this.scene.add(sofaGroup);

    // E. 3D Coffee Table & Rug (in front of sofa)
    const rugGeo = new THREE.PlaneGeometry(4.0, 2.6);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0xc8b59e, roughness: 0.95 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(3.8, 0.01, 1.4);
    rug.receiveShadow = true;
    this.scene.add(rug);

    const tableGroup = new THREE.Group();
    tableGroup.position.set(3.8, 0, 1.4);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x935b30, roughness: 0.45 });

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.1), woodMat);
    tableTop.position.y = 0.6;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // 4 Table Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.6, 12);
    [
      [-0.95, 0.3, -0.45],
      [0.95, 0.3, -0.45],
      [-0.95, 0.3, 0.45],
      [0.95, 0.3, 0.45],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      tableGroup.add(leg);
    });

    // Panda Ceramic Mug on table
    const mugGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.18, 16);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-0.4, 0.74, 0.1);
    mug.castShadow = true;
    tableGroup.add(mug);
    this.scene.add(tableGroup);

    // F. 3D Cozy Knit Beanbag (Center-Left)
    const beanbagGroup = new THREE.Group();
    beanbagGroup.position.set(-1.8, 0, -1.8);
    const beanbagMat = new THREE.MeshStandardMaterial({ color: 0xeadecd, roughness: 0.9 });
    const beanbagMesh = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 18), beanbagMat);
    beanbagMesh.scale.set(1.25, 0.85, 1.25);
    beanbagMesh.position.y = 0.6;
    beanbagMesh.castShadow = true;
    beanbagMesh.receiveShadow = true;
    beanbagGroup.add(beanbagMesh);
    this.scene.add(beanbagGroup);

    // G. 3D Study Desk (Left Side)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-4.6, 0, -1.2);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.4), woodMat);
    deskTop.position.y = 1.6;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs
    const deskLegGeo = new THREE.BoxGeometry(0.1, 1.6, 0.1);
    [
      [-1.1, 0.8, -0.6],
      [1.1, 0.8, -0.6],
      [-1.1, 0.8, 0.6],
      [1.1, 0.8, 0.6],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(deskLegGeo, woodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Mini 3D Laptop on desk
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.45), new THREE.MeshStandardMaterial({ color: 0x888890, metalness: 0.8 }));
    laptopBase.position.set(0, 1.68, 0);
    deskGroup.add(laptopBase);

    const laptopScreen = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.03), new THREE.MeshStandardMaterial({ color: 0x222228, roughness: 0.3 }));
    laptopScreen.position.set(0, 1.9, -0.22);
    laptopScreen.rotation.x = -0.25;
    deskGroup.add(laptopScreen);

    // Desk Lamp
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7 }));
    lampStem.position.set(0.8, 2.1, -0.4);
    deskGroup.add(lampStem);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.32, 16), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6 }));
    lampShade.position.set(0.65, 2.5, -0.3);
    lampShade.rotation.z = 0.5;
    deskGroup.add(lampShade);

    this.scene.add(deskGroup);

    return floor;
  }

  // Floating Sunbeam Dust Particles
  private buildSunbeamDust(): THREE.Points {
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = Math.random() * 4.5 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffeedd,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  // Pointer Move Handler for Raycasting 3D Floor Walking
  private onPointerMove(e: PointerEvent) {
    const rect = this.container.getBoundingClientRect();
    this.mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);

    // 1. Raycast onto Floor Plane for 3D navigation
    if (this.isFollowingCursor && this.panda.animState !== "sleep" && this.panda.animState !== "sit") {
      const hits = this.raycaster.intersectObject(this.floorPlane);
      if (hits.length > 0) {
        const point = hits[0].point;
        // Clamp to walkable boundaries
        const clampedX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, point.x));
        const clampedZ = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, point.z));
        this.panda.targetPos.set(clampedX, 0, clampedZ);
      }
    }

    // 2. Head Tracking towards 3D cursor ray
    const rayPoint = new THREE.Vector3();
    this.raycaster.ray.at(5.5, rayPoint);
    this.panda.lookAtTarget(rayPoint);
  }

  // Pointer Down (Tap/Click to Walk or Poke Body Parts like Talking Tom!)
  private onPointerDown(e: PointerEvent) {
    const rect = this.container.getBoundingClientRect();
    this.mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);

    // Check if clicked directly on Panda body meshes
    const pandaHits = this.raycaster.intersectObjects(this.panda.group.children, true);
    if (pandaHits.length > 0) {
      let partHit = "body";
      let cur: any = pandaHits[0].object;
      while (cur && cur !== this.panda.group) {
        if (cur.userData && cur.userData.part) {
          partHit = cur.userData.part;
          break;
        }
        cur = cur.parent;
      }

      if (this.onPandaPoke) {
        this.onPandaPoke(partHit);
        return;
      }
    }

    // Otherwise, tap to walk to point on floor
    const hits = this.raycaster.intersectObject(this.floorPlane);
    if (hits.length > 0) {
      const point = hits[0].point;
      const clampedX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, point.x));
      const clampedZ = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, point.z));
      this.panda.targetPos.set(clampedX, 0, clampedZ);
      if (this.panda.animState !== "walk" && this.panda.animState !== "dance") {
        this.panda.animState = "walk";
      }
    }
  }

  private onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // Main 60fps Animation Loop
  private animate() {
    const delta = this.clock.getDelta();

    // 1. Move Panda smoothly in 3D towards targetPos
    if (this.panda.animState === "walk") {
      const cur = this.panda.group.position;
      const target = this.panda.targetPos;

      const dx = target.x - cur.x;
      const dz = target.z - cur.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.15) {
        // Rotate smoothly towards walking direction
        const angle = Math.atan2(dx, dz);
        let diff = angle - this.panda.group.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.panda.group.rotation.y += diff * 0.12;

        // Step forward in 3D
        const step = Math.min(dist, delta * this.panda.walkSpeed * 0.95);
        cur.x += (dx / dist) * step;
        cur.z += (dz / dist) * step;
      } else {
        // Arrived at target, switch to idle breathing
        this.panda.animState = "idle";
      }
    }

    // 2. Update Panda's 3D internal animations (walk, dance, sit, sleep, etc.)
    this.panda.update(delta);

    // 3. Gentle dust particle drift
    if (this.dustPoints) {
      const pos = this.dustPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= delta * 0.1;
        if (pos[i] < 0.2) pos[i] = 4.5;
      }
      this.dustPoints.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
    this.animId = requestAnimationFrame(this.animate);
  }

  public dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.onWindowResize);
    this.container.removeEventListener("pointermove", this.onPointerMove);
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.dispose();
  }
}
