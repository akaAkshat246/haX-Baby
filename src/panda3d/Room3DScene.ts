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

export class Room3DScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cat: Cat3DModel;

  // Compatibility getter so existing hooks don't break
  public get panda() {
    return this.cat;
  }

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

    // 5. Add Cute 3D Kitten Model
    this.cat = new Cat3DModel();
    this.cat.group.position.set(0, 0, 1.2);
    this.scene.add(this.cat.group);

    // 6. Floating Sunbeam Dust Particles
    this.dustPoints = this.buildSunbeamDust();
    this.scene.add(this.dustPoints);

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

  // Build the Cozy Modern Sunlit Bedroom
  private buildRoom(): THREE.Mesh {
    // 1. Natural Hardwood Floor (Golden Oak)
    const floorGeo = new THREE.PlaneGeometry(16, 14);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xdf9b54, // warm golden oak wood
      roughness: 0.45,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Cozy Pastel Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7, // warm creamy white
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
      color: 0xffe8d6, // warm morning golden hour glow
    });
    const skyPlane = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 4.8), skyMat);
    skyPlane.position.set(0, 4.2, -4.05);
    this.scene.add(skyPlane);

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

    // Sofa Base Cushion
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.75, 1.8), sofaMat);
    sofaBase.position.set(0, 0.38, 0);
    sofaBase.castShadow = true;
    sofaBase.receiveShadow = true;
    sofaGroup.add(sofaBase);

    // Sofa Backrest
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.3, 0.45), sofaMat);
    sofaBack.position.set(0, 1.02, -0.68);
    sofaBack.castShadow = true;
    sofaGroup.add(sofaBack);

    // Sofa Armrests
    const armGeo = new THREE.BoxGeometry(0.38, 0.95, 1.8);
    const leftArm = new THREE.Mesh(armGeo, sofaMat);
    leftArm.position.set(-1.62, 0.58, 0);
    leftArm.castShadow = true;
    sofaGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, sofaMat);
    rightArm.position.set(1.62, 0.58, 0);
    rightArm.castShadow = true;
    sofaGroup.add(rightArm);

    // Colorful Throw Pillows (Teal & Ochre)
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

    // 5. Wooden Coffee Table with Kitten Milk Saucer
    const tableGroup = new THREE.Group();
    tableGroup.position.set(3.8, 0, 1.4);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xba793a, roughness: 0.6 });

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.3), woodMat);
    tableTop.position.set(0, 0.65, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Table Legs
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

    // Milk Cup on table
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.11, 0.28, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    cup.position.set(-0.35, 0.82, 0.1);
    tableGroup.add(cup);

    this.scene.add(tableGroup);

    // 6. Cute Beanbag Cushion (Left Side)
    const beanbagGeo = new THREE.SphereGeometry(1.25, 24, 18);
    beanbagGeo.scale(1.2, 0.65, 1.2);
    const beanbagMat = new THREE.MeshStandardMaterial({ color: 0xffb5a7, roughness: 0.9 });
    const beanbag = new THREE.Mesh(beanbagGeo, beanbagMat);
    beanbag.position.set(-1.8, 0.38, -1.8);
    beanbag.castShadow = true;
    beanbag.receiveShadow = true;
    this.scene.add(beanbag);

    // 7. Potted Monstera / Fiddle Leaf Plant near window
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

    // 8. Minimalist Study Desk with Mini Laptop (Left Corner)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-4.6, 0, -1.2);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.4), woodMat);
    deskTop.position.set(0, 1.6, 0);
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
    if (this.isFollowingCursor && this.cat.animState !== "sleep" && this.cat.animState !== "sit") {
      const hits = this.raycaster.intersectObject(this.floorPlane);
      if (hits.length > 0) {
        const point = hits[0].point;
        // Clamp to walkable boundaries
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

  // Pointer Down (Tap/Click to Walk or Poke Body Parts like Talking Tom!)
  private onPointerDown(e: PointerEvent) {
    const rect = this.container.getBoundingClientRect();
    this.mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);

    // Check if clicked directly on Cat body meshes
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

    // Otherwise, tap to walk to point on floor
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

  // Main 60fps Animation Loop with 3D Collision Detection
  private animate() {
    const delta = this.clock.getDelta();

    // 1. Move Cat smoothly in 3D towards targetPos
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

        // 1. Check room boundaries
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

        // 2. Check 3D Furniture Obstacles
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
          // BUMP! Never walk inside the obstacle, bounce back!
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
        // Arrived at target, switch to idle breathing
        this.cat.animState = "idle";
      }
    }

    // 2. Update Cat's 3D internal animations (walk, dance, sit, sleep, purr, etc.)
    this.cat.update(delta);

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
