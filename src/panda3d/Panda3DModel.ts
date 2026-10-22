import * as THREE from "three";

export type PandaAnimState =
  | "idle"
  | "walk"
  | "dance"
  | "sit"
  | "sleep"
  | "wave"
  | "bump"
  | "poke_head"
  | "poke_belly"
  | "eat_bamboo"
  | "eat_chili"
  | "fart";

export class Panda3DModel {
  public group: THREE.Group;

  // Major body parts
  public bodyMesh: THREE.Mesh;
  public bellyMesh: THREE.Mesh;
  public shoulderBandMesh: THREE.Mesh;
  public headGroup: THREE.Group;
  public snoutGroup: THREE.Group;
  public jawMesh: THREE.Mesh;
  public leftEarGroup: THREE.Group;
  public rightEarGroup: THREE.Group;
  public leftEyeGroup: THREE.Group;
  public rightEyeGroup: THREE.Group;
  public leftEyelid: THREE.Mesh;
  public rightEyelid: THREE.Mesh;
  public leftArmGroup: THREE.Group;
  public rightArmGroup: THREE.Group;
  public leftLegGroup: THREE.Group;
  public rightLegGroup: THREE.Group;
  public tailGroup: THREE.Group;
  public backpackGroup: THREE.Group;

  // Accessories
  public sunglassesGroup: THREE.Group;
  public partyHatGroup: THREE.Group;
  public bambooStickGroup: THREE.Group;

  // Animation timing & state
  public animState: PandaAnimState = "idle";
  private walkTime: number = 0;
  private danceTime: number = 0;
  private bumpTime: number = 0;
  private blinkTimer: number = 0;
  private isBlinking: boolean = false;
  public isSpeaking: boolean = false;
  private talkTime: number = 0;
  public walkSpeed: number = 4.0;

