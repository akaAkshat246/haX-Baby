import * as THREE from "three";
import { Cat3DModel, CatAnimState } from "./Cat3DModel";

export interface Obstacle3D {
  id: string;
  name: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  isCircle?: boolean;
  centerX?: number;
  centerZ?: number;
  radius?: number;
}

export type RoomStation = "kitty" | "panda" | "story" | "lullaby" | "relics" | "desktop";

// Helper function to generate completely smooth rounded box geometry (no sharp edges)
function createRoundedBox(
  width: number,
  height: number,
  depth: number,
  radius: number,
  smoothness: number = 3
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const eps = 0.0001;
  const r = Math.min(radius, Math.min(width, height) / 2 - eps);

  shape.absarc(-width / 2 + r, -height / 2 + r, r, Math.PI, 1.5 * Math.PI, false);
  shape.absarc(width / 2 - r, -height / 2 + r, r, 1.5 * Math.PI, 2 * Math.PI, false);
  shape.absarc(width / 2 - r, height / 2 - r, r, 0, 0.5 * Math.PI, false);
  shape.absarc(-width / 2 + r, height / 2 - r, r, 0.5 * Math.PI, Math.PI, false);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.001, depth - r * 2),
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: r,
    bevelThickness: r,
    curveSegments: smoothness * 2,
  });

  geometry.center();
  return geometry;
}

