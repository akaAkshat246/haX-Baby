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

export class Room3DScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cat: Cat3DModel;

  // Compatibility getter
  public get panda() {
    return this.cat;
  }

  // Camera Director System
  public targetCamPos: THREE.Vector3 = new THREE.Vector3(0, 2.2, 5.0);
  public targetCamLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.2, 0.9);
  public currentCamLookAt: THREE.Vector3 = new THREE.Vector3(0, 1.6, 0);
  public currentStation: RoomStation = "kitty";

  private floorPlane: THREE.Mesh;
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;
  private container: HTMLElement;
  private animId: number | null = null;
  private clock: THREE.Clock;

  // Lighting elements for Day/Night toggle
  private ambientLight: THREE.AmbientLight;
  private hemiLight: THREE.HemisphereLight;
  private sunLight: THREE.DirectionalLight;
  private deskLampLight: THREE.PointLight;
  private synthPointLight: THREE.PointLight;
  private relicsPointLight: THREE.PointLight;
  private skyPlane: THREE.Mesh;

  // Particle systems
  private dustPoints: THREE.Points;
  private relicDustPoints: THREE.Points;

  // 3D Station Meshes
  private storyHoloRings: THREE.Mesh[] = [];
  private storyScreenMesh?: THREE.Mesh;
  private equalizerBars: THREE.Mesh[] = [];
  private relicMeshes: THREE.Object3D[] = [];
  private interactiveStations: THREE.Object3D[] = [];

  // Walkable Floor 3D Boundaries
  public bounds = {
    minX: -4.8,
    maxX: 4.8,
    minZ: -2.3, // near the window
    maxZ: 4.2,  // foreground near camera
  };

  // 3D Furniture Obstacles for realistic bumping physics
  public obstacles: Obstacle3D[] = [
    {
      id: "sofa",
      name: "Comfy Sofa",
      minX: 2.2,
      maxX: 6.2,
      minZ: -1.8,
      maxZ: 0.2,
    },
    {
      id: "coffee_table",
      name: "Coffee Table",
      minX: 2.4,
      maxX: 5.2,
      minZ: 0.65,
      maxZ: 2.15,
    },
    {
      id: "study_desk",
      name: "Study Desk",
      minX: -6.0,
      maxX: -3.2,
      minZ: -2.1,
      maxZ: -0.3,
    },
    {
      id: "beanbag",
      name: "Cozy Beanbag",
      isCircle: true,
      centerX: -1.8,
      centerZ: -1.8,
      radius: 1.25,
      minX: -3.05,
      maxX: -0.55,
      minZ: -3.05,
      maxZ: -0.55,
    },
  ];

  public isFollowingCursor: boolean = true;
  public onCatPoke?: (part: string) => void;
  public onCatBump?: (obstacleName: string) => void;
  public onStationClick?: (station: RoomStation) => void;

  // Compatibility aliases
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

    // 1. Camera setup with cinematic lens
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    this.camera.position.set(0, 2.2, 5.0);
    this.camera.lookAt(0, 1.2, 0.9);
    this.currentCamLookAt.set(0, 1.2, 0.9);

    // 2. WebGL Renderer with High-End Lighting & Soft Shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // 3. Lighting: Warm Afternoon Sunlight + Cozy Indoor Glow
    this.ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xffe4b5, 0x4a2e18, 0.75);
    this.scene.add(this.hemiLight);

    // Main Directional Sunlight pouring in from window (top-left)
    this.sunLight = new THREE.DirectionalLight(0xfff0d0, 2.4);
    this.sunLight.position.set(-6, 9, -2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.camera.left = -8;
    this.sunLight.shadow.camera.right = 8;
    this.sunLight.shadow.camera.top = 8;
    this.sunLight.shadow.camera.bottom = -8;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Cozy Desk Lamp Point Light
    this.deskLampLight = new THREE.PointLight(0xffaa44, 2.2, 8);
    this.deskLampLight.position.set(-4.2, 2.9, -1.8);
    this.scene.add(this.deskLampLight);

    // Neon Synthesizer Accent Light
    this.synthPointLight = new THREE.PointLight(0x00f0ff, 1.4, 5);
    this.synthPointLight.position.set(3.8, 1.5, 1.4);
    this.scene.add(this.synthPointLight);

    // Celestial Relics Point Light
    this.relicsPointLight = new THREE.PointLight(0xff85b8, 2.0, 7);
    this.relicsPointLight.position.set(0, 3.2, -2.0);
    this.scene.add(this.relicsPointLight);

    // 4. Build 3D Room Environment
    const room = this.buildRoom();
    this.floorPlane = room.floor;
    this.skyPlane = room.sky;

    // 5. Add 3D Interactive Stations
    this.buildStoryTerminalStation();
    this.buildLullabySynthesizerStation();
    this.buildFloatingRelicsStation();

    // 6. Add Cute 3D Kitten Model
    this.cat = new Cat3DModel();
    this.cat.group.position.set(0, 0, 1.2);
    this.scene.add(this.cat.group);

    // 7. Floating Sunbeam Dust Particles
    this.dustPoints = this.buildSunbeamDust();
    this.scene.add(this.dustPoints);

    // 8. Celestial Relic Stardust Particles
    this.relicDustPoints = this.buildRelicStardust();
    this.scene.add(this.relicDustPoints);

    // Bind event handlers
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener("resize", this.onWindowResize);
    this.container.addEventListener("pointermove", this.onPointerMove);
    this.container.addEventListener("pointerdown", this.onPointerDown);

    this.animate();
  }

  // Camera Glide Transition Director
  public setStation(station: RoomStation) {
    this.currentStation = station;
    switch (station) {
      case "kitty":
      case "panda":
        this.targetCamPos.set(0, 2.2, 5.0);
        this.targetCamLookAt.set(0, 1.2, 0.9);
        break;
      case "story":
        // Cinematic Glide to Study Desk & Glowing 3D Story Terminal
        this.targetCamPos.set(-2.8, 2.4, 1.4);
        this.targetCamLookAt.set(-4.6, 1.85, -1.2);
        break;
      case "lullaby":
        // Cinematic Glide to Coffee Table Synthesizer & WebGL Equalizer
        this.targetCamPos.set(2.4, 2.4, 3.2);
        this.targetCamLookAt.set(3.8, 1.2, 1.4);
        break;
      case "relics":
        // Cinematic Glide to Floating Relics in front of Bay Window
        this.targetCamPos.set(0, 3.0, 5.2);
        this.targetCamLookAt.set(0, 2.4, -2.4);
        break;
      case "desktop":
        // Panoramic Wide-Angle Vantage Point of the full sanctuary
        this.targetCamPos.set(0, 3.8, 8.5);
        this.targetCamLookAt.set(0, 1.6, 0);
        break;
    }
  }

  // Day/Night Room Lighting Toggle
  public setLightingTheme(theme: "day" | "night") {
    if (theme === "night") {
      this.ambientLight.color.setHex(0x1a162b);
      this.ambientLight.intensity = 0.55;
      this.hemiLight.color.setHex(0x2d1b4e);
      this.hemiLight.groundColor.setHex(0x0f0b18);
      this.sunLight.color.setHex(0x5078ff);
      this.sunLight.intensity = 0.8;
      (this.skyPlane.material as THREE.MeshBasicMaterial).color.setHex(0x090514);
      this.deskLampLight.intensity = 3.2;
      this.synthPointLight.intensity = 2.6;
      this.relicsPointLight.intensity = 3.0;
    } else {
      this.ambientLight.color.setHex(0xffeedd);
      this.ambientLight.intensity = 0.85;
      this.hemiLight.color.setHex(0xffe4b5);
      this.hemiLight.groundColor.setHex(0x4a2e18);
      this.sunLight.color.setHex(0xfff0d0);
      this.sunLight.intensity = 2.4;
      (this.skyPlane.material as THREE.MeshBasicMaterial).color.setHex(0xffe8d6);
      this.deskLampLight.intensity = 2.2;
      this.synthPointLight.intensity = 1.4;
      this.relicsPointLight.intensity = 2.0;
    }
  }

  // Build the Cozy Modern Sunlit Bedroom
  private buildRoom(): { floor: THREE.Mesh; sky: THREE.Mesh } {
    // 1. Natural Hardwood Floor (Golden Oak)
    const floorGeo = new THREE.PlaneGeometry(16, 14);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xdf9b54,
      roughness: 0.45,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Cozy Pastel Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7,
      roughness: 0.9,
    });

    // Back Wall with Grand Window
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), wallMat);
    backWall.position.set(0, 4, -4);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), wallMat);
    leftWall.position.set(-8, 4, 3);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // 3. Grand Sunlit Bay Window overlooking city skyline
    const windowFrameGeo = new THREE.BoxGeometry(6.4, 4.4, 0.18);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.5 });
    const windowFrame = new THREE.Mesh(windowFrameGeo, frameMat);
    windowFrame.position.set(0, 4.2, -3.92);
    this.scene.add(windowFrame);

    // Sky Backdrop Plane behind window
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xffe8d6,
    });
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 4.8), skyMat);
    sky.position.set(0, 4.2, -4.05);
    this.scene.add(sky);

    // Window Divider Bars
    const barMat = new THREE.MeshStandardMaterial({ color: 0x1a202c });
    const vertBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.2, 0.2), barMat);
    vertBar.position.set(0, 4.2, -3.9);
    this.scene.add(vertBar);

    const horizBar = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.08, 0.2), barMat);
    horizBar.position.set(0, 4.2, -3.9);
    this.scene.add(horizBar);

    // 4. Cozy Scandinavian Sofa (Right Side)
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(4.2, 0, -0.8);
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0xeeece8, roughness: 0.85 });

    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.75, 1.8), sofaMat);
    sofaBase.position.set(0, 0.38, 0);
    sofaBase.castShadow = true;
    sofaBase.receiveShadow = true;
    sofaGroup.add(sofaBase);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.3, 0.45), sofaMat);
    sofaBack.position.set(0, 1.02, -0.68);
    sofaBack.castShadow = true;
    sofaGroup.add(sofaBack);

    const armGeo = new THREE.BoxGeometry(0.38, 0.95, 1.8);
    const leftArm = new THREE.Mesh(armGeo, sofaMat);
    leftArm.position.set(-1.62, 0.58, 0);
    leftArm.castShadow = true;
    sofaGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, sofaMat);
    rightArm.position.set(1.62, 0.58, 0);
    rightArm.castShadow = true;
    sofaGroup.add(rightArm);

    // Throw Pillows
    const tealPillow = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x38b2ac, roughness: 0.7 })
    );
    tealPillow.position.set(-1.1, 0.85, -0.35);
    tealPillow.rotation.y = 0.25;
    sofaGroup.add(tealPillow);

    const ochrePillow = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xdd6b20, roughness: 0.7 })
    );
    ochrePillow.position.set(1.1, 0.82, -0.35);
    ochrePillow.rotation.y = -0.25;
    sofaGroup.add(ochrePillow);

    this.scene.add(sofaGroup);

    // 5. Wooden Coffee Table
    const tableGroup = new THREE.Group();
    tableGroup.position.set(3.8, 0, 1.4);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xba793a, roughness: 0.6 });

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.3), woodMat);
    tableTop.position.set(0, 0.65, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 12);
    [
      [-1.05, 0.32, -0.5],
      [1.05, 0.32, -0.5],
      [-1.05, 0.32, 0.5],
      [1.05, 0.32, 0.5],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, woodMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      tableGroup.add(leg);
    });

    this.scene.add(tableGroup);

    // 6. Cozy Beanbag Cushion
    const beanbagGeo = new THREE.SphereGeometry(1.25, 24, 18);
    beanbagGeo.scale(1.2, 0.65, 1.2);
    const beanbagMat = new THREE.MeshStandardMaterial({ color: 0xffb5a7, roughness: 0.9 });
    const beanbag = new THREE.Mesh(beanbagGeo, beanbagMat);
    beanbag.position.set(-1.8, 0.38, -1.8);
    beanbag.castShadow = true;
    beanbag.receiveShadow = true;
    this.scene.add(beanbag);

    // 7. Potted Plant
    const plantGroup = new THREE.Group();
    plantGroup.position.set(0.6, 0, -3.2);

    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.3, 0.85, 18),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    pot.position.y = 0.42;
    pot.castShadow = true;
    plantGroup.add(pot);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x276749, roughness: 0.45, side: THREE.DoubleSide });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const leafStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 1.4, 8), leafMat);
      leafStem.position.set(Math.cos(angle) * 0.15, 0.9, Math.sin(angle) * 0.15);
      leafStem.rotation.z = Math.cos(angle) * 0.5;
      leafStem.rotation.x = Math.sin(angle) * 0.5;

      const leafBlade = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.85, 5), leafMat);
      leafBlade.position.set(0, 0.7, 0);
      leafBlade.rotation.y = angle;
      leafStem.add(leafBlade);
      plantGroup.add(leafStem);
    }
    this.scene.add(plantGroup);

    // 8. Minimalist Study Desk
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-4.6, 0, -1.2);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.4), woodMat);
    deskTop.position.set(0, 1.6, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

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

    // Desk Lamp
    const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7 }));
    lampStem.position.set(0.8, 2.1, -0.4);
    deskGroup.add(lampStem);

    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.32, 16), new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.6 }));
    lampShade.position.set(0.65, 2.5, -0.3);
    lampShade.rotation.z = 0.5;
    deskGroup.add(lampShade);

    this.scene.add(deskGroup);

    return { floor, sky };
  }

  // 3D Station 1: 404 Cyber Story Terminal on Study Desk
  private buildStoryTerminalStation() {
    const stationGroup = new THREE.Group();
    stationGroup.position.set(-4.6, 1.65, -1.2);
    stationGroup.userData = { station: "story", name: "404 Story Terminal" };

    // Terminal Base & Keyboard
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1f2430, metalness: 0.7, roughness: 0.3 });
    const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.4), baseMat);
    kbMesh.position.set(0, 0.02, 0.18);
    stationGroup.add(kbMesh);

    // Retro-Futuristic Terminal Display Housing
    const monitorHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.65, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x161922, metalness: 0.8, roughness: 0.25 })
    );
    monitorHousing.position.set(0, 0.42, -0.15);
    stationGroup.add(monitorHousing);

    // Glowing Holographic Screen
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00c4e6,
      emissiveIntensity: 0.9,
      roughness: 0.15,
    });
    this.storyScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.52), screenMat);
    this.storyScreenMesh.position.set(0, 0.42, -0.05);
    stationGroup.add(this.storyScreenMesh);

    // Rotating 3D Holographic Data Rings hovering above screen
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const holoRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.015, 12, 32), ringMat1);
    holoRing1.position.set(0, 0.95, -0.1);
    stationGroup.add(holoRing1);
    this.storyHoloRings.push(holoRing1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff00cc,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const holoRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.012, 12, 28), ringMat2);
    holoRing2.position.set(0, 0.95, -0.1);
    stationGroup.add(holoRing2);
    this.storyHoloRings.push(holoRing2);

    // Floating Stardust Core inside Hologram
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.12), coreMat);
    coreMesh.position.set(0, 0.95, -0.1);
    stationGroup.add(coreMesh);
    this.storyHoloRings.push(coreMesh);

    // Click hitbox
    const hitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitbox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 1.2), hitboxMat);
    hitbox.position.set(0, 0.8, 0);
    hitbox.userData = { station: "story" };
    stationGroup.add(hitbox);

    this.scene.add(stationGroup);
    this.interactiveStations.push(hitbox);
  }

  // 3D Station 2: Dial-Up Lullaby Synthesizer on Coffee Table
  private buildLullabySynthesizerStation() {
    const synthGroup = new THREE.Group();
    synthGroup.position.set(3.8, 0.72, 1.4);
    synthGroup.userData = { station: "lullaby", name: "Dial-Up Synthesizer" };

    // Synthesizer Console Chassis
    const synthBodyMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      metalness: 0.85,
      roughness: 0.2,
    });
    const synthBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.85), synthBodyMat);
    synthBody.position.set(0, 0.06, 0);
    synthBody.castShadow = true;
    synthGroup.add(synthBody);

    // Angled Front Face
    const synthFace = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.08, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x242838, roughness: 0.4 })
    );
    synthFace.position.set(0, 0.14, 0.2);
    synthFace.rotation.x = 0.2;
    synthGroup.add(synthFace);

    // Interactive 3D WebGL Equalizer Frequency Bars (10 Bars)
    const barWidth = 0.08;
    const barDepth = 0.08;
    const numBars = 10;
    const spacing = 0.13;
    const startX = -((numBars - 1) * spacing) / 2;

    for (let i = 0; i < numBars; i++) {
      const hue = 0.5 + (i / numBars) * 0.35; // Teal -> Purple gradient
      const barColor = new THREE.Color().setHSL(hue, 1.0, 0.55);
      const barMat = new THREE.MeshStandardMaterial({
        color: barColor,
        emissive: barColor,
        emissiveIntensity: 0.85,
        roughness: 0.2,
      });

      const barGeo = new THREE.BoxGeometry(barWidth, 0.5, barDepth);
      barGeo.translate(0, 0.25, 0); // Origin at base so it scales upward

      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(startX + i * spacing, 0.12, -0.12);
      synthGroup.add(barMesh);
      this.equalizerBars.push(barMesh);
    }

    // Rotary Tuning Knobs
    const knobMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const knobGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16);
    [-0.55, -0.35, 0.35, 0.55].forEach((x) => {
      const knob = new THREE.Mesh(knobGeo, knobMat);
      knob.position.set(x, 0.22, 0.22);
      synthGroup.add(knob);
    });

    // Glowing VU Level Display Glass
    const vuMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.8 });
    const vuMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.06), vuMat);
    vuMesh.position.set(0, 0.22, 0.22);
    synthGroup.add(vuMesh);

    // Hitbox for raycaster
    const hitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitbox = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.2), hitboxMat);
    hitbox.position.set(0, 0.5, 0);
    hitbox.userData = { station: "lullaby" };
    synthGroup.add(hitbox);

    this.scene.add(synthGroup);
    this.interactiveStations.push(hitbox);
  }

  // 3D Station 3: Floating Rescued Relics Orbit in front of Bay Window
  private buildFloatingRelicsStation() {
    const relicsGroup = new THREE.Group();
    relicsGroup.position.set(0, 2.5, -2.4);
    relicsGroup.userData = { station: "relics", name: "Rescued Relics" };

    // 1. Relic: Golden Floppy Disk (3.5")
    const floppyGroup = new THREE.Group();
    floppyGroup.position.set(-1.6, 0.1, 0);
    floppyGroup.userData = { initialY: 2.6, relicId: "floppy", name: "3.5\" Stardust Floppy" };

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.2,
    });
    const floppyBase = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.75, 0.06), goldMat);
    floppyGroup.add(floppyBase);

    // Floppy metal slider
    const shutter = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.32, 0.07),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 })
    );
    shutter.position.set(0, 0.22, 0);
    floppyGroup.add(shutter);
    this.relicMeshes.push(floppyGroup);
    this.scene.add(floppyGroup);

    // 2. Relic: GeoCities 1999 Crystal Prism (Octahedron)
    const prismGroup = new THREE.Group();
    prismGroup.position.set(-0.55, 0.6, 0.2);
    prismGroup.userData = { initialY: 3.1, relicId: "geocities", name: "GeoCities 1999 Crystal" };

    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x66ffff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.5,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const prismMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.48), crystalMat);
    prismGroup.add(prismMesh);
    this.relicMeshes.push(prismGroup);
    this.scene.add(prismGroup);

    // 3. Relic: 56K Modem Baud Ring (Torus Knot)
    const ringGroup = new THREE.Group();
    ringGroup.position.set(0.55, 0.2, 0.1);
    ringGroup.userData = { initialY: 2.7, relicId: "modem", name: "56K Modem Carrier Ring" };

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xff85b8,
      emissive: 0xff3388,
      emissiveIntensity: 0.6,
      metalness: 0.6,
      roughness: 0.25,
    });
    const ringMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.32, 0.08, 64, 16), ringMat);
    ringGroup.add(ringMesh);
    this.relicMeshes.push(ringGroup);
    this.scene.add(ringGroup);

    // 4. Relic: Lost Stardust Sphere (Icosahedron)
    const stardustGroup = new THREE.Group();
    stardustGroup.position.set(1.6, 0.0, 0);
    stardustGroup.userData = { initialY: 2.5, relicId: "stardust", name: "Stardust Archive Sphere" };

    const starMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.65,
      wireframe: true,
    });
    const starMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), starMat);
    stardustGroup.add(starMesh);
    this.relicMeshes.push(stardustGroup);
    this.scene.add(stardustGroup);

    // Broad clickable hitbox for relics
    const relicHitbox = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 2.0, 1.5),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    relicHitbox.position.set(0, 2.7, -2.4);
    relicHitbox.userData = { station: "relics" };
    this.scene.add(relicHitbox);
    this.interactiveStations.push(relicHitbox);
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

  // Celestial Relic Stardust Particles
  private buildRelicStardust(): THREE.Points {
    const count = 80;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4.5;
      positions[i + 1] = Math.random() * 2.5 + 1.8;
      positions[i + 2] = -2.4 + (Math.random() - 0.5) * 1.5;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xff85b8,
      size: 0.09,
      transparent: true,
      opacity: 0.8,
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

    // 1. Raycast onto Floor Plane for 3D navigation (only when in kitty/desktop station)
    if (
      this.isFollowingCursor &&
      (this.currentStation === "kitty" || this.currentStation === "panda" || this.currentStation === "desktop") &&
      this.cat.animState !== "sleep" &&
      this.cat.animState !== "sit"
    ) {
      const hits = this.raycaster.intersectObject(this.floorPlane);
      if (hits.length > 0) {
        const point = hits[0].point;
        const clampedX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, point.x));
        const clampedZ = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, point.z));
        this.cat.targetPos.set(clampedX, 0, clampedZ);
      }
    }

    // 2. Head & Eye Tracking towards 3D cursor ray
    const rayPoint = new THREE.Vector3();
    this.raycaster.ray.at(5.5, rayPoint);
    this.cat.lookAtTarget(rayPoint);
  }

  // Pointer Down (Raycast Tap: Cat Poke, Station Selection, or Floor Walk)
  private onPointerDown(e: PointerEvent) {
    const rect = this.container.getBoundingClientRect();
    this.mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);

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

    // 3. Otherwise, tap to walk to point on floor
    const hits = this.raycaster.intersectObject(this.floorPlane);
    if (hits.length > 0) {
      const point = hits[0].point;
      const clampedX = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, point.x));
      const clampedZ = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, point.z));
      this.cat.targetPos.set(clampedX, 0, clampedZ);
      if (this.cat.animState !== "walk" && this.cat.animState !== "dance") {
        this.cat.animState = "walk";
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
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Camera Glide Interpolation
    const cameraLerp = Math.min(1, delta * 3.6);
    this.camera.position.lerp(this.targetCamPos, cameraLerp);
    this.currentCamLookAt.lerp(this.targetCamLookAt, cameraLerp);
    this.camera.lookAt(this.currentCamLookAt);

    // 2. Animated WebGL Equalizer Bars on Synthesizer
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
      const initialY = relic.userData.initialY ?? 2.5;
      relic.position.y = initialY + Math.sin(elapsedTime * 2.4 + i * 1.4) * 0.12;
    }

    // 5. Move Cat smoothly in 3D towards targetPos
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

        // Proposed next step in 3D
        const step = Math.min(dist, delta * this.cat.walkSpeed * 0.95);
        const nextX = cur.x + (dx / dist) * step;
        const nextZ = cur.z + (dz / dist) * step;

        // Collision Check against all obstacles (Cat radius = 0.62)
        const catRadius = 0.62;
        let hitObstacle: Obstacle3D | null = null;
        let pushX = 0;
        let pushZ = 0;

        // Check room boundaries
        if (nextX < this.bounds.minX) {
          hitObstacle = { id: "wall_left", name: "Wall", minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
          pushX = 0.35;
        } else if (nextX > this.bounds.maxX) {
          hitObstacle = { id: "wall_right", name: "Wall", minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
          pushX = -0.35;
        } else if (nextZ < this.bounds.minZ) {
          hitObstacle = { id: "window", name: "Window Glass", minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
          pushZ = 0.35;
        } else if (nextZ > this.bounds.maxZ) {
          hitObstacle = { id: "wall_front", name: "Edge of Room", minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
          pushZ = -0.35;
        }

        // Check 3D Furniture Obstacles
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
          // BUMP! Never walk inside the obstacle, bounce back
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
          // Clean safe step
          cur.x = nextX;
          cur.z = nextZ;
        }
      } else {
        // Arrived at target
        this.cat.animState = "idle";
      }
    }

    // 6. Update Cat's 3D internal animations
    this.cat.update(delta);

    // 7. Gentle dust particle drift
    if (this.dustPoints) {
      const pos = this.dustPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= delta * 0.1;
        if (pos[i] < 0.2) pos[i] = 4.5;
      }
      this.dustPoints.geometry.attributes.position.needsUpdate = true;
    }

    // 8. Relic Stardust gentle float
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

  public dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener("resize", this.onWindowResize);
    this.container.removeEventListener("pointermove", this.onPointerMove);
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.dispose();
  }
}