  // Target 3D position & rotation for cursor navigation
  public targetPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor() {
    this.group = new THREE.Group();

    // High quality PBR materials
    const whiteFurMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      roughness: 0.88,
      metalness: 0.05,
    });

    const blackFurMat = new THREE.MeshStandardMaterial({
      color: 0x161318,
      roughness: 0.85,
      metalness: 0.05,
    });

    const blushPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff8fa3,
      roughness: 0.7,
      metalness: 0.0,
      transparent: true,
      opacity: 0.85,
    });

    const pinkFleshMat = new THREE.MeshStandardMaterial({
      color: 0xff99af,
      roughness: 0.6,
      metalness: 0.0,
    });

    const shinyEyeMat = new THREE.MeshStandardMaterial({
      color: 0x070608,
      roughness: 0.08,
      metalness: 0.95,
    });

    const eyeHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const noseMat = new THREE.MeshStandardMaterial({
      color: 0x120f14,
      roughness: 0.35,
      metalness: 0.15,
    });

    const backpackMat = new THREE.MeshStandardMaterial({
      color: 0x589e35,
      roughness: 0.65,
      metalness: 0.1,
    });

    const strapMat = new THREE.MeshStandardMaterial({
      color: 0xbf9440,
      roughness: 0.7,
      metalness: 0.05,
    });

    // 1. Torso / Body (Chubby, roly-poly pear-shaped baby panda body)
    const bodyGeo = new THREE.SphereGeometry(1.25, 32, 24);
    bodyGeo.scale(1.15, 1.25, 1.05);
    this.bodyMesh = new THREE.Mesh(bodyGeo, whiteFurMat);
    this.bodyMesh.position.y = 1.35;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.bodyMesh.userData = { part: "belly" };
    this.group.add(this.bodyMesh);

    // Iconic Giant Panda Black Shoulder Band / Saddle (wraps across shoulders and upper chest)
    const bandGeo = new THREE.CylinderGeometry(1.3, 1.35, 0.75, 28);
    this.shoulderBandMesh = new THREE.Mesh(bandGeo, blackFurMat);
    this.shoulderBandMesh.position.set(0, 1.7, 0);
    this.shoulderBandMesh.castShadow = true;
    this.group.add(this.shoulderBandMesh);

    // Cute marshmallow white belly protrusion
    const bellyGeo = new THREE.SphereGeometry(1.05, 24, 18);
    bellyGeo.scale(1.0, 1.15, 0.7);
    this.bellyMesh = new THREE.Mesh(bellyGeo, whiteFurMat);
    this.bellyMesh.position.set(0, 1.3, 0.45);
    this.bellyMesh.userData = { part: "belly" };
    this.group.add(this.bellyMesh);

    // 2. Green Backpack on Back
    this.backpackGroup = new THREE.Group();
    this.backpackGroup.position.set(0, 1.5, -0.95);

    const packGeo = new THREE.BoxGeometry(1.1, 1.3, 0.65);
    const packMesh = new THREE.Mesh(packGeo, backpackMat);
    packMesh.castShadow = true;
    this.backpackGroup.add(packMesh);

    // Backpack flap & pocket
    const flapGeo = new THREE.BoxGeometry(0.9, 0.5, 0.4);
    const flapMesh = new THREE.Mesh(flapGeo, backpackMat);
    flapMesh.position.set(0, -0.2, -0.25);
    this.backpackGroup.add(flapMesh);

    // Cute leaf emblem on backpack
    const packLeafGeo = new THREE.ConeGeometry(0.18, 0.4, 6);
    packLeafGeo.rotateZ(0.7);
    const leafMesh = new THREE.Mesh(packLeafGeo, new THREE.MeshStandardMaterial({ color: 0x86efac }));
    leafMesh.position.set(0, 0.1, -0.34);
    this.backpackGroup.add(leafMesh);

    // Straps over shoulders
    const strapGeo = new THREE.TorusGeometry(0.85, 0.06, 12, 24, Math.PI);
    const leftStrap = new THREE.Mesh(strapGeo, strapMat);
    leftStrap.position.set(-0.55, 0.1, 0.4);
    leftStrap.rotation.y = Math.PI / 2;
    leftStrap.rotation.x = -0.3;
    this.backpackGroup.add(leftStrap);

    const rightStrap = new THREE.Mesh(strapGeo, strapMat);
    rightStrap.position.set(0.55, 0.1, 0.4);
    rightStrap.rotation.y = Math.PI / 2;
    rightStrap.rotation.x = -0.3;
    this.backpackGroup.add(rightStrap);

    this.group.add(this.backpackGroup);

    // 3. Head & Face Group (Ultra-Kawaii Chubby Panda Bear proportions)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.7, 0.1);

    // Wide, chubby round baby panda head (NOT narrow or elongated like a dog)
    const headGeo = new THREE.SphereGeometry(1.22, 32, 24);
    headGeo.scale(1.32, 1.12, 1.02);
    const headMesh = new THREE.Mesh(headGeo, whiteFurMat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headMesh.userData = { part: "head" };
    this.headGroup.add(headMesh);

    // Chubby Cheeks (left and right bulges for adorable teddy bear cheeks)
    const cheekGeo = new THREE.SphereGeometry(0.68, 20, 16);
    cheekGeo.scale(1.05, 0.9, 0.7);

    const leftCheek = new THREE.Mesh(cheekGeo, whiteFurMat);
    leftCheek.position.set(-0.7, -0.22, 0.55);
    this.headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, whiteFurMat);
    rightCheek.position.set(0.7, -0.22, 0.55);
    this.headGroup.add(rightCheek);

    // Rosy Pink Blush Circles on cheeks
    const blushGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.04, 20);
    blushGeo.rotateX(Math.PI / 2);

    const leftBlush = new THREE.Mesh(blushGeo, blushPinkMat);
    leftBlush.position.set(-0.78, -0.16, 0.96);
    leftBlush.rotation.y = -0.25;
    this.headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushPinkMat);
    rightBlush.position.set(0.78, -0.16, 0.96);
    rightBlush.rotation.y = 0.25;
    this.headGroup.add(rightBlush);

    // 4. Short, Flat, Cute Button Bear Snout (Crucial for Panda vs Dog look!)
    this.snoutGroup = new THREE.Group();
    this.snoutGroup.position.set(0, -0.22, 0.92);

    // Short rounded teddy bear muzzle (protrudes only slightly, NOT a long dog snout)
    const snoutGeo = new THREE.SphereGeometry(0.5, 24, 18);
    snoutGeo.scale(1.15, 0.75, 0.42); // very shallow depth
    const snoutMesh = new THREE.Mesh(snoutGeo, whiteFurMat);
    this.snoutGroup.add(snoutMesh);

    // Rounded Triangular Button Bear Nose
    const noseGeo = new THREE.SphereGeometry(0.19, 16, 12);
    noseGeo.scale(1.35, 0.9, 0.5);
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.position.set(0, 0.12, 0.2);
    this.snoutGroup.add(noseMesh);

    // Animated Lower Jaw with pink tongue for talking and lip-sync
    const jawGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.14, 16);
    jawGeo.rotateX(Math.PI / 2);
    this.jawMesh = new THREE.Mesh(jawGeo, pinkFleshMat);
    this.jawMesh.position.set(0, -0.16, 0.18);
    this.snoutGroup.add(this.jawMesh);

    this.headGroup.add(this.snoutGroup);

    // 5. Iconic Giant Panda Tilted Oval Eye Patches
    // Black teardrop/oval patches tilted downwards-outwards
    const patchGeo = new THREE.SphereGeometry(0.48, 20, 16);
    patchGeo.scale(0.9, 1.28, 0.3);

    const leftPatch = new THREE.Mesh(patchGeo, blackFurMat);
    leftPatch.position.set(-0.54, 0.14, 0.96);
    leftPatch.rotation.z = 0.42;
    leftPatch.rotation.y = -0.22;
    this.headGroup.add(leftPatch);

    const rightPatch = new THREE.Mesh(patchGeo, blackFurMat);
    rightPatch.position.set(0.54, 0.14, 0.96);
    rightPatch.rotation.z = -0.42;
    rightPatch.rotation.y = 0.22;
    this.headGroup.add(rightPatch);

    // Big Glossy Kawaii Anime Eyes with Dual Specular Sparkles
    const eyeGeo = new THREE.SphereGeometry(0.23, 20, 16);

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeo, shinyEyeMat);
    leftEye.position.set(-0.5, 0.14, 1.08);

    // Big sparkle highlight
    const hlBigGeo = new THREE.SphereGeometry(0.07, 12, 10);
    const leftHl1 = new THREE.Mesh(hlBigGeo, eyeHighlightMat);
    leftHl1.position.set(-0.06, 0.08, 0.18);
    leftEye.add(leftHl1);

    // Mini bottom sparkle highlight
    const hlMiniGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const leftHl2 = new THREE.Mesh(hlMiniGeo, eyeHighlightMat);
    leftHl2.position.set(0.07, -0.07, 0.18);
    leftEye.add(leftHl2);

    this.leftEyeGroup = new THREE.Group();
    this.leftEyeGroup.add(leftEye);

    // Animated Eyelid for natural blinking
    const eyelidGeo = new THREE.SphereGeometry(0.25, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    this.leftEyelid = new THREE.Mesh(eyelidGeo, blackFurMat);
    this.leftEyelid.position.copy(leftEye.position);
    this.leftEyelid.rotation.x = -Math.PI / 2;
    this.leftEyelid.visible = false;
    this.leftEyeGroup.add(this.leftEyelid);
    this.headGroup.add(this.leftEyeGroup);

    // Right Eye
    const rightEye = new THREE.Mesh(eyeGeo, shinyEyeMat);
    rightEye.position.set(0.5, 0.14, 1.08);

    const rightHl1 = new THREE.Mesh(hlBigGeo, eyeHighlightMat);
    rightHl1.position.set(-0.06, 0.08, 0.18);
    rightEye.add(rightHl1);

    const rightHl2 = new THREE.Mesh(hlMiniGeo, eyeHighlightMat);
    rightHl2.position.set(0.07, -0.07, 0.18);
    rightEye.add(rightHl2);

    this.rightEyeGroup = new THREE.Group();
    this.rightEyeGroup.add(rightEye);

    this.rightEyelid = new THREE.Mesh(eyelidGeo, blackFurMat);
    this.rightEyelid.position.copy(rightEye.position);
    this.rightEyelid.rotation.x = -Math.PI / 2;
    this.rightEyelid.visible = false;
    this.rightEyeGroup.add(this.rightEyelid);
    this.headGroup.add(this.rightEyeGroup);

    // 6. Fluffy Round Black Panda Ears (Set high and wide)
    const earGeo = new THREE.SphereGeometry(0.48, 22, 18);
    earGeo.scale(1.05, 1.05, 0.52);

    this.leftEarGroup = new THREE.Group();
    this.leftEarGroup.position.set(-1.18, 1.15, 0.05);
    const leftEarMesh = new THREE.Mesh(earGeo, blackFurMat);
    leftEarMesh.rotation.z = -0.32;
    this.leftEarGroup.add(leftEarMesh);

    const earCushionGeo = new THREE.SphereGeometry(0.26, 14, 10);
    earCushionGeo.scale(1.0, 1.0, 0.3);
    const leftEarPink = new THREE.Mesh(earCushionGeo, pinkFleshMat);
    leftEarPink.position.set(0, 0, 0.12);
    this.leftEarGroup.add(leftEarPink);
    this.headGroup.add(this.leftEarGroup);

    this.rightEarGroup = new THREE.Group();
    this.rightEarGroup.position.set(1.18, 1.15, 0.05);
    const rightEarMesh = new THREE.Mesh(earGeo, blackFurMat);
    rightEarMesh.rotation.z = 0.32;
    this.rightEarGroup.add(rightEarMesh);

    const rightEarPink = new THREE.Mesh(earCushionGeo, pinkFleshMat);
    rightEarPink.position.set(0, 0, 0.12);
    this.rightEarGroup.add(rightEarPink);
    this.headGroup.add(this.rightEarGroup);

    // 7. Accessories (Sunglasses & Party Hat)
    this.sunglassesGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.1, metalness: 0.9, opacity: 0.85, transparent: true });

    const lensGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 24);
    lensGeo.rotateX(Math.PI / 2);

    const leftLens = new THREE.Mesh(lensGeo, lensMat);
    leftLens.position.set(-0.5, 0.16, 1.25);
    this.sunglassesGroup.add(leftLens);

    const rightLens = new THREE.Mesh(lensGeo, lensMat);
    rightLens.position.set(0.5, 0.16, 1.25);
    this.sunglassesGroup.add(rightLens);

    const bridgeGeo = new THREE.BoxGeometry(0.35, 0.06, 0.06);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, frameMat);
    bridgeMesh.position.set(0, 0.18, 1.25);
    this.sunglassesGroup.add(bridgeMesh);
    this.sunglassesGroup.visible = false;
    this.headGroup.add(this.sunglassesGroup);

    this.partyHatGroup = new THREE.Group();
    const hatGeo = new THREE.ConeGeometry(0.48, 1.1, 24);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xff3377, roughness: 0.4 });
    const hatMesh = new THREE.Mesh(hatGeo, hatMat);
    hatMesh.position.set(0, 1.6, 0);
    this.partyHatGroup.add(hatMesh);

    const pomGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const pomMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const pomMesh = new THREE.Mesh(pomGeo, pomMat);
    pomMesh.position.set(0, 2.2, 0);
    this.partyHatGroup.add(pomMesh);
    this.partyHatGroup.visible = false;
    this.headGroup.add(this.partyHatGroup);

    this.group.add(this.headGroup);

    // 8. Chubby Black Arms & Paws with pink paw pads
    const armGeo = new THREE.CylinderGeometry(0.38, 0.44, 1.15, 18);
    const pawGeo = new THREE.SphereGeometry(0.46, 18, 14);
    const padGeo = new THREE.SphereGeometry(0.13, 10, 8);

    // Left Arm
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-1.25, 1.95, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, blackFurMat);
    leftArmMesh.position.y = -0.55;
    leftArmMesh.castShadow = true;
    this.leftArmGroup.add(leftArmMesh);

    const leftPaw = new THREE.Mesh(pawGeo, blackFurMat);
    leftPaw.position.y = -1.05;
    leftPaw.castShadow = true;
    this.leftArmGroup.add(leftPaw);

    const leftPadMain = new THREE.Mesh(padGeo, pinkFleshMat);
    leftPadMain.position.set(0, -1.15, 0.3);
    leftPadMain.scale.set(1.4, 1.2, 0.4);
    this.leftArmGroup.add(leftPadMain);
    this.group.add(this.leftArmGroup);

    // Right Arm
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(1.25, 1.95, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, blackFurMat);
    rightArmMesh.position.y = -0.55;
    rightArmMesh.castShadow = true;
    this.rightArmGroup.add(rightArmMesh);

    const rightPaw = new THREE.Mesh(pawGeo, blackFurMat);
    rightPaw.position.y = -1.05;
    rightPaw.castShadow = true;
    this.rightArmGroup.add(rightPaw);

    const rightPadMain = new THREE.Mesh(padGeo, pinkFleshMat);
    rightPadMain.position.set(0, -1.15, 0.3);
    rightPadMain.scale.set(1.4, 1.2, 0.4);
    this.rightArmGroup.add(rightPadMain);
    this.group.add(this.rightArmGroup);

    // 9. Bamboo Stalk
    this.bambooStickGroup = new THREE.Group();
    const bambooMat = new THREE.MeshStandardMaterial({ color: 0x48bb78, roughness: 0.5 });
    const stickGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.4, 12);
    const stickMesh = new THREE.Mesh(stickGeo, bambooMat);
    this.bambooStickGroup.add(stickMesh);

    const bambooLeafGeo = new THREE.ConeGeometry(0.15, 0.45, 6);
    bambooLeafGeo.rotateZ(0.6);
    const leafMesh1 = new THREE.Mesh(bambooLeafGeo, bambooMat);
    leafMesh1.position.set(0.15, 0.3, 0);
    this.bambooStickGroup.add(leafMesh1);

    this.bambooStickGroup.position.set(0, 1.2, 0.9);
    this.bambooStickGroup.rotation.z = 0.4;
    this.bambooStickGroup.visible = false;
    this.group.add(this.bambooStickGroup);

    // 10. Chubby Legs & Feet
    const legGeo = new THREE.CylinderGeometry(0.44, 0.48, 0.95, 18);
    const footGeo = new THREE.SphereGeometry(0.5, 20, 16);
    footGeo.scale(1.0, 0.65, 1.35);

    // Left Leg
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.65, 0.85, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, blackFurMat);
    leftLegMesh.position.y = -0.42;
    leftLegMesh.castShadow = true;
    this.leftLegGroup.add(leftLegMesh);

    const leftFoot = new THREE.Mesh(footGeo, blackFurMat);
    leftFoot.position.set(0, -0.8, 0.2);
    leftFoot.castShadow = true;
    leftFoot.userData = { part: "leftFoot" };
    this.leftLegGroup.add(leftFoot);
    this.group.add(this.leftLegGroup);

    // Right Leg
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.65, 0.85, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, blackFurMat);
    rightLegMesh.position.y = -0.42;
    rightLegMesh.castShadow = true;
    this.rightLegGroup.add(rightLegMesh);

    const rightFoot = new THREE.Mesh(footGeo, blackFurMat);
    rightFoot.position.set(0, -0.8, 0.2);
    rightFoot.castShadow = true;
    rightFoot.userData = { part: "rightFoot" };
    this.rightLegGroup.add(rightFoot);
    this.group.add(this.rightLegGroup);

    // 11. Fluffy Black Tail
    this.tailGroup = new THREE.Group();
    const tailGeo = new THREE.SphereGeometry(0.3, 16, 14);
    const tailMesh = new THREE.Mesh(tailGeo, blackFurMat);
    this.tailGroup.add(tailMesh);
    this.tailGroup.position.set(0, 0.8, -1.05);
    this.group.add(this.tailGroup);

    this.group.scale.set(0.95, 0.95, 0.95);
  }

  // Look at target point in 3D
  public lookAtTarget(target: THREE.Vector3) {
    if (this.animState === "sleep" || this.animState === "bump") return;

    const localTarget = target.clone().sub(this.group.position);
    const targetAngleY = Math.atan2(localTarget.x, localTarget.z) - this.group.rotation.y;
    const clampedY = Math.max(-0.65, Math.min(0.65, targetAngleY));

    const targetAngleX = -Math.atan2(localTarget.y - 2.5, Math.sqrt(localTarget.x * localTarget.x + localTarget.z * localTarget.z));
    const clampedX = Math.max(-0.35, Math.min(0.35, targetAngleX));

    this.headGroup.rotation.y = THREE.MathUtils.lerp(this.headGroup.rotation.y, clampedY, 0.08);
    this.headGroup.rotation.x = THREE.MathUtils.lerp(this.headGroup.rotation.x, clampedX, 0.08);
  }

  // Update Procedural 3D Animations
  public update(delta: number) {
    // 1. Blinking Loop
    this.blinkTimer += delta;
    if (this.blinkTimer > 3.4) {
      this.isBlinking = true;
      this.leftEyelid.visible = true;
      this.rightEyelid.visible = true;
      if (this.blinkTimer > 3.55) {
        this.isBlinking = false;
        this.leftEyelid.visible = false;
        this.rightEyelid.visible = false;
        this.blinkTimer = 0;
      }
    }

    // 2. Talking Lip-Sync
    if (this.isSpeaking) {
      this.talkTime += delta * 18;
      const jawAngle = (Math.sin(this.talkTime) * 0.5 + 0.5) * 0.28;
      this.jawMesh.position.y = -0.16 - jawAngle * 0.35;
      this.headGroup.position.y = 2.7 + Math.sin(this.talkTime * 0.5) * 0.035;
    } else {
      this.jawMesh.position.y = -0.16;
    }

    // 3. Animation State Engine
    switch (this.animState) {
      case "idle": {
        this.bambooStickGroup.visible = false;
        const t = performance.now() * 0.0025;

        // Gentle breathing bobbing
        this.bodyMesh.scale.y = 1.25 + Math.sin(t) * 0.025;
        this.group.position.y = 0 + Math.sin(t) * 0.02;

        this.leftArmGroup.rotation.x = Math.sin(t) * 0.08;
        this.rightArmGroup.rotation.x = -Math.sin(t) * 0.08;
        this.leftArmGroup.rotation.z = -0.1 + Math.cos(t) * 0.03;
        this.rightArmGroup.rotation.z = 0.1 - Math.cos(t) * 0.03;

        this.leftLegGroup.rotation.x = 0;
        this.rightLegGroup.rotation.x = 0;
        this.leftLegGroup.position.y = 0.85;
        this.rightLegGroup.position.y = 0.85;

        this.leftEarGroup.rotation.z = -0.32 + Math.sin(t * 2) * 0.03;
        this.rightEarGroup.rotation.z = 0.32 - Math.sin(t * 2) * 0.03;
        this.tailGroup.rotation.y = Math.sin(t * 2) * 0.15;
        break;
      }

      case "walk": {
        this.bambooStickGroup.visible = false;
        this.walkTime += delta * this.walkSpeed * 2.8;

        const legSwing = Math.sin(this.walkTime) * 0.72;
        const armSwing = Math.cos(this.walkTime) * 0.62;

        this.leftLegGroup.rotation.x = legSwing;
        this.rightLegGroup.rotation.x = -legSwing;
        this.leftLegGroup.position.y = 0.85 + Math.max(0, -legSwing) * 0.2;
        this.rightLegGroup.position.y = 0.85 + Math.max(0, legSwing) * 0.2;

        this.leftArmGroup.rotation.x = -armSwing;
        this.rightArmGroup.rotation.x = armSwing;

        // Chubby waddle bobbing
        this.group.position.y = 0 + Math.abs(Math.sin(this.walkTime)) * 0.12;
        this.bodyMesh.rotation.z = Math.sin(this.walkTime * 0.5) * 0.06;

        this.leftEarGroup.rotation.x = Math.sin(this.walkTime) * 0.15;
        this.rightEarGroup.rotation.x = -Math.sin(this.walkTime) * 0.15;
        this.backpackGroup.position.y = 1.5 + Math.sin(this.walkTime * 2) * 0.06;
        break;
      }

      case "bump": {
        // Hilarious bump reaction: Panda reels back, head wobbles dizzy, arms flail!
        this.bumpTime += delta * 14;
        this.headGroup.rotation.z = Math.sin(this.bumpTime) * 0.3;
        this.headGroup.rotation.x = -0.4 + Math.cos(this.bumpTime * 0.8) * 0.2;
        this.leftArmGroup.rotation.z = -1.2 + Math.sin(this.bumpTime) * 0.4;
        this.rightArmGroup.rotation.z = 1.2 - Math.sin(this.bumpTime) * 0.4;
        this.bodyMesh.rotation.x = -0.25;
        break;
      }

      case "dance": {
        this.bambooStickGroup.visible = false;
        this.danceTime += delta * 6;

        this.group.position.y = 0 + Math.abs(Math.sin(this.danceTime)) * 0.6;
        this.group.rotation.y += delta * 3.5;

        this.leftArmGroup.rotation.z = -2.4 + Math.sin(this.danceTime * 2) * 0.3;
        this.rightArmGroup.rotation.z = 2.4 - Math.sin(this.danceTime * 2) * 0.3;
        this.leftArmGroup.rotation.x = Math.sin(this.danceTime) * 0.4;
        this.rightArmGroup.rotation.x = Math.sin(this.danceTime) * 0.4;

        this.leftLegGroup.rotation.x = Math.sin(this.danceTime * 1.5) * 0.5;
        this.rightLegGroup.rotation.x = -Math.sin(this.danceTime * 1.5) * 0.5;
        break;
      }

      case "sit": {
        this.bambooStickGroup.visible = true;
        const k = 10.0;
        const t = performance.now() * 0.003;
        this.group.position.y = THREE.MathUtils.damp(this.group.position.y, -0.48, k, delta);
        this.bodyMesh.rotation.x = THREE.MathUtils.damp(this.bodyMesh.rotation.x, -0.16, k, delta);

        this.leftLegGroup.rotation.x = THREE.MathUtils.damp(this.leftLegGroup.rotation.x, -1.42 + Math.sin(t) * 0.06, k, delta);
        this.rightLegGroup.rotation.x = THREE.MathUtils.damp(this.rightLegGroup.rotation.x, -1.42 - Math.sin(t) * 0.06, k, delta);
        this.leftLegGroup.rotation.z = THREE.MathUtils.damp(this.leftLegGroup.rotation.z, -0.32, k, delta);
        this.rightLegGroup.rotation.z = THREE.MathUtils.damp(this.rightLegGroup.rotation.z, 0.32, k, delta);

        this.leftArmGroup.rotation.x = THREE.MathUtils.damp(this.leftArmGroup.rotation.x, -1.05, k, delta);
        this.rightArmGroup.rotation.x = THREE.MathUtils.damp(this.rightArmGroup.rotation.x, -1.05, k, delta);
        this.leftArmGroup.rotation.z = THREE.MathUtils.damp(this.leftArmGroup.rotation.z, -0.45, k, delta);
        this.rightArmGroup.rotation.z = THREE.MathUtils.damp(this.rightArmGroup.rotation.z, 0.45, k, delta);

        const chew = Math.sin(performance.now() * 0.015) * 0.08;
        this.jawMesh.position.y = -0.16 + chew;
        this.bambooStickGroup.rotation.z = 0.4 + chew * 0.5;
        break;
      }

      case "sleep": {
        this.bambooStickGroup.visible = false;
        this.group.position.y = THREE.MathUtils.damp(this.group.position.y, -0.85, 8.0, delta);
        this.bodyMesh.rotation.x = THREE.MathUtils.damp(this.bodyMesh.rotation.x, 1.25, 8.0, delta);
        this.headGroup.position.set(0, 1.3, 1.1);
        this.headGroup.rotation.x = 0.3;

        this.leftArmGroup.rotation.x = 1.4;
        this.rightArmGroup.rotation.x = 1.4;
        this.leftLegGroup.rotation.x = 1.2;
        this.rightLegGroup.rotation.x = 1.2;

        this.leftEyelid.visible = true;
        this.rightEyelid.visible = true;

        const breath = Math.sin(performance.now() * 0.0018) * 0.05;
        this.bodyMesh.scale.set(1.15 + breath, 1.25 + breath, 1.05);
        break;
      }

      case "wave": {
        this.bambooStickGroup.visible = false;
        this.group.position.y = THREE.MathUtils.damp(this.group.position.y, 0, 10.0, delta);
        const waveT = performance.now() * 0.01;

        this.rightArmGroup.rotation.z = 2.2;
        this.rightArmGroup.rotation.x = -0.3;
        this.rightArmGroup.rotation.y = Math.sin(waveT) * 0.6;

        this.leftArmGroup.rotation.set(0, 0, -0.15);
        this.leftLegGroup.rotation.set(0, 0, 0);
        this.rightLegGroup.rotation.set(0, 0, 0);
        break;
      }

      case "poke_head": {
        const t = performance.now() * 0.015;
        this.headGroup.rotation.x = -0.6 + Math.sin(t) * 0.2;
        this.headGroup.rotation.y = Math.cos(t) * 0.3;
        this.bodyMesh.position.z = -0.2;
        break;
      }

      case "poke_belly": {
        const t = performance.now() * 0.02;
        this.group.position.y = THREE.MathUtils.damp(this.group.position.y, -0.42 + Math.abs(Math.sin(t * 0.5)) * 0.12, 12.0, delta);
        this.bodyMesh.rotation.z = Math.sin(t) * 0.2;
        this.bodyMesh.scale.z = 0.9 + Math.sin(t) * 0.08;
        this.headGroup.rotation.x = -0.25 + Math.sin(t * 0.8) * 0.1;
        this.leftLegGroup.rotation.x = -1.35 + Math.sin(t * 1.4) * 0.4;
        this.rightLegGroup.rotation.x = -1.35 - Math.sin(t * 1.4) * 0.4;
        this.leftArmGroup.rotation.x = -0.9 + Math.sin(t * 1.5) * 0.25;
        this.rightArmGroup.rotation.x = -0.9 - Math.sin(t * 1.5) * 0.25;
        this.leftArmGroup.rotation.z = -0.4;
        this.rightArmGroup.rotation.z = 0.4;
        break;
      }

      case "fart": {
        const t = performance.now() * 0.012;
        this.group.position.y = Math.sin(t) * 0.25;
        this.bodyMesh.rotation.x = 0.35;
        this.tailGroup.rotation.y = Math.sin(t * 3) * 0.6;
        break;
      }
    }
  }

  public toggleSunglasses() {
    this.sunglassesGroup.visible = !this.sunglassesGroup.visible;
  }

  public toggleHat() {
    this.partyHatGroup.visible = !this.partyHatGroup.visible;
  }
}