export class Room3DScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cat: Cat3DModel;

  public get panda() {
    return this.cat;
  }

  // Camera Director System
  public targetCamPos: THREE.Vector3 = new THREE.Vector3(0, 2.6, 6.4);
  public targetCamLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.2, 1.0);
  public currentCamLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.5, 0);
  public currentStation: RoomStation = "kitty";

  private floorPlane: THREE.Mesh;
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private groundPoint = new THREE.Vector3();
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;
  private container: HTMLElement;
  private animId: number | null = null;
  private clock: THREE.Clock;

  // Lighting elements
  private ambientLight: THREE.AmbientLight;
  private hemiLight: THREE.HemisphereLight;
  private sunLight: THREE.DirectionalLight;
  private deskLampLight: THREE.PointLight;
  private synthPointLight: THREE.PointLight;
  private relicsPointLight: THREE.PointLight;
  private fairyLightGroup: THREE.Group;
  private fairyPointLights: THREE.PointLight[] = [];
  private skyPlane: THREE.Mesh;
  private sunsetSkyTex: THREE.CanvasTexture;
  private starryNightTex: THREE.CanvasTexture;

  // Particle systems & animated elements
  private dustPoints: THREE.Points;
  private relicDustPoints: THREE.Points;
  private fairyLightMeshes: THREE.Mesh[] = [];
  private danglingBallMesh?: THREE.Mesh;

  // 3D Station Meshes
  private storyHoloRings: THREE.Mesh[] = [];
  private storyScreenMesh?: THREE.Mesh;
  private equalizerBars: THREE.Mesh[] = [];
  private relicMeshes: THREE.Object3D[] = [];
  private interactiveStations: THREE.Object3D[] = [];
  private interactivePlantGroup?: THREE.Group;
  private plantHitboxMesh?: THREE.Mesh;
  private plantWiggleTimer: number = 0;

  // Autonomous Curiosity Wandering Engine
  private wanderTimer: number = 0;
  private nextWanderInterval: number = 4.0;
  private readonly WAYPOINTS: THREE.Vector3[] = [
    new THREE.Vector3(0, 0, 1.2),      // Center plush carpet
    new THREE.Vector3(-3.2, 0, 0.8),   // Sunny floor area
    new THREE.Vector3(3.5, 0, 1.5),    // Near cozy sofa lounge
    new THREE.Vector3(-6.2, 0, 1.8),   // Near scratch post & kitten tower
    new THREE.Vector3(1.0, 0, -3.8),   // Near sunny window bay
    new THREE.Vector3(-2.5, 0, -2.2),  // Near velvet pouf
    new THREE.Vector3(2.2, 0, 3.8),    // Foreground near camera
    new THREE.Vector3(-4.5, 0, 3.0),   // Left play zone
    new THREE.Vector3(0, 0, -1.2),     // Center room
  ];

  // Expanded, spacious walkable 3D boundaries for effortless roaming
  public bounds = {
    minX: -10.0,
    maxX: 10.0,
    minZ: -5.0, // near the bay window seat
    maxZ: 7.2,  // foreground near camera
  };

  // 3D Furniture Obstacles with smooth rounded collision bounds
  public obstacles: Obstacle3D[] = [
    {
      id: "sofa",
      name: "Cozy Curved Sofa",
      minX: 5.2,
      maxX: 10.4,
      minZ: -3.2,
      maxZ: 0.5,
    },
    {
      id: "coffee_table",
      name: "Organic Pebble Table",
      minX: 5.4,
      maxX: 9.0,
      minZ: 1.2,
      maxZ: 3.6,
    },
    {
      id: "study_desk",
      name: "Rounded Study Desk",
      minX: -10.5,
      maxX: -6.0,
      minZ: -4.5,
      maxZ: -1.0,
    },
    {
      id: "beanbag",
      name: "Plush Velvet Pouf",
      isCircle: true,
      centerX: -4.5,
      centerZ: -4.0,
      radius: 1.5,
      minX: -6.0,
      maxX: -3.0,
      minZ: -5.5,
      maxZ: -2.5,
    },
    {
      id: "cat_tree",
      name: "Kitten Scratching Tower",
      isCircle: true,
      centerX: -8.8,
      centerZ: 3.8,
      radius: 1.4,
      minX: -10.2,
      maxX: -7.4,
      minZ: 2.4,
      maxZ: 5.2,
    },
    {
      id: "window_seat",
      name: "Sunlit Window Seat",
      minX: -6.0,
      maxX: 6.0,
      minZ: -7.0,
      maxZ: -5.4,
    },
  ];

  public isFollowingCursor: boolean = true;
  public onCatPoke?: (part: string) => void;
  public onCatBump?: (obstacleName: string) => void;
  public onStationClick?: (station: RoomStation) => void;

  public get onPandaPoke() {
    return this.onCatPoke;
  }
  public set onPandaPoke(fn: ((part: string) => void) | undefined) {
    this.onCatPoke = fn;
  }
  public get onPandaBump() {
    return this.onCatBump;
  }
  public set onPandaBump(fn: ((obstacleName: string) => void) | undefined) {
    this.onCatBump = fn;
  }

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();

    // 1. Camera setup: spacious wide field of view with cinematic depth
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(44, aspect, 0.1, 100);
    this.camera.position.set(0, 2.6, 6.4);
    this.camera.lookAt(0, 1.2, 1.0);
    this.currentCamLookAt.set(0, 1.2, 1.0);

    // 2. High-End WebGL Renderer with Soft PCF Shadows & ACES Tone Mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    container.appendChild(this.renderer.domElement);

    // 3. Warm, lively ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xffe8d6, 0x5a3e28, 0.85);
    this.scene.add(this.hemiLight);

    // Directional Sunlight pouring in through the expanded bay window
    this.sunLight = new THREE.DirectionalLight(0xfff4db, 2.6);
    this.sunLight.position.set(-8, 12, -3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 35;
    this.sunLight.shadow.camera.left = -12;
    this.sunLight.shadow.camera.right = 12;
    this.sunLight.shadow.camera.top = 12;
    this.sunLight.shadow.camera.bottom = -12;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    // Cozy Desk Lamp Point Light
    this.deskLampLight = new THREE.PointLight(0xffaa44, 2.4, 9);
    this.deskLampLight.position.set(-7.5, 3.2, -2.8);
    this.scene.add(this.deskLampLight);

    // Synthesizer Neon Glow Light
    this.synthPointLight = new THREE.PointLight(0x00f0ff, 1.6, 6);
    this.synthPointLight.position.set(7.2, 1.8, 2.4);
    this.scene.add(this.synthPointLight);

    // Celestial Relics Point Light
    this.relicsPointLight = new THREE.PointLight(0xff85b8, 2.2, 8);
    this.relicsPointLight.position.set(0, 3.8, -4.8);
    this.scene.add(this.relicsPointLight);

    // Warm Fairy String Lights Group (Enabled in Night Mode)
    this.fairyLightGroup = new THREE.Group();
    this.fairyLightGroup.visible = false;
    this.scene.add(this.fairyLightGroup);

    this.sunsetSkyTex = this.createSunsetSkyTexture();
    this.starryNightTex = this.createStarryNightTexture();

    // 4. Build the Spacious Rounded Room Environment
    const room = this.buildRoom();
    this.floorPlane = room.floor;
    this.skyPlane = room.sky;

    // 5. Add 3D Interactive Stations with 100% Rounded Corners
    this.buildStoryTerminalStation();
    this.buildLullabySynthesizerStation();
    this.buildFloatingRelicsStation();

    // 6. Add Cute 3D Kitten Model
    this.cat = new Cat3DModel();
    this.cat.group.position.set(0, 0, 1.2);
    this.scene.add(this.cat.group);

    // 7. Sunbeam Floating Particles
    this.dustPoints = this.buildSunbeamDust();
    this.scene.add(this.dustPoints);

    // 8. Relic Stardust Particles
    this.relicDustPoints = this.buildRelicStardust();
    this.scene.add(this.relicDustPoints);

    // Bind event handlers
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener("resize", this.onWindowResize);
    window.addEventListener("pointermove", this.onPointerMove);
    this.container.addEventListener("pointerdown", this.onPointerDown);

    this.animate();
  }

  // Camera Glide Transition Director for the Spacious Sanctuary
  public setStation(station: RoomStation) {
    this.currentStation = station;
    switch (station) {
      case "kitty":
      case "panda":
        this.targetCamPos.set(0, 2.6, 6.4);
        this.targetCamLookAt.set(0, 1.2, 1.0);
        break;
      case "story":
        // Glide smoothly to the rounded study desk & bubble terminal
        this.targetCamPos.set(-5.2, 2.8, 0.0);
        this.targetCamLookAt.set(-8.0, 1.85, -2.8);
        break;
      case "lullaby":
        // Glide smoothly to the organic pebble table & rounded synthesizer
        this.targetCamPos.set(4.8, 2.8, 4.4);
        this.targetCamLookAt.set(7.2, 1.25, 2.5);
        break;
      case "relics":
        // Glide smoothly to the floating zero-gravity relics
        this.targetCamPos.set(0, 3.4, 3.2);
        this.targetCamLookAt.set(0, 2.8, -4.8);
        break;
      case "desktop":
        // Grand panoramic wide-angle perspective framing the entire sanctuary
        this.targetCamPos.set(0, 5.5, 12.5);
        this.targetCamLookAt.set(0, 1.8, 0.5);
        break;
    }
  }

  public moveCatTo(x: number, z: number) {
    const safeX = THREE.MathUtils.clamp(x, this.bounds.minX + 0.8, this.bounds.maxX - 0.8);
    const safeZ = THREE.MathUtils.clamp(z, this.bounds.minZ + 0.8, this.bounds.maxZ - 0.8);
    this.cat.targetPos.set(safeX, 0, safeZ);
    this.cat.animState = "walk";
    this.wanderTimer = -4.0;
  }

  public moveCatBy(dx: number, dz: number) {
    this.moveCatTo(this.cat.group.position.x + dx, this.cat.group.position.z + dz);
  }

  public roamCat() {
    const current = this.cat.group.position;
    const destinations = this.WAYPOINTS.filter(
      (waypoint) => Math.hypot(waypoint.x - current.x, waypoint.z - current.z) > 2.5
    );
    const waypoint = destinations[Math.floor(Math.random() * destinations.length)] || this.WAYPOINTS[0];
    this.moveCatTo(waypoint.x, waypoint.z);
  }

  private pointOnFloor(clientX: number, clientY: number) {
    const rect = this.container.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    this.mouseVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    return this.raycaster.ray.intersectPlane(this.groundPlane, this.groundPoint)?.clone() || null;
  }

  private createSunsetSkyTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#3E4D74");
    grad.addColorStop(0.4, "#C07A84");
    grad.addColorStop(0.75, "#F3A178");
    grad.addColorStop(1, "#FFE4B5");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    return new THREE.CanvasTexture(canvas);
  }

  private createStarryNightTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#040614");
    grad.addColorStop(0.45, "#0B1330");
    grad.addColorStop(1, "#1D2452");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    for (let i = 0; i < 120; i++) {
      const sx = (i * 97 + i * i * 17) % 512;
      const sy = (i * 53 + i * 29) % 210;
      const r = i % 6 === 0 ? 1.6 : 0.9;
      ctx.fillStyle = i % 3 === 0 ? "#FEF3C7" : "#FFFFFF";
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#FEF9C3";
    ctx.beginPath();
    ctx.arc(390, 64, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0B1330";
    ctx.beginPath();
    ctx.arc(398, 59, 17, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  // Day/Night Room Lighting Toggle
  public setLightingTheme(theme: "day" | "night") {
    const skyMat = this.skyPlane.material as THREE.MeshBasicMaterial;
    if (theme === "night") {
      this.ambientLight.color.setHex(0x1a162b);
      this.ambientLight.intensity = 0.45;
      this.hemiLight.color.setHex(0x2d1b4e);
      this.hemiLight.groundColor.setHex(0x0f0b18);
      this.hemiLight.intensity = 0.5;
      this.sunLight.color.setHex(0x5078ff);
      this.sunLight.intensity = 0.65;
      skyMat.map = this.starryNightTex;
      skyMat.color.setHex(0xffffff);
      skyMat.needsUpdate = true;
      this.fairyLightGroup.visible = true;
      this.fairyPointLights.forEach((l) => (l.intensity = 1.4));
      this.deskLampLight.intensity = 3.4;
      this.synthPointLight.intensity = 2.8;
      this.relicsPointLight.intensity = 3.2;
    } else {
      this.ambientLight.color.setHex(0xffeedd);
      this.ambientLight.intensity = 0.9;
      this.hemiLight.color.setHex(0xffe8d6);
      this.hemiLight.groundColor.setHex(0x5a3e28);
      this.hemiLight.intensity = 0.85;
      this.sunLight.color.setHex(0xfff4db);
      this.sunLight.intensity = 2.6;
      skyMat.map = this.sunsetSkyTex;
      skyMat.color.setHex(0xffffff);
      skyMat.needsUpdate = true;
      this.fairyLightGroup.visible = false;
      this.fairyPointLights.forEach((l) => (l.intensity = 0.0));
      this.deskLampLight.intensity = 2.4;
      this.synthPointLight.intensity = 1.6;
      this.relicsPointLight.intensity = 2.2;
    }
  }

  // Build the Spacious, Lively Bedroom with 100% Rounded Furniture
  private buildRoom(): { floor: THREE.Mesh; sky: THREE.Mesh } {
    // 1. Natural Hardwood Floor (Expanded: 28m x 24m)
    const floorGeo = new THREE.PlaneGeometry(28, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xdf9b54,
      roughness: 0.42,
      metalness: 0.08,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Warm Creamy Pastel Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f3,
      roughness: 0.92,
    });

    // Back Wall (28m x 10m)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(28, 10), wallMat);
    backWall.position.set(0, 5, -7);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Left Wall (24m x 10m)
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 10), wallMat);
    leftWall.position.set(-14, 5, 5);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right Accent Wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 10), wallMat);
    rightWall.position.set(14, 5, 5);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);

    // 3. Huge Sunlit Bay Window with Rounded Frame (11m x 5.2m)
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x242834, roughness: 0.4 });
    const windowOuter = new THREE.Mesh(
      createRoundedBox(11.2, 5.4, 0.2, 0.35, 4),
      windowFrameMat
    );
    windowOuter.position.set(0, 5.2, -6.9);
    this.scene.add(windowOuter);

    // Golden Sunset / Starry Night Skyline Backdrop
    const skyMat = new THREE.MeshBasicMaterial({ map: this.sunsetSkyTex, color: 0xffffff });
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(12.5, 6.0), skyMat);
    sky.position.set(0, 5.2, -7.05);
    this.scene.add(sky);

    // Rounded Window Mullions
    const mullionMat = new THREE.MeshStandardMaterial({ color: 0x1f232d });
    [-2.75, 2.75].forEach((x) => {
      const vBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 5.2, 12), mullionMat);
      vBar.position.set(x, 5.2, -6.88);
      this.scene.add(vBar);
    });

    // Padded Window Seat with Rounded Cushion
    const seatMat = new THREE.MeshStandardMaterial({ color: 0xf0ece6, roughness: 0.85 });
    const windowSeat = new THREE.Mesh(
      createRoundedBox(10.8, 0.45, 1.4, 0.18, 3),
      seatMat
    );
    windowSeat.position.set(0, 0.22, -6.2);
    windowSeat.receiveShadow = true;
    this.scene.add(windowSeat);

    // 4. Large Circular Plush Rug in Center (Radius: 4.8m)
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0xfbeae8,
      roughness: 0.95,
      metalness: 0.0,
    });
    const centerRug = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 4.8, 0.025, 48), rugMat);
    centerRug.position.set(0, 0.015, 1.2);
    centerRug.receiveShadow = true;
    this.scene.add(centerRug);

    // Inner concentric ring on the rug for lively styling
    const innerRingMat = new THREE.MeshStandardMaterial({ color: 0xf7d9db, roughness: 0.9 });
    const innerRing = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.028, 48), innerRingMat);
    innerRing.position.set(0, 0.016, 1.2);
    innerRing.receiveShadow = true;
    this.scene.add(innerRing);

    // 5. Cozy Scandinavian Sofa with Pillowy Rounded Cushions (Right Side)
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(7.6, 0, -1.2);
    const sofaFabricMat = new THREE.MeshStandardMaterial({ color: 0xeeece8, roughness: 0.85 });

    // Rounded Sofa Base Mattress
    const sofaBase = new THREE.Mesh(
      createRoundedBox(4.6, 0.8, 2.2, 0.28, 3),
      sofaFabricMat
    );
    sofaBase.position.set(0, 0.4, 0);
    sofaBase.castShadow = true;
    sofaBase.receiveShadow = true;
    sofaGroup.add(sofaBase);

    // Rounded Pillowy Backrest
    const sofaBack = new THREE.Mesh(
      createRoundedBox(4.6, 1.4, 0.65, 0.24, 3),
      sofaFabricMat
    );
    sofaBack.position.set(0, 1.1, -0.78);
    sofaBack.castShadow = true;
    sofaGroup.add(sofaBack);

    // Curved Rounded Armrests
    [-2.1, 2.1].forEach((x) => {
      const arm = new THREE.Mesh(
        createRoundedBox(0.6, 1.05, 2.2, 0.28, 3),
        sofaFabricMat
      );
      arm.position.set(x, 0.62, 0);
      arm.castShadow = true;
      sofaGroup.add(arm);
    });

    // Puffy Rounded Throw Pillows (Teal & Peach)
    const tealPillow = new THREE.Mesh(
      createRoundedBox(0.7, 0.7, 0.25, 0.18, 3),
      new THREE.MeshStandardMaterial({ color: 0x38b2ac, roughness: 0.7 })
    );
    tealPillow.position.set(-1.4, 0.95, -0.35);
    tealPillow.rotation.y = 0.28;
    sofaGroup.add(tealPillow);

    const peachPillow = new THREE.Mesh(
      createRoundedBox(0.65, 0.65, 0.25, 0.18, 3),
      new THREE.MeshStandardMaterial({ color: 0xdd6b20, roughness: 0.7 })
    );
    peachPillow.position.set(1.4, 0.92, -0.35);
    peachPillow.rotation.y = -0.28;
    sofaGroup.add(peachPillow);

    this.scene.add(sofaGroup);

    // 6. Organic Pebble Coffee Table with Rounded Edge (Right-Front)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(7.2, 0, 2.4);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xba793a, roughness: 0.55 });

    // Completely rounded organic tabletop
    const tableTop = new THREE.Mesh(
      createRoundedBox(3.2, 0.14, 1.9, 0.45, 4),
      woodMat
    );
    tableTop.position.set(0, 0.68, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Smooth cylindrical tapered table legs
    const legGeo = new THREE.CylinderGeometry(0.045, 0.035, 0.68, 16);
    [
      [-1.25, 0.34, -0.65],
      [1.25, 0.34, -0.65],
      [-1.25, 0.34, 0.65],
      [1.25, 0.34, 0.65],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      tableGroup.add(leg);
    });

    this.scene.add(tableGroup);

    // 7. Cozy Rounded Beanbag Pouf (Left Rear)
    const beanbagMat = new THREE.MeshStandardMaterial({ color: 0xffb5a7, roughness: 0.88 });
    const beanbagGeo = new THREE.SphereGeometry(1.45, 28, 20);
    beanbagGeo.scale(1.2, 0.65, 1.2);
    const beanbag = new THREE.Mesh(beanbagGeo, beanbagMat);
    beanbag.position.set(-4.5, 0.45, -4.0);
    beanbag.castShadow = true;
    beanbag.receiveShadow = true;
    this.scene.add(beanbag);

    // 8. Rounded Kitten Scratching Tower / Cat Tree (Left-Front)
    const catTreeGroup = new THREE.Group();
    catTreeGroup.position.set(-8.8, 0, 3.8);

    const sisalMat = new THREE.MeshStandardMaterial({ color: 0xd4b886, roughness: 0.9 });
    const plushPlatformMat = new THREE.MeshStandardMaterial({ color: 0xffd1dc, roughness: 0.85 });

    // Round Base Platform
    const treeBase = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.08, 28), plushPlatformMat);
    treeBase.position.y = 0.04;
    treeBase.castShadow = true;
    catTreeGroup.add(treeBase);

    // Sisal Scratching Post
    const sisalPost = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.4, 24), sisalMat);
    sisalPost.position.y = 1.24;
    sisalPost.castShadow = true;
    catTreeGroup.add(sisalPost);

    // Middle Rounded Lounging Platform
    const midPlatform = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.08, 28), plushPlatformMat);
    midPlatform.position.y = 1.35;
    midPlatform.castShadow = true;
    catTreeGroup.add(midPlatform);

    // Top Platform with Doughnut Cushion
    const topPlatform = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.08, 28), plushPlatformMat);
    topPlatform.position.y = 2.44;
    topPlatform.castShadow = true;
    catTreeGroup.add(topPlatform);

    const donutCushion = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.14, 16, 28),
      plushPlatformMat
    );
    donutCushion.rotation.x = Math.PI / 2;
    donutCushion.position.y = 2.52;
    catTreeGroup.add(donutCushion);

    // Dangling Play Ball on Elastic String
    const stringLine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.65, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    stringLine.position.set(0.45, 1.05, 0);
    catTreeGroup.add(stringLine);

    this.danglingBallMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 14),
      new THREE.MeshStandardMaterial({ color: 0xff4081, roughness: 0.5 })
    );
    this.danglingBallMesh.position.set(0.45, 0.72, 0);
    catTreeGroup.add(this.danglingBallMesh);

    this.scene.add(catTreeGroup);

    // 9. Playful Wool Yarn Ball on the Floor
    const yarnGroup = new THREE.Group();
    yarnGroup.position.set(-2.2, 0.22, 2.8);
    const yarnMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.9 });
    const yarnSphere = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 16), yarnMat);
    yarnSphere.castShadow = true;
    yarnGroup.add(yarnSphere);

    // Trailing curved yarn strand
    const yarnCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.15, 0),
      new THREE.Vector3(0.3, -0.2, 0.2),
      new THREE.Vector3(0.65, -0.21, 0.05),
      new THREE.Vector3(0.95, -0.21, 0.35),
    ]);
    const yarnStrand = new THREE.Mesh(
      new THREE.TubeGeometry(yarnCurve, 20, 0.015, 8, false),
      yarnMat
    );
    yarnGroup.add(yarnStrand);
    this.scene.add(yarnGroup);

    // 10. Study Workstation Desk with Rounded Corners (Left Corner)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-8.0, 0, -2.8);

    // Fully rounded curved desktop
    const deskTop = new THREE.Mesh(
      createRoundedBox(3.4, 0.12, 1.8, 0.35, 4),
      woodMat
    );
    deskTop.position.set(0, 1.6, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Smooth cylindrical legs
    const deskLegGeo = new THREE.CylinderGeometry(0.06, 0.05, 1.6, 16);
    [
      [-1.45, 0.8, -0.7],
      [1.45, 0.8, -0.7],
      [-1.45, 0.8, 0.7],
      [1.45, 0.8, 0.7],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(deskLegGeo, woodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Rounded Study Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(0, 0, 0.95);
    const chairSeat = new THREE.Mesh(
      createRoundedBox(1.1, 0.1, 1.0, 0.2, 3),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 })
    );
    chairSeat.position.y = 0.95;
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(
      createRoundedBox(1.0, 0.9, 0.12, 0.2, 3),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.7 })
    );
    chairBack.position.set(0, 1.45, 0.45);
    chairGroup.add(chairBack);

    const chairLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.95, 12),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 })
    );
    chairLeg.position.y = 0.47;
    chairGroup.add(chairLeg);
    deskGroup.add(chairGroup);

    // Cute Rounded Desk Lamp
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.85, 12),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 })
    );
    lampStem.position.set(1.2, 2.05, -0.5);
    deskGroup.add(lampStem);

    // Smooth Dome Lampshade
    const lampShade = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide })
    );
    lampShade.position.set(1.05, 2.45, -0.4);
    lampShade.rotation.z = 0.4;
    deskGroup.add(lampShade);

    this.scene.add(deskGroup);

    // 11. Interactive Potted Rounded Ceramic Planter (Wiggles & plays soft nature chime on click)
    const plantGroup = new THREE.Group();
    plantGroup.position.set(1.2, 0, -4.6);
    this.interactivePlantGroup = plantGroup;

    const potMat = new THREE.MeshStandardMaterial({ color: 0xfff5eb, roughness: 0.35 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 0.95, 24), potMat);
    pot.position.y = 0.48;
    pot.castShadow = true;
    plantGroup.add(pot);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x38a169, roughness: 0.55 });
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const leafStem = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 1.3, 8, 12), leafMat);
      leafStem.position.set(Math.cos(angle) * 0.18, 1.0, Math.sin(angle) * 0.18);
      leafStem.rotation.z = Math.cos(angle) * 0.55;
      leafStem.rotation.x = Math.sin(angle) * 0.55;

      const leafBlade = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 14), leafMat);
      leafBlade.scale.set(1.2, 0.28, 0.9);
      leafBlade.position.set(0, 0.72, 0);
      leafBlade.rotation.y = angle;
      leafStem.add(leafBlade);
      plantGroup.add(leafStem);
    }

    const plantHitbox = new THREE.Mesh(
      new THREE.SphereGeometry(1.1, 12, 12),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    plantHitbox.position.set(0, 1.1, 0);
    plantGroup.add(plantHitbox);
    this.plantHitboxMesh = plantHitbox;
    this.scene.add(plantGroup);

    // 12. Draped Warm Fairy String Lights
    const numFairyLights = 14;
    for (let i = 0; i < numFairyLights; i++) {
      const ratio = i / (numFairyLights - 1);
      const x = -5.0 + ratio * 10.0;
      const sag = Math.sin(ratio * Math.PI) * 0.35;
      const y = 8.1 - sag;
      const z = -6.85;

      const bulbGeo = new THREE.SphereGeometry(0.065, 12, 10);
      const bulbColor = i % 2 === 0 ? 0xffea79 : 0xffa8d8;
      const bulbMat = new THREE.MeshBasicMaterial({ color: bulbColor });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(x, y, z);
      this.fairyLightGroup.add(bulb);
      this.fairyLightMeshes.push(bulb);

      if (i % 4 === 1) {
        const fLight = new THREE.PointLight(bulbColor, 0.0, 6.0);
        fLight.position.set(x, y - 0.1, z + 0.3);
        this.fairyLightGroup.add(fLight);
        this.fairyPointLights.push(fLight);
      }
    }

    return { floor, sky };
  }

  // 3D Station 1: 404 Cyber Story Terminal with Cute Rounded Bubble Silhouette
  private buildStoryTerminalStation() {
    const stationGroup = new THREE.Group();
    stationGroup.position.set(-8.0, 1.66, -2.8);
    stationGroup.userData = { station: "story", name: "404 Story Terminal" };

    // Rounded Terminal Keyboard Base
    const kbBase = new THREE.Mesh(
      createRoundedBox(0.85, 0.05, 0.45, 0.08, 2),
      new THREE.MeshStandardMaterial({ color: 0x1f2430, metalness: 0.6, roughness: 0.3 })
    );
    kbBase.position.set(0, 0.03, 0.3);
    stationGroup.add(kbBase);

    // Retro-Futuristic Bubble Monitor Housing (100% Rounded corners!)
    const bubbleHousing = new THREE.Mesh(
      createRoundedBox(1.15, 0.88, 0.65, 0.24, 4),
      new THREE.MeshStandardMaterial({ color: 0x181c28, metalness: 0.75, roughness: 0.2 })
    );
    bubbleHousing.position.set(0, 0.52, -0.15);
    stationGroup.add(bubbleHousing);

    // Glowing Holographic Display Face
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.95,
      roughness: 0.1,
    });
    this.storyScreenMesh = new THREE.Mesh(
      createRoundedBox(0.92, 0.68, 0.02, 0.12, 3),
      screenMat
    );
    this.storyScreenMesh.position.set(0, 0.52, 0.19);
    stationGroup.add(this.storyScreenMesh);

    // Rotating 3D Holographic Data Rings hovering above screen
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const holoRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.016, 12, 32), ringMat1);
    holoRing1.position.set(0, 1.25, -0.1);
    stationGroup.add(holoRing1);
    this.storyHoloRings.push(holoRing1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff00cc,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const holoRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.014, 12, 28), ringMat2);
    holoRing2.position.set(0, 1.25, -0.1);
    stationGroup.add(holoRing2);
    this.storyHoloRings.push(holoRing2);

    // Floating Stardust Core
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), coreMat);
    coreMesh.position.set(0, 1.25, -0.1);
    stationGroup.add(coreMesh);
    this.storyHoloRings.push(coreMesh);

    // Interactive hitbox
    const hitbox = new THREE.Mesh(
      createRoundedBox(1.8, 2.2, 1.4, 0.2, 2),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    hitbox.position.set(0, 0.9, 0);
    hitbox.userData = { station: "story" };
    stationGroup.add(hitbox);

    this.scene.add(stationGroup);
    this.interactiveStations.push(hitbox);
  }

  // 3D Station 2: Dial-Up Lullaby Synthesizer with Rounded Console & Cylindrical Equalizer
  private buildLullabySynthesizerStation() {
    const synthGroup = new THREE.Group();
    synthGroup.position.set(7.2, 0.76, 2.4);
    synthGroup.userData = { station: "lullaby", name: "Dial-Up Synthesizer" };

    // Rounded Console Chassis (Zero sharp edges)
    const synthBodyMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      metalness: 0.85,
      roughness: 0.2,
    });
    const synthBody = new THREE.Mesh(
      createRoundedBox(2.2, 0.16, 1.2, 0.16, 3),
      synthBodyMat
    );
    synthBody.position.set(0, 0.08, 0);
    synthBody.castShadow = true;
    synthGroup.add(synthBody);

    // Angled Rounded Control Panel Face
    const panel = new THREE.Mesh(
      createRoundedBox(2.0, 0.1, 0.42, 0.08, 2),
      new THREE.MeshStandardMaterial({ color: 0x242838, roughness: 0.35 })
    );
    panel.position.set(0, 0.18, 0.3);
    panel.rotation.x = 0.22;
    synthGroup.add(panel);

    // 10 Interactive Cylindrical Neon Equalizer Bars (Smooth Round Cylinders, NOT sharp boxes!)
    const numBars = 10;
    const spacing = 0.17;
    const startX = -((numBars - 1) * spacing) / 2;

    for (let i = 0; i < numBars; i++) {
      const hue = 0.48 + (i / numBars) * 0.36; // Teal to Purple
      const barColor = new THREE.Color().setHSL(hue, 1.0, 0.55);
      const barMat = new THREE.MeshStandardMaterial({
        color: barColor,
        emissive: barColor,
        emissiveIntensity: 0.9,
        roughness: 0.15,
      });

      // Smooth rounded cylinder bars
      const barGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.5, 16);
      barGeo.translate(0, 0.25, 0); // Origin at base so it scales upward

      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(startX + i * spacing, 0.16, -0.15);
      synthGroup.add(barMesh);
      this.equalizerBars.push(barMesh);
    }

    // Rounded Bevelled Rotary Tuning Knobs
    const knobMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const knobGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.07, 16);
    [-0.75, -0.45, 0.45, 0.75].forEach((x) => {
      const knob = new THREE.Mesh(knobGeo, knobMat);
      knob.position.set(x, 0.26, 0.32);
      synthGroup.add(knob);
    });

    // Glowing Rounded VU Display Bar
    const vuMesh = new THREE.Mesh(
      createRoundedBox(0.4, 0.03, 0.08, 0.02, 2),
      new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    );
    vuMesh.position.set(0, 0.26, 0.32);
    synthGroup.add(vuMesh);

    // Hitbox for raycaster
    const hitbox = new THREE.Mesh(
      createRoundedBox(2.4, 1.4, 1.4, 0.2, 2),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    hitbox.position.set(0, 0.6, 0);
    hitbox.userData = { station: "lullaby" };
    synthGroup.add(hitbox);

    this.scene.add(synthGroup);
    this.interactiveStations.push(hitbox);
  }

  // 3D Station 3: Floating Rescued Relics Orbit in Front of Grand Bay Window
  private buildFloatingRelicsStation() {
    const relicsGroup = new THREE.Group();
    relicsGroup.position.set(0, 2.8, -4.8);
    relicsGroup.userData = { station: "relics", name: "Rescued Relics" };

    // 1. Relic: 3.5" Stardust Floppy Disk with Rounded Corners
    const floppyGroup = new THREE.Group();
    floppyGroup.position.set(-2.0, 0.1, 0);
    floppyGroup.userData = { initialY: 2.9, relicId: "floppy", name: "3.5\" Stardust Floppy" };

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.18,
    });
    const floppyBase = new THREE.Mesh(
      createRoundedBox(0.85, 0.88, 0.06, 0.05, 2),
      goldMat
    );
    floppyGroup.add(floppyBase);

    const shutter = new THREE.Mesh(
      createRoundedBox(0.5, 0.36, 0.07, 0.03, 2),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 })
    );
    shutter.position.set(0, 0.25, 0);
    floppyGroup.add(shutter);
    this.relicMeshes.push(floppyGroup);
    this.scene.add(floppyGroup);

    // 2. Relic: GeoCities 1999 Crystal Prism
    const prismGroup = new THREE.Group();
    prismGroup.position.set(-0.7, 0.7, 0.2);
    prismGroup.userData = { initialY: 3.5, relicId: "geocities", name: "GeoCities 1999 Crystal" };

    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x66ffff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.55,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const prismMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), crystalMat);
    prismGroup.add(prismMesh);
    this.relicMeshes.push(prismGroup);
    this.scene.add(prismGroup);

    // 3. Relic: 56K Modem Baud Ring (Torus Knot)
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0.7, 0.2, 0.1);
    ringGroup.userData = { initialY: 3.0, relicId: "modem", name: "56K Modem Carrier Ring" };

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xff85b8,
      emissive: 0xff3388,
      emissiveIntensity: 0.65,
      metalness: 0.65,
      roughness: 0.2,
    });
    const ringMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.36, 0.09, 64, 16), ringMat);
    ringGroup.add(ringMesh);
    this.relicMeshes.push(ringGroup);
    this.scene.add(ringGroup);

    // 4. Relic: Stardust Archive Sphere
    const stardustGroup = new THREE.Group();
    stardustGroup.position.set(2.0, 0.0, 0);
    stardustGroup.userData = { initialY: 2.8, relicId: "stardust", name: "Stardust Archive Sphere" };

    const starMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.7,
      wireframe: true,
    });
    const starMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 1), starMat);
    stardustGroup.add(starMesh);
    this.relicMeshes.push(stardustGroup);
    this.scene.add(stardustGroup);

    // Interactive hitbox
    const relicHitbox = new THREE.Mesh(
      createRoundedBox(5.5, 2.4, 1.8, 0.3, 2),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    relicHitbox.position.set(0, 3.1, -4.8);
    relicHitbox.userData = { station: "relics" };
    this.scene.add(relicHitbox);
    this.interactiveStations.push(relicHitbox);
  }

  // Floating Sunbeam Dust Particles
  private buildSunbeamDust(): THREE.Points {
    const count = 160;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = Math.random() * 5.5 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffeedd,
      size: 0.08,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  // Celestial Relic Stardust Particles
  private buildRelicStardust(): THREE.Points {
    const count = 100;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 6.0;
      positions[i + 1] = Math.random() * 3.0 + 2.0;
      positions[i + 2] = -4.8 + (Math.random() - 0.5) * 2.0;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xff85b8,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  // Pointer Move Handler for Raycasting 3D Floor Walking in the Spacious Room
  private onPointerMove(e: PointerEvent) {
    const point = this.pointOnFloor(e.clientX, e.clientY);

    // Raycast onto Floor Plane for 3D navigation
    if (
      this.isFollowingCursor &&
      (this.currentStation === "kitty" || this.currentStation === "panda" || this.currentStation === "desktop") &&
      this.cat.animState !== "sleep"
    ) {
      if (point) {
        const clampedX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, point.x));
        const clampedZ = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, point.z));

        const cur = this.cat.group.position;
        const dist = Math.hypot(clampedX - cur.x, clampedZ - cur.z);
        if (dist > 1.1) {
          this.moveCatTo(clampedX, clampedZ);
        }
      }
    }

    // Head & Eye Tracking towards cursor
    const rayPoint = new THREE.Vector3();
    this.raycaster.ray.at(5.5, rayPoint);
    this.cat.lookAtTarget(rayPoint);
  }

  // Pointer Down (Raycast Tap: Cat Poke, Station Selection, or Floor Walk)
  private onPointerDown(e: PointerEvent) {
    const point = this.pointOnFloor(e.clientX, e.clientY);

    // 1. Check if clicked directly on Cat body meshes
    const catHits = this.raycaster.intersectObjects(this.cat.group.children, true);
    if (catHits.length > 0) {
      let partHit = "body";
      let cur: any = catHits[0].object;
      while (cur && cur !== this.cat.group) {
        if (cur.userData && cur.userData.part) {
          partHit = cur.userData.part;
          break;
        }
        cur = cur.parent;
      }

      if (this.onCatPoke) {
        this.onCatPoke(partHit);
        return;
      }
    }

    // 2. Check if clicked on 3D Stations (Story Terminal, Synthesizer, Relics)
    const stationHits = this.raycaster.intersectObjects(this.interactiveStations, true);
    if (stationHits.length > 0) {
      let cur: any = stationHits[0].object;
      while (cur) {
        if (cur.userData && cur.userData.station) {
          const targetStation = cur.userData.station as RoomStation;
          this.setStation(targetStation);
          if (this.onStationClick) {
            this.onStationClick(targetStation);
          }
          return;
        }
        cur = cur.parent;
      }
    }

    // 2.5 Check if clicked on the Interactive 3D Plant
    if (this.plantHitboxMesh) {
      const plantHits = this.raycaster.intersectObject(this.plantHitboxMesh, true);
      if (plantHits.length > 0) {
        this.plantWiggleTimer = 1.35;
        this.playSoftNatureChime();
        return;
      }
    }

    // 3. Otherwise, tap to walk to point on floor
    if (
      point &&
      point.x >= this.bounds.minX && point.x <= this.bounds.maxX &&
      point.z >= this.bounds.minZ && point.z <= this.bounds.maxZ
    ) {
      this.moveCatTo(point.x, point.z);
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
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Camera Glide Interpolation
    const cameraLerp = Math.min(1, delta * 3.6);
    this.camera.position.lerp(this.targetCamPos, cameraLerp);
    this.currentCamLookAt.lerp(this.targetCamLookAt, cameraLerp);
    this.camera.lookAt(this.currentCamLookAt);

    // 2. Animated Cylindrical Equalizer Bars on Synthesizer
    for (let i = 0; i < this.equalizerBars.length; i++) {
      const bar = this.equalizerBars[i];
      const pulse = 0.25 + Math.abs(Math.sin(elapsedTime * 7 + i * 0.75)) * 0.85 + Math.abs(Math.cos(elapsedTime * 11 + i * 1.2)) * 0.35;
      bar.scale.y = pulse;
    }

    // 3. Animated 3D Holographic Data Rings on Story Terminal
    for (let i = 0; i < this.storyHoloRings.length; i++) {
      const ring = this.storyHoloRings[i];
      ring.rotation.x += delta * (0.8 + i * 0.3);
      ring.rotation.y += delta * (1.1 - i * 0.4);
      ring.rotation.z += delta * 0.5;
    }

    // 4. Animated Floating 3D Rescued Relics
    for (let i = 0; i < this.relicMeshes.length; i++) {
      const relic = this.relicMeshes[i];
      relic.rotation.y += delta * (0.6 + i * 0.15);
      relic.rotation.x = Math.sin(elapsedTime * 2.0 + i) * 0.12;
      const initialY = relic.userData.initialY ?? 3.0;
      relic.position.y = initialY + Math.sin(elapsedTime * 2.4 + i * 1.4) * 0.14;
    }

    // 5. Dangling Cat Tree Toy Ball Gentle Pendulum Swing
    if (this.danglingBallMesh) {
      this.danglingBallMesh.position.x = 0.45 + Math.sin(elapsedTime * 2.5) * 0.08;
      this.danglingBallMesh.position.z = Math.cos(elapsedTime * 2.0) * 0.08;
    }

    // 5.5 Interactive Plant Wiggle Animation
    if (this.interactivePlantGroup) {
      const idleSway = Math.sin(elapsedTime * 1.8) * 0.03;
      if (this.plantWiggleTimer > 0) {
        this.plantWiggleTimer = Math.max(0, this.plantWiggleTimer - delta);
        const env = this.plantWiggleTimer / 1.35;
        this.interactivePlantGroup.rotation.z = idleSway + Math.sin((1.35 - this.plantWiggleTimer) * 26.0) * env * 0.24;
        this.interactivePlantGroup.rotation.x = Math.cos((1.35 - this.plantWiggleTimer) * 22.0) * env * 0.16;
      } else {
        this.interactivePlantGroup.rotation.z = idleSway;
        this.interactivePlantGroup.rotation.x = 0;
      }
    }

    // 6. Move Cat smoothly in 3D towards targetPos with Rounded Obstacle Collisions
    if (this.cat.animState === "walk") {
      const cur = this.cat.group.position;
      const target = this.cat.targetPos;

      const dx = target.x - cur.x;
      const dz = target.z - cur.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.15) {
        // Rotate smoothly towards walking direction
        const angle = Math.atan2(dx, dz);
        let diff = angle - this.cat.group.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.cat.group.rotation.y += diff * 0.12;

        const step = Math.min(dist, delta * this.cat.walkSpeed * 0.95);
        const nextX = cur.x + (dx / dist) * step;
        const nextZ = cur.z + (dz / dist) * step;

        const catRadius = 0.62;
        let hitObstacle: Obstacle3D | null = null;
        let pushX = 0;
        let pushZ = 0;

        // Check room boundaries
        if (nextX < this.bounds.minX) {
          hitObstacle = { id: "wall_left", name: "Wall", minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
          pushX = 0.4;
        } else if (nextX > this.bounds.maxX) {
          hitObstacle = { id: "wall_right", name: "Wall", minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
          pushX = -0.4;
        } else if (nextZ < this.bounds.minZ) {
          hitObstacle = { id: "window", name: "Window Sill", minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
          pushZ = 0.4;
        } else if (nextZ > this.bounds.maxZ) {
          hitObstacle = { id: "wall_front", name: "Room Edge", minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
          pushZ = -0.4;
        }

        // Check 3D Furniture Obstacles with Rounded Margins
        if (!hitObstacle) {
          for (const obs of this.obstacles) {
            if (obs.isCircle && obs.centerX !== undefined && obs.centerZ !== undefined && obs.radius) {
              const ox = nextX - obs.centerX;
              const oz = nextZ - obs.centerZ;
              const d = Math.sqrt(ox * ox + oz * oz);
              if (d < obs.radius + catRadius) {
                hitObstacle = obs;
                pushX = (ox / d) * 0.45;
                pushZ = (oz / d) * 0.45;
                break;
              }
            } else {
              if (
                nextX >= obs.minX - catRadius &&
                nextX <= obs.maxX + catRadius &&
                nextZ >= obs.minZ - catRadius &&
                nextZ <= obs.maxZ + catRadius
              ) {
                hitObstacle = obs;
                const dLeft = Math.abs(nextX - (obs.minX - catRadius));
                const dRight = Math.abs(nextX - (obs.maxX + catRadius));
                const dTop = Math.abs(nextZ - (obs.minZ - catRadius));
                const dBottom = Math.abs(nextZ - (obs.maxZ + catRadius));
                const minD = Math.min(dLeft, dRight, dTop, dBottom);
                if (minD === dLeft) pushX = -0.45;
                else if (minD === dRight) pushX = 0.45;
                else if (minD === dTop) pushZ = -0.45;
                else pushZ = 0.45;
                break;
              }
            }
          }
        }

        if (hitObstacle) {
          // BUMP: safely bounce back from obstacle with rounded soft push
          cur.x += pushX;
          cur.z += pushZ;
          target.copy(cur);
          this.cat.animState = "bump";

          if (this.onCatBump) {
            this.onCatBump(hitObstacle.name);
          }

          setTimeout(() => {
            if (this.cat.animState === "bump") {
              this.cat.animState = "idle";
            }
          }, 850);
        } else {
          cur.x = nextX;
          cur.z = nextZ;
        }
      } else {
        // Destination reached! Playfully express kitten joy
        const roll = Math.random();
        if (roll < 0.25) {
          this.cat.animState = "wave";
          setTimeout(() => {
            if (this.cat.animState === "wave") this.cat.animState = "idle";
          }, 1400);
        } else if (roll < 0.50) {
          this.cat.animState = "purr";
          setTimeout(() => {
            if (this.cat.animState === "purr") this.cat.animState = "idle";
          }, 1800);
        } else if (roll < 0.70) {
          this.cat.animState = "pout";
          setTimeout(() => {
            if (this.cat.animState === "pout") this.cat.animState = "idle";
          }, 1000);
        } else {
          this.cat.animState = "sit";
          setTimeout(() => {
            if (this.cat.animState === "sit") this.cat.animState = "idle";
          }, 2400);
        }
        this.wanderTimer = 0;
        this.nextWanderInterval = 3.5 + Math.random() * 3.5;
      }
    } else if (this.cat.animState === "idle") {
      // Autonomous curiosity wandering engine across spacious rounded room
      this.wanderTimer += delta;
      if (this.wanderTimer >= this.nextWanderInterval) {
        this.wanderTimer = 0;
        this.nextWanderInterval = 3.5 + Math.random() * 3.5;

        const cur = this.cat.group.position;
        const candidates = this.WAYPOINTS.filter(
          (wp) => Math.hypot(wp.x - cur.x, wp.z - cur.z) > 2.0
        );
        const chosen =
          candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : this.WAYPOINTS[Math.floor(Math.random() * this.WAYPOINTS.length)];

        this.cat.targetPos.copy(chosen);
        this.cat.animState = "walk";
      }
    }

    // 7. Update Cat's 3D internal animations
    this.cat.update(delta);

    // 8. Gentle dust particle drift
    if (this.dustPoints) {
      const pos = this.dustPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= delta * 0.1;
        if (pos[i] < 0.2) pos[i] = 5.5;
      }
      this.dustPoints.geometry.attributes.position.needsUpdate = true;
    }

    // 9. Relic Stardust gentle float
    if (this.relicDustPoints) {
      const pos = this.relicDustPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += Math.sin(elapsedTime * 2 + i) * 0.003;
      }
      this.relicDustPoints.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
    this.animId = requestAnimationFrame(this.animate);
  }

  private playSoftNatureChime() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
      const t0 = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t0 + idx * 0.065);
        gain.gain.setValueAtTime(0.001, t0 + idx * 0.065);
        gain.gain.linearRampToValueAtTime(0.14, t0 + idx * 0.065 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + idx * 0.065 + 0.75);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0 + idx * 0.065);
        osc.stop(t0 + idx * 0.065 + 0.8);
      });
    } catch {
      // Ignore audio context errors
    }
  }

  public dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.onWindowResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.dispose();
  }
}
