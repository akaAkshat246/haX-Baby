
import * as THREE from "three";

export type CatAnimState =
  | "idle"
  | "walk"
  | "dance"
  | "sit"
  | "sleep"
  | "wave"
  | "purr"
  | "bump"
  | "poke_head"
  | "poke_belly"
  | "eat_milk"
  | "eat_fish"
  | "pout";

export class Cat3DModel {
  public group: THREE.Group;

  public bodyMesh: THREE.Mesh;
  public chestRuffGroup: THREE.Group;
  public bellyMesh: THREE.Mesh;
  public headGroup: THREE.Group;
  public muzzleGroup: THREE.Group;
  public jawMesh: THREE.Mesh;
  public tongueMesh: THREE.Mesh;
  public leftEarGroup: THREE.Group;
  public rightEarGroup: THREE.Group;
  public leftEyeGroup: THREE.Group;
  public rightEyeGroup: THREE.Group;
  public leftEyelid: THREE.Mesh;
  public rightEyelid: THREE.Mesh;
  public leftWhiskers: THREE.Group;
  public rightWhiskers: THREE.Group;
  public leftArmGroup: THREE.Group;
  public rightArmGroup: THREE.Group;
  public leftLegGroup: THREE.Group;
  public rightLegGroup: THREE.Group;
  public tailGroup: THREE.Group;

  public pinkBowGroup: THREE.Group;
  public sunglassesGroup: THREE.Group;
  public partyHatGroup: THREE.Group;
  public milkSaucerGroup: THREE.Group;
  public fishGroup: THREE.Group;

  public animState: CatAnimState = "idle";
  public isSpeaking = false;
  public walkSpeed = 4.0;
  public targetPos = new THREE.Vector3(0, 0, 0);

  private walkTime = 0;
  private danceTime = 0;
  private bumpTime = 0;
  private purrTime = 0;
  private tailTime = 0;
  private blinkTimer = 0;
  private talkTime = 0;
  private blinkDuration = 0;
  private isBlinking = false;

  private readonly baseHeadY = 2.58;
  private readonly baseJawY = -0.11;
  private readonly baseTongueY = -0.1;
  private readonly baseTongueScale = new THREE.Vector3(1.2, 0.5, 1.0);
  private readonly baseBodyScale = new THREE.Vector3(1.04, 1.25, 0.96);

  constructor() {
    this.group = new THREE.Group();

    const silverFurMat = new THREE.MeshStandardMaterial({
      color: 0xd8dbe0,
      roughness: 0.85,
      metalness: 0.02,
    });

    const fluffyWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.02,
    });

    const tabbyStripeMat = new THREE.MeshStandardMaterial({
      color: 0x8a9099,
      roughness: 0.85,
      metalness: 0.02,
    });

    const pinkEarMat = new THREE.MeshStandardMaterial({
      color: 0xffb3c6,
      roughness: 0.6,
    });

    const pinkNoseMat = new THREE.MeshStandardMaterial({
      color: 0xff7096,
      roughness: 0.35,
      metalness: 0.1,
    });

    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xff5c8a,
      roughness: 0.45,
      side: THREE.DoubleSide,
    });

    const blushPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff85a1,
      roughness: 0.7,
      transparent: true,
      opacity: 0.65,
    });

    const hazelIrisMat = new THREE.MeshStandardMaterial({
      color: 0xa66326,
      roughness: 0.08,
      metalness: 0.4,
    });

    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x0c0712,
      roughness: 0.04,
      metalness: 0.9,
    });

    const sparkleHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const whiskerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      transparent: true,
      opacity: 0.75,
    });

    const bowSilkMat = new THREE.MeshStandardMaterial({
      color: 0xff668c,
      roughness: 0.42,
      metalness: 0.08,
    });

    const bowKnotMat = new THREE.MeshStandardMaterial({
      color: 0xff4f7a,
      roughness: 0.38,
      metalness: 0.1,
    });

    const whiteHeartMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
    });

    // 1. BODY
    const bodyGeo = new THREE.SphereGeometry(1.05, 32, 24);
    bodyGeo.scale(1.04, 1.25, 0.96);

    this.bodyMesh = new THREE.Mesh(bodyGeo, silverFurMat);
    this.bodyMesh.position.y = 1.28;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.bodyMesh.userData = { part: "belly" };
    this.group.add(this.bodyMesh);

    // Chest fluff
    this.chestRuffGroup = new THREE.Group();
    this.chestRuffGroup.position.set(0, 1.48, 0.48);

    const ruffGeo = new THREE.SphereGeometry(0.72, 24, 18);
    ruffGeo.scale(0.95, 1.15, 0.62);

    this.chestRuffGroup.add(
      new THREE.Mesh(ruffGeo, fluffyWhiteMat)
    );

    const tuftGeo = new THREE.SphereGeometry(0.38, 16, 12);
    tuftGeo.scale(1.1, 0.9, 0.7);

    for (const x of [-0.42, 0.42]) {
      const tuft = new THREE.Mesh(tuftGeo, fluffyWhiteMat);
      tuft.position.set(x, -0.15, 0.12);
      this.chestRuffGroup.add(tuft);
    }

    this.group.add(this.chestRuffGroup);

    // Belly
    const bellyGeo = new THREE.SphereGeometry(0.82, 24, 18);
    bellyGeo.scale(0.88, 1.05, 0.58);

    this.bellyMesh = new THREE.Mesh(bellyGeo, fluffyWhiteMat);
    this.bellyMesh.position.set(0, 1.02, 0.45);
    this.bellyMesh.userData = { part: "belly" };
    this.group.add(this.bellyMesh);

    // Back stripes
    [-0.25, 0.05, 0.35].forEach((yOff, idx) => {
      const geo = new THREE.TorusGeometry(
        0.96 - idx * 0.05,
        0.04,
        8,
        24,
        Math.PI * 0.7
      );

      const stripe = new THREE.Mesh(geo, tabbyStripeMat);
      stripe.position.set(0, 1.35 + yOff, -0.12);
      stripe.rotation.x = Math.PI / 2;
      stripe.rotation.z = Math.PI * 0.15;
      this.group.add(stripe);
    });

    // 2. HEAD
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, this.baseHeadY, 0.12);

    const headGeo = new THREE.SphereGeometry(1.18, 32, 24);
    headGeo.scale(1.26, 1.12, 1.05);

    const headMesh = new THREE.Mesh(headGeo, silverFurMat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headMesh.userData = { part: "head" };
    this.headGroup.add(headMesh);

    const cheekGeo = new THREE.SphereGeometry(0.65, 22, 18);
    cheekGeo.scale(1.15, 0.92, 0.75);

    for (const x of [-0.62, 0.62]) {
      const cheek = new THREE.Mesh(cheekGeo, fluffyWhiteMat);
      cheek.position.set(x, -0.22, 0.52);
      this.headGroup.add(cheek);
    }

    const blushGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 20);
    blushGeo.rotateX(Math.PI / 2);

    for (const side of [-1, 1]) {
      const blush = new THREE.Mesh(blushGeo, blushPinkMat);
      blush.position.set(side * 0.7, -0.16, 0.94);
      blush.rotation.y = side * -0.22;
      this.headGroup.add(blush);
    }

    const foreGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.38, 8);

    for (const side of [-1, 0, 1]) {
      const stripe = new THREE.Mesh(foreGeo, tabbyStripeMat);
      stripe.position.set(side * 0.24, 0.75 - Math.abs(side) * 0.03, 0.94);
      stripe.rotation.x = -0.28;
      stripe.rotation.z = side * 0.2;
      this.headGroup.add(stripe);
    }

    // 3. EARS
    const earGeo = new THREE.ConeGeometry(0.52, 1.05, 18);
    earGeo.scale(1.15, 1.0, 0.42);

    const innerEarGeo = new THREE.ConeGeometry(0.4, 0.88, 16);
    innerEarGeo.scale(1.05, 1.0, 0.3);

    const earTuftGeo = new THREE.SphereGeometry(0.22, 12, 10);

    this.leftEarGroup = new THREE.Group();
    this.leftEarGroup.position.set(-0.84, 1.05, 0.05);
    this.leftEarGroup.rotation.set(-0.12, 0.14, 0.32);

    this.rightEarGroup = new THREE.Group();
    this.rightEarGroup.position.set(0.84, 1.05, 0.05);
    this.rightEarGroup.rotation.set(-0.12, -0.14, -0.32);

    for (const [ear, side] of [
      [this.leftEarGroup, -1],
      [this.rightEarGroup, 1],
    ] as [THREE.Group, number][]) {
      const outer = new THREE.Mesh(earGeo, silverFurMat);
      outer.castShadow = true;
      ear.add(outer);

      const inner = new THREE.Mesh(innerEarGeo, pinkEarMat);
      inner.position.set(0, -0.04, 0.09);
      ear.add(inner);

      const tuft = new THREE.Mesh(earTuftGeo, fluffyWhiteMat);
      tuft.position.set(-side * 0.12, -0.38, 0.16);
      ear.add(tuft);

      this.headGroup.add(ear);
    }

    // 4. PINK BOW
    this.pinkBowGroup = new THREE.Group();
    this.pinkBowGroup.position.set(-0.75, 0.95, 0.42);
    this.pinkBowGroup.rotation.set(0.12, 0.22, -0.32);

    const knotGeo = new THREE.SphereGeometry(0.17, 16, 14);
    knotGeo.scale(1, 0.85, 0.65);
    this.pinkBowGroup.add(new THREE.Mesh(knotGeo, bowKnotMat));

    const loopGeo = new THREE.TorusGeometry(0.32, 0.13, 14, 24);
    loopGeo.scale(1.3, 0.85, 0.4);

    for (const side of [-1, 1]) {
      const loop = new THREE.Mesh(loopGeo, bowSilkMat);
      loop.position.set(side * 0.34, 0.06, 0);
      loop.rotation.z = -side * 0.22;
      this.pinkBowGroup.add(loop);

      const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.4, 0.04),
        bowSilkMat
      );
      tail.position.set(side * 0.14, -0.28, 0.02);
      tail.rotation.z = -side * 0.35;
      this.pinkBowGroup.add(tail);
    }

    const heartGeo = new THREE.SphereGeometry(0.05, 8, 8);

    for (const x of [-0.42, -0.28, 0.28, 0.42]) {
      const dot = new THREE.Mesh(heartGeo, whiteHeartMat);
      dot.position.set(x, 0.08, 0.08);
      this.pinkBowGroup.add(dot);
    }

    this.headGroup.add(this.pinkBowGroup);

    // 5. MUZZLE AND ANIMATED MOUTH
    this.muzzleGroup = new THREE.Group();
    this.muzzleGroup.position.set(0, -0.22, 0.98);

    const padGeo = new THREE.SphereGeometry(0.24, 18, 14);
    padGeo.scale(1.15, 0.85, 0.6);

    for (const x of [-0.18, 0.18]) {
      const pad = new THREE.Mesh(padGeo, fluffyWhiteMat);
      pad.position.set(x, 0.04, 0.12);
      this.muzzleGroup.add(pad);
    }

    const noseGeo = new THREE.ConeGeometry(0.1, 0.13, 3);
    noseGeo.rotateX(Math.PI);
    noseGeo.scale(1.2, 0.85, 0.5);

    const nose = new THREE.Mesh(noseGeo, pinkNoseMat);
    nose.position.set(0, 0.15, 0.26);
    this.muzzleGroup.add(nose);

    // Dark mouth cavity makes the opening more visible
    const mouthMat = new THREE.MeshStandardMaterial({
      color: 0x32101e,
      roughness: 0.85,
      side: THREE.DoubleSide,
    });

    const mouthGeo = new THREE.SphereGeometry(0.17, 20, 16);
    mouthGeo.scale(1.0, 0.72, 0.22);

    const mouthCavity = new THREE.Mesh(mouthGeo, mouthMat);
    mouthCavity.position.set(0, -0.105, 0.19);
    mouthCavity.userData.baseScaleY = 0.72;
    this.muzzleGroup.add(mouthCavity);

    const jawGeo = new THREE.SphereGeometry(0.16, 20, 16);
    jawGeo.scale(1.05, 0.42, 0.55);

    this.jawMesh = new THREE.Mesh(jawGeo, tongueMat);
    this.jawMesh.position.set(0, this.baseJawY, 0.205);
    this.muzzleGroup.add(this.jawMesh);

    const tongueGeo = new THREE.SphereGeometry(0.07, 12, 10);
    tongueGeo.scale(...this.baseTongueScale.toArray());

    this.tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
    this.tongueMesh.position.set(0, this.baseTongueY, 0.235);
    this.tongueMesh.visible = false;
    this.muzzleGroup.add(this.tongueMesh);

    this.leftWhiskers = new THREE.Group();
    this.leftWhiskers.position.set(-0.25, 0.04, 0.18);

    this.rightWhiskers = new THREE.Group();
    this.rightWhiskers.position.set(0.25, 0.04, 0.18);

    [-0.12, 0, 0.12].forEach((angle, idx) => {
      const leftGeo = new THREE.CylinderGeometry(0.003, 0.001, 0.7, 4);
      leftGeo.rotateZ(Math.PI / 2 + angle);

      const leftLine = new THREE.Mesh(leftGeo, whiskerMat);
      leftLine.position.set(-0.35, angle * 0.35, idx * 0.02);
      this.leftWhiskers.add(leftLine);

      const rightGeo = new THREE.CylinderGeometry(0.003, 0.001, 0.7, 4);
      rightGeo.rotateZ(-Math.PI / 2 - angle);

      const rightLine = new THREE.Mesh(rightGeo, whiskerMat);
      rightLine.position.set(0.35, angle * 0.35, idx * 0.02);
      this.rightWhiskers.add(rightLine);
    });

    this.muzzleGroup.add(this.leftWhiskers, this.rightWhiskers);
    this.headGroup.add(this.muzzleGroup);

    // 6. BIG GLOSSY EYES
    const eyeGeo = new THREE.SphereGeometry(0.34, 24, 20);
    eyeGeo.scale(1, 1.15, 0.55);

    const pupilGeo = new THREE.SphereGeometry(0.22, 18, 16);
    pupilGeo.scale(0.88, 1.12, 0.3);

    const highlightBigGeo = new THREE.SphereGeometry(0.09, 12, 10);
    const highlightSmallGeo = new THREE.SphereGeometry(0.045, 8, 8);

    const eyelidGeo = new THREE.SphereGeometry(
      0.36, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2
    );

    this.leftEyeGroup = new THREE.Group();
    this.leftEyeGroup.position.set(-0.46, 0.18, 0.98);
    this.leftEyeGroup.rotation.set(0, -0.15, 0.03);

    this.rightEyeGroup = new THREE.Group();
    this.rightEyeGroup.position.set(0.46, 0.18, 0.98);
    this.rightEyeGroup.rotation.set(0, 0.15, -0.03);

    for (const eye of [this.leftEyeGroup, this.rightEyeGroup]) {
      eye.add(new THREE.Mesh(eyeGeo, hazelIrisMat));

      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.set(0, 0, 0.14);
      eye.add(pupil);

      const h1 = new THREE.Mesh(highlightBigGeo, sparkleHighlightMat);
      h1.position.set(-0.07, 0.1, 0.24);
      eye.add(h1);

      const h2 = new THREE.Mesh(highlightSmallGeo, sparkleHighlightMat);
      h2.position.set(0.09, -0.09, 0.24);
      eye.add(h2);
    }

    this.leftEyelid = new THREE.Mesh(eyelidGeo, silverFurMat);
    this.leftEyelid.position.set(0, 0, 0.02);
    this.leftEyelid.rotation.x = -Math.PI / 2;
    this.leftEyelid.visible = false;
    this.leftEyeGroup.add(this.leftEyelid);

    this.rightEyelid = new THREE.Mesh(eyelidGeo, silverFurMat);
    this.rightEyelid.position.set(0, 0, 0.02);
    this.rightEyelid.rotation.x = -Math.PI / 2;
    this.rightEyelid.visible = false;
    this.rightEyeGroup.add(this.rightEyelid);

    this.headGroup.add(this.leftEyeGroup, this.rightEyeGroup);
    this.group.add(this.headGroup);

    // 7. FRONT PAWS
    const pawGeo = new THREE.SphereGeometry(0.34, 18, 14);
    pawGeo.scale(1.05, 0.75, 1.25);

    const armGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.82, 16);
    const beanGeo = new THREE.SphereGeometry(0.1, 10, 8);
    beanGeo.scale(1.2, 0.4, 1);

    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.38, 1.28, 0.38);

    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.38, 1.28, 0.38);

    for (const arm of [this.leftArmGroup, this.rightArmGroup]) {
      const limb = new THREE.Mesh(armGeo, silverFurMat);
      limb.position.y = -0.4;
      arm.add(limb);

      const paw = new THREE.Mesh(pawGeo, fluffyWhiteMat);
      paw.position.set(0, -0.82, 0.2);
      paw.castShadow = true;
      arm.add(paw);

      const bean = new THREE.Mesh(beanGeo, pinkEarMat);
      bean.position.set(0, -0.9, 0.18);
      arm.add(bean);
    }

    this.group.add(this.leftArmGroup, this.rightArmGroup);

    // 8. HIND LEGS
    const thighGeo = new THREE.SphereGeometry(0.48, 16, 14);
    thighGeo.scale(0.85, 1.1, 1);

    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.68, 0.45, 0);

    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.68, 0.45, 0);

    const leftThigh = new THREE.Mesh(thighGeo, silverFurMat);
    const rightThigh = new THREE.Mesh(thighGeo, silverFurMat);

    this.leftLegGroup.add(leftThigh);
    this.rightLegGroup.add(rightThigh);

    const leftHindPaw = new THREE.Mesh(pawGeo, fluffyWhiteMat);
    leftHindPaw.position.set(0.08, -0.32, 0.38);
    this.leftLegGroup.add(leftHindPaw);

    const rightHindPaw = new THREE.Mesh(pawGeo, fluffyWhiteMat);
    rightHindPaw.position.set(-0.08, -0.32, 0.38);
    this.rightLegGroup.add(rightHindPaw);

    this.group.add(this.leftLegGroup, this.rightLegGroup);

    // 9. SEGMENTED TAIL
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.55, -0.85);

    let previousSegment: THREE.Group = this.tailGroup;
    const segmentCount = 7;

    for (let i = 0; i < segmentCount; i++) {
      const radius = THREE.MathUtils.lerp(0.18, 0.11, i / segmentCount);
      const length = 0.28;

      const geometry = new THREE.CylinderGeometry(
        radius * 0.9, radius, length, 12
      );

      const material = i >= segmentCount - 2 ? fluffyWhiteMat : silverFurMat;
      const segmentMesh = new THREE.Mesh(geometry, material);
      segmentMesh.position.y = length * 0.5;
      segmentMesh.castShadow = true;

      const segment = new THREE.Group();
      segment.position.y = i === 0 ? 0 : length * 0.88;
      segment.rotation.x = -0.22 + i * 0.06;
      segment.add(segmentMesh);

      previousSegment.add(segment);
      previousSegment = segment;
    }

    const tailTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 12, 10),
      fluffyWhiteMat
    );
    tailTip.position.y = 0.28;
    previousSegment.add(tailTip);
    this.group.add(this.tailGroup);

    // 10. ACCESSORIES
    this.sunglassesGroup = new THREE.Group();
    this.sunglassesGroup.position.set(0, 0.18, 1.2);

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xff4081,
      metalness: 0.7,
      roughness: 0.3,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      metalness: 0.95,
      roughness: 0.1,
    });

    for (const x of [-0.45, 0.45]) {
      const frame = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.05, 20),
        frameMat
      );
      frame.rotation.x = Math.PI / 2;
      frame.position.x = x;
      this.sunglassesGroup.add(frame);

      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.052, 20),
        glassMat
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(x, 0, 0.012);
      this.sunglassesGroup.add(lens);
    }

    const bridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.04, 0.04),
      frameMat
    );
    this.sunglassesGroup.add(bridge);
    this.sunglassesGroup.visible = false;
    this.headGroup.add(this.sunglassesGroup);

    this.partyHatGroup = new THREE.Group();
    this.partyHatGroup.position.set(0, 1.25, 0.1);

    const hat = new THREE.Mesh(
      new THREE.ConeGeometry(0.38, 0.75, 18),
      new THREE.MeshStandardMaterial({
        color: 0xffd166,
        metalness: 0.6,
        roughness: 0.3,
      })
    );
    this.partyHatGroup.add(hat);

    const pompom = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 10, 8),
      new THREE.MeshStandardMaterial({ color: 0xff477e })
    );
    pompom.position.y = 0.42;
    this.partyHatGroup.add(pompom);
    this.partyHatGroup.visible = false;
    this.headGroup.add(this.partyHatGroup);

    this.milkSaucerGroup = new THREE.Group();
    this.milkSaucerGroup.position.set(0, 0.1, 0.95);

    const saucer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.35, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0xffccd5 })
    );
    this.milkSaucerGroup.add(saucer);

    const milk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.02, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })
    );
    milk.position.y = 0.06;
    this.milkSaucerGroup.add(milk);
    this.milkSaucerGroup.visible = false;
    this.group.add(this.milkSaucerGroup);

    this.fishGroup = new THREE.Group();
    this.fishGroup.position.set(0, 0.95, 0.85);

    const fishBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 12),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.3,
        metalness: 0.4,
      })
    );
    fishBody.scale.set(1.6, 0.8, 0.5);
    this.fishGroup.add(fishBody);

    const fishTail = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.28, 12),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    fishTail.rotation.z = -Math.PI / 2;
    fishTail.position.x = -0.45;
    this.fishGroup.add(fishTail);

    this.fishGroup.visible = false;
    this.group.add(this.fishGroup);
  }

  public lookAtTarget(worldPoint: THREE.Vector3) {
    if (this.animState === "sleep") return;

    const localPoint = this.group.worldToLocal(worldPoint.clone());

    const targetRotY = THREE.MathUtils.clamp(localPoint.x * 0.16, -0.55, 0.55);
    const targetRotX = THREE.MathUtils.clamp(
      -localPoint.y * 0.1 + 0.08,
      -0.35,
      0.35
    );

    this.headGroup.rotation.y = THREE.MathUtils.lerp(
      this.headGroup.rotation.y, targetRotY, 0.08
    );

    this.headGroup.rotation.x = THREE.MathUtils.lerp(
      this.headGroup.rotation.x, targetRotX, 0.08
    );

    const eyeOffsetX = targetRotY * 0.05;
    const eyeOffsetY = targetRotX * 0.05;

    this.leftEyeGroup.position.x = -0.46 + eyeOffsetX;
    this.leftEyeGroup.position.y = 0.18 + eyeOffsetY;
    this.rightEyeGroup.position.x = 0.46 + eyeOffsetX;
    this.rightEyeGroup.position.y = 0.18 + eyeOffsetY;
  }

  public update(delta: number) {
    const dt = Math.min(Math.max(delta, 0), 0.05);
    const time = performance.now() * 0.001;

    // 1. BLINKING
    if (this.animState !== "sleep" && this.animState !== "purr") {
      this.blinkTimer += dt;

      if (!this.isBlinking && this.blinkTimer > 3.2 + Math.sin(time) * 0.7) {
        this.isBlinking = true;
        this.blinkDuration = 0;
        this.leftEyelid.visible = true;
        this.rightEyelid.visible = true;
      }

      if (this.isBlinking) {
        this.blinkDuration += dt;

        if (this.blinkDuration > 0.14) {
          this.isBlinking = false;
          this.blinkTimer = 0;
          this.leftEyelid.visible = false;
          this.rightEyelid.visible = false;
        }
      }
    }

    // 2. EAR AND WHISKER TWITCH
    const earTwitch = Math.sin(time * 3.5) * 0.05;

    if (this.animState !== "bump" && this.animState !== "poke_head") {
      this.leftEarGroup.rotation.z = 0.32 + earTwitch;
      this.rightEarGroup.rotation.z = -0.32 - earTwitch;
    }

    const whiskerWiggle = Math.sin(time * 5) * 0.03;
    this.leftWhiskers.rotation.z = whiskerWiggle;
    this.rightWhiskers.rotation.z = -whiskerWiggle;

    // 3. TAIL
    this.tailTime += dt * 2.8;
    this.tailGroup.rotation.y = Math.sin(this.tailTime) * 0.45;
    this.tailGroup.rotation.z = Math.cos(this.tailTime * 0.7) * 0.15;

    // 4. IMPROVED TALKING ANIMATION
    if (this.isSpeaking) {
      this.talkTime += dt * 13;

      const wave = (Math.sin(this.talkTime) + 1) * 0.5;
      const secondaryWave = (Math.sin(this.talkTime * 2.1) + 1) * 0.5;

      const mouthOpen = 0.025 + wave * 0.15 + secondaryWave * 0.025;

      this.jawMesh.position.y = this.baseJawY - mouthOpen;
      this.jawMesh.scale.y = 0.42 + mouthOpen * 2.2;

      this.tongueMesh.position.y = this.baseTongueY - mouthOpen * 0.35;
      this.tongueMesh.scale.y = 0.5 + wave * 0.25;
      this.tongueMesh.visible = wave > 0.45;

      this.headGroup.position.y =
        this.baseHeadY + Math.abs(Math.sin(this.talkTime)) * 0.025;

      this.headGroup.rotation.z =
        Math.sin(this.talkTime * 0.5) * 0.012;
    } else {
      this.jawMesh.position.y = this.baseJawY;
      this.jawMesh.scale.y = 0.42;
      this.tongueMesh.position.y = this.baseTongueY;
      this.tongueMesh.scale.y = 0.5;
      this.tongueMesh.visible = false;

      this.headGroup.position.y = THREE.MathUtils.lerp(
        this.headGroup.position.y,
        this.baseHeadY,
        0.2
      );

      this.headGroup.rotation.z = THREE.MathUtils.lerp(
        this.headGroup.rotation.z, 0, 0.2
      );
    }

    // 5. ANIMATIONS
    switch (this.animState) {
      case "idle": {
        this.milkSaucerGroup.visible = false;
        this.fishGroup.visible = false;

        const breathe = Math.sin(time * 2.2) * 0.02;
        this.bodyMesh.position.y = 1.28 + breathe;
        this.chestRuffGroup.position.y = 1.48 + breathe;
        this.bellyMesh.position.y = 1.02 + breathe;

        this.leftArmGroup.rotation.set(0, 0, 0);
        this.rightArmGroup.rotation.set(0, 0, 0);
        this.leftLegGroup.rotation.set(0, 0, 0);
        this.rightLegGroup.rotation.set(0, 0, 0);
        this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, 0, 0.08);
        break;
      }

      case "walk": {
        this.milkSaucerGroup.visible = false;
        this.fishGroup.visible = false;

        this.walkTime += dt * this.walkSpeed * 2.5;
        this.group.position.y = Math.abs(Math.sin(this.walkTime)) * 0.12;

        this.leftArmGroup.rotation.x = Math.sin(this.walkTime) * 0.55;
        this.rightArmGroup.rotation.x = -Math.sin(this.walkTime) * 0.55;

        this.leftLegGroup.rotation.x = -Math.sin(this.walkTime) * 0.45;
        this.rightLegGroup.rotation.x = Math.sin(this.walkTime) * 0.45;

        this.tailGroup.rotation.y = Math.sin(this.walkTime * 1.8) * 0.7;
        break;
      }

      case "purr": {
        this.purrTime += dt * 24;
        const vibration = Math.sin(this.purrTime) * 0.015;

        this.group.position.x += vibration * dt * 5;
        this.bodyMesh.scale.set(
          1.04 + vibration * 2,
          1.25,
          0.96 + vibration * 2
        );

        this.headGroup.rotation.x = 0.12;
        this.leftEyelid.visible = true;
        this.rightEyelid.visible = true;
        break;
      }

      case "bump": {
        this.bumpTime += dt * 15;

        this.headGroup.rotation.z = Math.sin(this.bumpTime) * 0.28;
        this.headGroup.rotation.x =
          -0.35 + Math.cos(this.bumpTime * 0.8) * 0.18;

        this.leftEarGroup.rotation.z = 0.55;
        this.rightEarGroup.rotation.z = -0.55;

        this.leftArmGroup.rotation.z =
          -1.1 + Math.sin(this.bumpTime) * 0.35;

        this.rightArmGroup.rotation.z =
          1.1 - Math.sin(this.bumpTime) * 0.35;

        this.bodyMesh.rotation.x = -0.22;
        break;
      }

      case "dance": {
        this.danceTime += dt * 6;

        this.group.position.y = Math.abs(Math.sin(this.danceTime)) * 0.55;
        this.group.rotation.y += dt * 3.6;

        this.leftArmGroup.rotation.z =
          -2.2 + Math.sin(this.danceTime * 2) * 0.3;

        this.rightArmGroup.rotation.z =
          2.2 - Math.sin(this.danceTime * 2) * 0.3;

        this.leftArmGroup.rotation.x = Math.sin(this.danceTime) * 0.4;
        this.rightArmGroup.rotation.x = Math.sin(this.danceTime) * 0.4;

        this.leftLegGroup.rotation.x = Math.sin(this.danceTime * 1.5) * 0.5;
        this.rightLegGroup.rotation.x = -Math.sin(this.danceTime * 1.5) * 0.5;
        break;
      }

      case "sit": {
        this.group.position.y = THREE.MathUtils.lerp(
          this.group.position.y, -0.35, 0.1
        );

        this.leftLegGroup.rotation.x = THREE.MathUtils.lerp(
          this.leftLegGroup.rotation.x, -1.2, 0.1
        );

        this.rightLegGroup.rotation.x = THREE.MathUtils.lerp(
          this.rightLegGroup.rotation.x, -1.2, 0.1
        );

        this.leftArmGroup.rotation.x = -0.9;
        this.rightArmGroup.rotation.x = -0.9;

        this.tailGroup.rotation.y = THREE.MathUtils.lerp(
          this.tailGroup.rotation.y, 1.35, 0.1
        );

        this.tailGroup.rotation.z = 0.25;
        break;
      }

      case "sleep": {
        this.group.position.y = THREE.MathUtils.lerp(
          this.group.position.y, -0.75, 0.1
        );

        this.bodyMesh.rotation.x = THREE.MathUtils.lerp(
          this.bodyMesh.rotation.x, 1.25, 0.1
        );

        this.headGroup.position.set(0, 1.25, 1.05);
        this.headGroup.rotation.x = 0.25;

        this.leftEyelid.visible = true;
        this.rightEyelid.visible = true;

        const napBreath = Math.sin(time * 1.5) * 0.04;

        this.bodyMesh.scale.set(
          1.04 + napBreath,
          1.25 + napBreath,
          0.96
        );
        break;
      }

      case "wave": {
        this.group.position.y = 0;

        const waveTime = time * 12;

        this.rightArmGroup.rotation.z = 2.1;
        this.rightArmGroup.rotation.x = -0.3;
        this.rightArmGroup.rotation.y = Math.sin(waveTime) * 0.55;

        this.leftArmGroup.rotation.set(0, 0, -0.15);
        break;
      }

      case "poke_head": {
        const t = time * 15;

        this.headGroup.rotation.x = -0.45 + Math.sin(t) * 0.2;
        this.headGroup.rotation.y = Math.cos(t) * 0.25;
        this.leftEarGroup.rotation.z = 0.55;
        break;
      }

      case "poke_belly": {
        const t = time * 20;

        this.bodyMesh.scale.z = 0.85 + Math.sin(t) * 0.1;
        this.leftArmGroup.rotation.z = -0.6;
        this.rightArmGroup.rotation.z = 0.6;
        break;
      }

      case "eat_milk": {
        this.milkSaucerGroup.visible = true;
        this.fishGroup.visible = false;

        this.headGroup.rotation.x = 0.15 + Math.sin(time * 12) * 0.08;
        this.jawMesh.position.y = this.baseJawY - Math.abs(Math.sin(time * 12)) * 0.07;
        break;
      }

      case "eat_fish": {
        this.milkSaucerGroup.visible = false;
        this.fishGroup.visible = true;

        this.headGroup.rotation.x = 0.12 + Math.sin(time * 10) * 0.08;
        this.jawMesh.position.y = this.baseJawY - Math.abs(Math.sin(time * 10)) * 0.06;
        break;
      }

      case "pout": {
        const t = time * 12;

        this.group.position.y = Math.sin(t) * 0.15;
        this.tailGroup.rotation.y = Math.sin(t * 3) * 0.8;
        this.headGroup.rotation.x = 0.12;
        break;
      }
    }
  }

  public toggleBow() {
    this.pinkBowGroup.visible = !this.pinkBowGroup.visible;
  }

  public toggleSunglasses() {
    this.sunglassesGroup.visible = !this.sunglassesGroup.visible;
  }

  public toggleHat() {
    this.partyHatGroup.visible = !this.partyHatGroup.visible;
  }
}
