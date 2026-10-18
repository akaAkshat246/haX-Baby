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

  // Major body parts
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

  // Accessories matching reference image
  public pinkBowGroup: THREE.Group;
  public sunglassesGroup: THREE.Group;
  public partyHatGroup: THREE.Group;
  public milkSaucerGroup: THREE.Group;
  public fishGroup: THREE.Group;

  // Animation timing & state
  public animState: CatAnimState = "idle";
  private walkTime: number = 0;
  private danceTime: number = 0;
  private bumpTime: number = 0;
  private purrTime: number = 0;
  private tailTime: number = 0;
  private blinkTimer: number = 0;
  private isBlinking: boolean = false;
  public isSpeaking: boolean = false;
  private talkTime: number = 0;
  public walkSpeed: number = 4.0;

  // Target 3D position & rotation for cursor navigation
  public targetPos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor() {
    this.group = new THREE.Group();

    // 1. Refined PBR Kawaii Materials matching reference image
    // Soft silver-grey tabby coat
    const silverFurMat = new THREE.MeshStandardMaterial({
      color: 0xd8dbe0,
      roughness: 0.85,
      metalness: 0.02,
    });

    // Fluffy cream-white for chest bib, muzzle, cheeks & paws
    const fluffyWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.02,
    });

    // Soft warm grey for gentle tabby markings
    const tabbyStripeMat = new THREE.MeshStandardMaterial({
      color: 0x8a9099,
      roughness: 0.85,
      metalness: 0.02,
    });

    // Delicate baby-pink for inner ears & paw toe beans
    const pinkEarMat = new THREE.MeshStandardMaterial({
      color: 0xffb3c6,
      roughness: 0.6,
      metalness: 0.0,
    });

    // Adorable tiny baby-pink button nose
    const pinkNoseMat = new THREE.MeshStandardMaterial({
      color: 0xff7096,
      roughness: 0.35,
      metalness: 0.1,
    });

    // Cute pink tongue
    const tongueMat = new THREE.MeshStandardMaterial({
      color: 0xff5c8a,
      roughness: 0.45,
    });

    // Airbrushed Rosy Pink Blush on chubby cheeks
    const blushPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff85a1,
      roughness: 0.7,
      transparent: true,
      opacity: 0.65,
    });

    // Gorgeous Glossy Hazel-Amber Anime Kitten Eyes (Matching reference photo!)
    const hazelIrisMat = new THREE.MeshStandardMaterial({
      color: 0xa66326, // rich warm amber/hazel
      roughness: 0.08,
      metalness: 0.4,
    });
    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x0c0712, // deep obsidian black
      roughness: 0.04,
      metalness: 0.9,
    });
    const sparkleHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // Ultra-fine translucent white whiskers
    const whiskerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      transparent: true,
      opacity: 0.75,
    });

    // Iconic Pink Silk Ribbon Bow with Heart Decals
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

    // ==========================================
    // 2. Torso / Chubby Sitting Kitten Body
    // ==========================================
    const bodyGeo = new THREE.SphereGeometry(1.05, 32, 24);
    bodyGeo.scale(1.04, 1.25, 0.96);
    this.bodyMesh = new THREE.Mesh(bodyGeo, silverFurMat);
    this.bodyMesh.position.y = 1.28;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.bodyMesh.userData = { part: "belly" };
    this.group.add(this.bodyMesh);

    // Fluffy White Chest Ruff / Bib (Layered soft puffs like reference image!)
    this.chestRuffGroup = new THREE.Group();
    this.chestRuffGroup.position.set(0, 1.48, 0.48);

    const ruffCenterGeo = new THREE.SphereGeometry(0.72, 24, 18);
    ruffCenterGeo.scale(0.95, 1.15, 0.62);
    const ruffCenter = new THREE.Mesh(ruffCenterGeo, fluffyWhiteMat);
    this.chestRuffGroup.add(ruffCenter);

    // Side fluffy tufts on chest
    const tuftGeo = new THREE.SphereGeometry(0.38, 16, 12);
    tuftGeo.scale(1.1, 0.9, 0.7);

    const leftTuft = new THREE.Mesh(tuftGeo, fluffyWhiteMat);
    leftTuft.position.set(-0.42, -0.15, 0.12);
    this.chestRuffGroup.add(leftTuft);

    const rightTuft = new THREE.Mesh(tuftGeo, fluffyWhiteMat);
    rightTuft.position.set(0.42, -0.15, 0.12);
    this.chestRuffGroup.add(rightTuft);

    this.group.add(this.chestRuffGroup);

    // Soft White Kitten Belly
    const bellyGeo = new THREE.SphereGeometry(0.82, 24, 18);
    bellyGeo.scale(0.88, 1.05, 0.58);
    this.bellyMesh = new THREE.Mesh(bellyGeo, fluffyWhiteMat);
    this.bellyMesh.position.set(0, 1.02, 0.45);
    this.bellyMesh.userData = { part: "belly" };
    this.group.add(this.bellyMesh);

    // Subtle Tabby Stripes on Back
    [-0.25, 0.05, 0.35].forEach((yOff, idx) => {
      const stripeGeo = new THREE.TorusGeometry(0.96 - idx * 0.05, 0.04, 8, 24, Math.PI * 0.7);
      const stripeMesh = new THREE.Mesh(stripeGeo, tabbyStripeMat);
      stripeMesh.position.set(0, 1.35 + yOff, -0.12);
      stripeMesh.rotation.x = Math.PI / 2;
      stripeMesh.rotation.z = Math.PI * 0.15;
      this.group.add(stripeMesh);
    });

    // ==========================================
    // 3. Head & Kawaii Kitten Face (Ultra Cute Proportions!)
    // ==========================================
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.58, 0.12);

    // Round, plush baby kitten head
    const headGeo = new THREE.SphereGeometry(1.18, 32, 24);
    headGeo.scale(1.26, 1.12, 1.05);
    const headMesh = new THREE.Mesh(headGeo, silverFurMat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headMesh.userData = { part: "head" };
    this.headGroup.add(headMesh);

    // Puffy Fluffy White Cheeks (Kawaii chubbiness!)
    const cheekGeo = new THREE.SphereGeometry(0.65, 22, 18);
    cheekGeo.scale(1.15, 0.92, 0.75);

    const leftCheek = new THREE.Mesh(cheekGeo, fluffyWhiteMat);
    leftCheek.position.set(-0.62, -0.22, 0.52);
    this.headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, fluffyWhiteMat);
    rightCheek.position.set(0.62, -0.22, 0.52);
    this.headGroup.add(rightCheek);

    // Soft Airbrushed Rosy Pink Blush Spots
    const blushGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.03, 20);
    blushGeo.rotateX(Math.PI / 2);

    const leftBlush = new THREE.Mesh(blushGeo, blushPinkMat);
    leftBlush.position.set(-0.7, -0.16, 0.94);
    leftBlush.rotation.y = -0.22;
    this.headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushPinkMat);
    rightBlush.position.set(0.7, -0.16, 0.94);
    rightBlush.rotation.y = 0.22;
    this.headGroup.add(rightBlush);

    // Soft Forehead Tabby Markings (Gentle, cute stripes - NOT harsh wrinkles!)
    const foreGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.38, 8);
    const centerStripe = new THREE.Mesh(foreGeo, tabbyStripeMat);
    centerStripe.position.set(0, 0.75, 0.96);
    centerStripe.rotation.x = -0.28;
    this.headGroup.add(centerStripe);

    const lForeStripe = new THREE.Mesh(foreGeo, tabbyStripeMat);
    lForeStripe.position.set(-0.24, 0.72, 0.93);
    lForeStripe.rotation.x = -0.28;
    lForeStripe.rotation.z = -0.2;
    this.headGroup.add(lForeStripe);

    const rForeStripe = new THREE.Mesh(foreGeo, tabbyStripeMat);
    rForeStripe.position.set(0.24, 0.72, 0.93);
    rForeStripe.rotation.x = -0.28;
    rForeStripe.rotation.z = 0.2;
    this.headGroup.add(rForeStripe);

    // ==========================================
    // 4. Pointed Kitten Ears with Pink Inner Fluff & White Tufts
    // ==========================================
    const earGeo = new THREE.ConeGeometry(0.52, 1.05, 18);
    earGeo.scale(1.15, 1.0, 0.42);

    // Left Ear
    this.leftEarGroup = new THREE.Group();
    this.leftEarGroup.position.set(-0.84, 1.05, 0.05);
    this.leftEarGroup.rotation.z = 0.32;
    this.leftEarGroup.rotation.y = 0.14;
    this.leftEarGroup.rotation.x = -0.12;

    const leftEarMesh = new THREE.Mesh(earGeo, silverFurMat);
    leftEarMesh.castShadow = true;
    this.leftEarGroup.add(leftEarMesh);

    // Soft Pink Inner Ear Cavity
    const innerEarGeo = new THREE.ConeGeometry(0.4, 0.88, 16);
    innerEarGeo.scale(1.05, 1.0, 0.3);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, pinkEarMat);
    leftInnerEar.position.set(0, -0.04, 0.09);
    this.leftEarGroup.add(leftInnerEar);

    // Cute White Fluff Tuft at Base of Ear
    const earTuftGeo = new THREE.SphereGeometry(0.22, 12, 10);
    const leftEarTuft = new THREE.Mesh(earTuftGeo, fluffyWhiteMat);
    leftEarTuft.position.set(0.12, -0.38, 0.16);
    this.leftEarGroup.add(leftEarTuft);

    this.headGroup.add(this.leftEarGroup);

    // Right Ear
    this.rightEarGroup = new THREE.Group();
    this.rightEarGroup.position.set(0.84, 1.05, 0.05);
    this.rightEarGroup.rotation.z = -0.32;
    this.rightEarGroup.rotation.y = -0.14;
    this.rightEarGroup.rotation.x = -0.12;

    const rightEarMesh = new THREE.Mesh(earGeo, silverFurMat);
    rightEarMesh.castShadow = true;
    this.rightEarGroup.add(rightEarMesh);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, pinkEarMat);
    rightInnerEar.position.set(0, -0.04, 0.09);
    this.rightEarGroup.add(rightInnerEar);

    const rightEarTuft = new THREE.Mesh(earTuftGeo, fluffyWhiteMat);
    rightEarTuft.position.set(-0.12, -0.38, 0.16);
    this.rightEarGroup.add(rightEarTuft);

    this.headGroup.add(this.rightEarGroup);

    // ==========================================
    // 5. Pretty Pink Ribbon Bow (Matching reference image hero element!)
    // ==========================================
    this.pinkBowGroup = new THREE.Group();
    // Scaled & placed delicately right at the base of the left ear
    this.pinkBowGroup.position.set(-0.75, 0.95, 0.42);
    this.pinkBowGroup.rotation.z = -0.32;
    this.pinkBowGroup.rotation.y = 0.22;
    this.pinkBowGroup.rotation.x = 0.12;

    // Center Ribbon Knot
    const knotGeo = new THREE.SphereGeometry(0.17, 16, 14);
    knotGeo.scale(1.0, 0.85, 0.65);
    const knotMesh = new THREE.Mesh(knotGeo, bowKnotMat);
    this.pinkBowGroup.add(knotMesh);

    // Left Ribbon Loop (Plush, soft curvature)
    const loopGeo = new THREE.TorusGeometry(0.32, 0.13, 14, 24);
    loopGeo.scale(1.3, 0.85, 0.4);
    const leftLoop = new THREE.Mesh(loopGeo, bowSilkMat);
    leftLoop.position.set(-0.34, 0.06, 0);
    leftLoop.rotation.z = 0.22;
    this.pinkBowGroup.add(leftLoop);

    // Right Ribbon Loop
    const rightLoop = new THREE.Mesh(loopGeo, bowSilkMat);
    rightLoop.position.set(0.34, 0.06, 0);
    rightLoop.rotation.z = -0.22;
    this.pinkBowGroup.add(rightLoop);

    // Cute Ribbon Tails
    const tailGeo = new THREE.BoxGeometry(0.16, 0.4, 0.04);
    const leftTail = new THREE.Mesh(tailGeo, bowSilkMat);
    leftTail.position.set(-0.14, -0.28, 0.02);
    leftTail.rotation.z = 0.35;
    this.pinkBowGroup.add(leftTail);

    const rightTail = new THREE.Mesh(tailGeo, bowSilkMat);
    rightTail.position.set(0.14, -0.28, 0.02);
    rightTail.rotation.z = -0.35;
    this.pinkBowGroup.add(rightTail);

    // Tiny White Heart/Polka Accents
    const heartGeo = new THREE.SphereGeometry(0.05, 8, 8);
    [-0.28, -0.42, 0.28, 0.42].forEach((xVal) => {
      const heartDot = new THREE.Mesh(heartGeo, whiteHeartMat);
      heartDot.position.set(xVal, 0.08, 0.08);
      this.pinkBowGroup.add(heartDot);
    });

    this.headGroup.add(this.pinkBowGroup);

    // ==========================================
    // 6. Cute Kitten Muzzle, Nose, Mouth & Delicate Whiskers (:3 smile)
    // ==========================================
    this.muzzleGroup = new THREE.Group();
    this.muzzleGroup.position.set(0, -0.22, 0.98);

    // Cute compact Whisker Pads (forming the classic soft ":3" cat smile)
    const padGeo = new THREE.SphereGeometry(0.24, 18, 14);
    padGeo.scale(1.15, 0.85, 0.6);

    const leftPad = new THREE.Mesh(padGeo, fluffyWhiteMat);
    leftPad.position.set(-0.18, 0.04, 0.12);
    this.muzzleGroup.add(leftPad);

    const rightPad = new THREE.Mesh(padGeo, fluffyWhiteMat);
    rightPad.position.set(0.18, 0.04, 0.12);
    this.muzzleGroup.add(rightPad);

    // Tiny Baby Pink Triangular Kitten Button Nose
    const noseGeo = new THREE.ConeGeometry(0.1, 0.13, 3);
    noseGeo.rotateX(Math.PI);
    noseGeo.scale(1.2, 0.85, 0.5);
    const noseMesh = new THREE.Mesh(noseGeo, pinkNoseMat);
    noseMesh.position.set(0, 0.15, 0.26);
    this.muzzleGroup.add(noseMesh);

    // Smiling Lower Jaw & Cute Pink Tongue
    const jawGeo = new THREE.CylinderGeometry(0.16, 0.11, 0.1, 16);
    jawGeo.rotateX(Math.PI / 2);
    this.jawMesh = new THREE.Mesh(jawGeo, tongueMat);
    this.jawMesh.position.set(0, -0.11, 0.16);
    this.muzzleGroup.add(this.jawMesh);

    // Tiny pink tongue tip peeking out
    const tongueTipGeo = new THREE.SphereGeometry(0.07, 10, 8);
    tongueTipGeo.scale(1.2, 0.5, 1.0);
    this.tongueMesh = new THREE.Mesh(tongueTipGeo, tongueMat);
    this.tongueMesh.position.set(0, -0.1, 0.22);
    this.muzzleGroup.add(this.tongueMesh);

    // Ultra-Fine, Delicate Whiskers (Thin, curved naturally downward-outward)
    this.leftWhiskers = new THREE.Group();
    this.leftWhiskers.position.set(-0.25, 0.04, 0.18);

    [-0.12, 0.0, 0.12].forEach((angle, idx) => {
      const whiskerGeo = new THREE.CylinderGeometry(0.003, 0.001, 0.7, 4);
      whiskerGeo.rotateZ(Math.PI / 2 + angle);
      const whisker = new THREE.Mesh(whiskerGeo, whiskerMat);
      whisker.position.set(-0.35, angle * 0.35, idx * 0.02);
      this.leftWhiskers.add(whisker);
    });
    this.muzzleGroup.add(this.leftWhiskers);

    this.rightWhiskers = new THREE.Group();
    this.rightWhiskers.position.set(0.25, 0.04, 0.18);

    [-0.12, 0.0, 0.12].forEach((angle, idx) => {
      const whiskerGeo = new THREE.CylinderGeometry(0.003, 0.001, 0.7, 4);
      whiskerGeo.rotateZ(-Math.PI / 2 - angle);
      const whisker = new THREE.Mesh(whiskerGeo, whiskerMat);
      whisker.position.set(0.35, angle * 0.35, idx * 0.02);
      this.rightWhiskers.add(whisker);
    });
    this.muzzleGroup.add(this.rightWhiskers);

    this.headGroup.add(this.muzzleGroup);

    // ==========================================
    // 7. Giant Glistening Hazel-Amber Anime Eyes (With Double Sparkles!)
    // ==========================================
    const eyeBaseGeo = new THREE.SphereGeometry(0.34, 24, 20);
    eyeBaseGeo.scale(1.0, 1.15, 0.55);

    // Left Eye
    this.leftEyeGroup = new THREE.Group();
    this.leftEyeGroup.position.set(-0.46, 0.18, 0.98);
    this.leftEyeGroup.rotation.y = -0.15;
    this.leftEyeGroup.rotation.z = 0.03;

    const leftIris = new THREE.Mesh(eyeBaseGeo, hazelIrisMat);
    this.leftEyeGroup.add(leftIris);

    // Deep Obsidian Pupil
    const pupilGeo = new THREE.SphereGeometry(0.22, 18, 16);
    pupilGeo.scale(0.88, 1.12, 0.3);
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(0, 0, 0.14);
    this.leftEyeGroup.add(leftPupil);

    // Specular Sparkle Highlight 1 (Large Top Sparkle)
    const hlBigGeo = new THREE.SphereGeometry(0.09, 12, 10);
    const leftHl1 = new THREE.Mesh(hlBigGeo, sparkleHighlightMat);
    leftHl1.position.set(-0.07, 0.1, 0.24);
    this.leftEyeGroup.add(leftHl1);

    // Specular Sparkle Highlight 2 (Mini Bottom Sparkle)
    const hlSmallGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const leftHl2 = new THREE.Mesh(hlSmallGeo, sparkleHighlightMat);
    leftHl2.position.set(0.09, -0.09, 0.24);
    this.leftEyeGroup.add(leftHl2);

    // Natural Blinking Eyelid
    const eyelidGeo = new THREE.SphereGeometry(0.36, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2);
    this.leftEyelid = new THREE.Mesh(eyelidGeo, silverFurMat);
    this.leftEyelid.position.set(0, 0, 0.02);
    this.leftEyelid.rotation.x = -Math.PI / 2;
    this.leftEyelid.visible = false;
    this.leftEyeGroup.add(this.leftEyelid);

    this.headGroup.add(this.leftEyeGroup);

    // Right Eye
    this.rightEyeGroup = new THREE.Group();
    this.rightEyeGroup.position.set(0.46, 0.18, 0.98);
    this.rightEyeGroup.rotation.y = 0.15;
    this.rightEyeGroup.rotation.z = -0.03;

    const rightIris = new THREE.Mesh(eyeBaseGeo, hazelIrisMat);
    this.rightEyeGroup.add(rightIris);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0, 0, 0.14);
    this.rightEyeGroup.add(rightPupil);

    const rightHl1 = new THREE.Mesh(hlBigGeo, sparkleHighlightMat);
    rightHl1.position.set(-0.07, 0.1, 0.24);
    this.rightEyeGroup.add(rightHl1);

    const rightHl2 = new THREE.Mesh(hlSmallGeo, sparkleHighlightMat);
    rightHl2.position.set(0.09, -0.09, 0.24);
    this.rightEyeGroup.add(rightHl2);

    this.rightEyelid = new THREE.Mesh(eyelidGeo, silverFurMat);
    this.rightEyelid.position.set(0, 0, 0.02);
    this.rightEyelid.rotation.x = -Math.PI / 2;
    this.rightEyelid.visible = false;
    this.rightEyeGroup.add(this.rightEyelid);

    this.headGroup.add(this.rightEyeGroup);
    this.group.add(this.headGroup);

    // ==========================================
    // 8. Chubby Sitting Kitten Paws with Pink Toe Beans
    // ==========================================
    const pawGeo = new THREE.SphereGeometry(0.34, 18, 14);
    pawGeo.scale(1.05, 0.75, 1.25);

    // Front Left Arm & Paw (Placed neatly side-by-side like sitting kitten in reference!)
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.38, 1.28, 0.38);

    const armGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.82, 16);
    const leftArmMesh = new THREE.Mesh(armGeo, silverFurMat);
    leftArmMesh.position.y = -0.4;
    this.leftArmGroup.add(leftArmMesh);

    // Snowy White Front Paws
    const leftPawMesh = new THREE.Mesh(pawGeo, fluffyWhiteMat);
    leftPawMesh.position.set(0, -0.82, 0.2);
    leftPawMesh.castShadow = true;
    this.leftArmGroup.add(leftPawMesh);

    // Baby Pink Paw Cushion / Toe Beans
    const beanCenterGeo = new THREE.SphereGeometry(0.1, 10, 8);
    beanCenterGeo.scale(1.2, 0.4, 1.0);
    const leftCenterBean = new THREE.Mesh(beanCenterGeo, pinkEarMat);
    leftCenterBean.position.set(0, -0.9, 0.18);
    this.leftArmGroup.add(leftCenterBean);

    this.group.add(this.leftArmGroup);

    // Front Right Arm & Paw
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.38, 1.28, 0.38);

    const rightArmMesh = new THREE.Mesh(armGeo, silverFurMat);
    rightArmMesh.position.y = -0.4;
    this.rightArmGroup.add(rightArmMesh);

    const rightPawMesh = new THREE.Mesh(pawGeo, fluffyWhiteMat);
    rightPawMesh.position.set(0, -0.82, 0.2);
    rightPawMesh.castShadow = true;
    this.rightArmGroup.add(rightPawMesh);

    const rightCenterBean = new THREE.Mesh(beanCenterGeo, pinkEarMat);
    rightCenterBean.position.set(0, -0.9, 0.18);
    this.rightArmGroup.add(rightCenterBean);

    this.group.add(this.rightArmGroup);

    // Hind Sitting Thighs & Paws
    const hindThighGeo = new THREE.SphereGeometry(0.48, 16, 14);
    hindThighGeo.scale(0.85, 1.1, 1.0);

    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.68, 0.45, 0.0);
    const leftHindThigh = new THREE.Mesh(hindThighGeo, silverFurMat);
    this.leftLegGroup.add(leftHindThigh);

    const leftHindPaw = new THREE.Mesh(pawGeo, fluffyWhiteMat);
    leftHindPaw.position.set(0.08, -0.32, 0.38);
    this.leftLegGroup.add(leftHindPaw);
    this.group.add(this.leftLegGroup);

    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.68, 0.45, 0.0);
    const rightHindThigh = new THREE.Mesh(hindThighGeo, silverFurMat);
    this.rightLegGroup.add(rightHindThigh);

    const rightHindPaw = new THREE.Mesh(pawGeo, fluffyWhiteMat);
    rightHindPaw.position.set(-0.08, -0.32, 0.38);
    this.rightLegGroup.add(rightHindPaw);
    this.group.add(this.rightLegGroup);

    // ==========================================
    // 9. Fluffy Curved Kitten Tail with White Tip
    // ==========================================
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.55, -0.85);

    const tailSegCount = 7;
    let prevSeg = this.tailGroup;

    for (let i = 0; i < tailSegCount; i++) {
      const radius = THREE.MathUtils.lerp(0.18, 0.11, i / tailSegCount);
      const length = 0.28;
      const segGeo = new THREE.CylinderGeometry(radius * 0.9, radius, length, 12);
      const isTip = i >= tailSegCount - 2;
      const mat = isTip ? fluffyWhiteMat : silverFurMat;
      const segMesh = new THREE.Mesh(segGeo, mat);
      segMesh.position.y = length * 0.5;
      segMesh.castShadow = true;

      const segGroup = new THREE.Group();
      segGroup.position.y = i === 0 ? 0 : length * 0.88;
      segGroup.rotation.x = -0.22 + i * 0.06;
      segGroup.add(segMesh);

      prevSeg.add(segGroup);
      prevSeg = segGroup;
    }

    const tipGeo = new THREE.SphereGeometry(0.17, 12, 10);
    const tailTip = new THREE.Mesh(tipGeo, fluffyWhiteMat);
    tailTip.position.y = 0.28;
    prevSeg.add(tailTip);

    this.group.add(this.tailGroup);

    // ==========================================
    // 10. Accessories (Sunglasses, Party Hat, Milk Saucer, Fish)
    // ==========================================
    this.sunglassesGroup = new THREE.Group();
    this.sunglassesGroup.position.set(0, 0.18, 1.2);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111116, metalness: 0.95, roughness: 0.1 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xff4081, metalness: 0.7, roughness: 0.3 });

    const lFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 20), frameMat);
    lFrame.rotateX(Math.PI / 2);
    lFrame.position.set(-0.45, 0, 0);
    this.sunglassesGroup.add(lFrame);

    const rFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 20), frameMat);
    rFrame.rotateX(Math.PI / 2);
    rFrame.position.set(0.45, 0, 0);
    this.sunglassesGroup.add(rFrame);

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.04), frameMat);
    bridge.position.set(0, 0, 0);
    this.sunglassesGroup.add(bridge);

    this.sunglassesGroup.visible = false;
    this.headGroup.add(this.sunglassesGroup);

    // Party Crown
    this.partyHatGroup = new THREE.Group();
    this.partyHatGroup.position.set(0, 1.25, 0.1);
    const coneGeo = new THREE.ConeGeometry(0.38, 0.75, 18);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.6, roughness: 0.3 });
    const hatMesh = new THREE.Mesh(coneGeo, coneMat);
    this.partyHatGroup.add(hatMesh);

    const pompGeo = new THREE.SphereGeometry(0.1, 10, 8);
    const pompMesh = new THREE.Mesh(pompGeo, new THREE.MeshStandardMaterial({ color: 0xff477e }));
    pompMesh.position.y = 0.42;
    this.partyHatGroup.add(pompMesh);

    this.partyHatGroup.visible = false;
    this.headGroup.add(this.partyHatGroup);

    // Milk Saucer
    this.milkSaucerGroup = new THREE.Group();
    this.milkSaucerGroup.position.set(0, 0.1, 0.95);
    const saucerGeo = new THREE.CylinderGeometry(0.48, 0.35, 0.12, 24);
    const saucerMesh = new THREE.Mesh(saucerGeo, new THREE.MeshStandardMaterial({ color: 0xffccd5 }));
    this.milkSaucerGroup.add(saucerMesh);

    const milkSurface = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.02, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })
    );
    milkSurface.position.y = 0.06;
    this.milkSaucerGroup.add(milkSurface);
    this.milkSaucerGroup.visible = false;
    this.group.add(this.milkSaucerGroup);

    // Crispy Tuna Fish
    this.fishGroup = new THREE.Group();
    this.fishGroup.position.set(0, 0.95, 0.85);
    const fishBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.4 })
    );
    fishBody.scale.set(1.6, 0.8, 0.5);
    this.fishGroup.add(fishBody);

    const fishTail = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.28, 12),
      new THREE.MeshStandardMaterial({ color: 0x0284c7 })
    );
    fishTail.rotateZ(-Math.PI / 2);
    fishTail.position.set(-0.45, 0, 0);
    this.fishGroup.add(fishTail);
    this.fishGroup.visible = false;
    this.group.add(this.fishGroup);
  }

  // Smooth Head & Eyes Tracking towards 3D target coordinates
  public lookAtTarget(worldPoint: THREE.Vector3) {
    if (this.animState === "sleep") return;

    const localPoint = this.group.worldToLocal(worldPoint.clone());
    const targetRotY = Math.max(-0.55, Math.min(0.55, localPoint.x * 0.16));
    const targetRotX = Math.max(-0.35, Math.min(0.35, -localPoint.y * 0.1 + 0.08));

    this.headGroup.rotation.y = THREE.MathUtils.lerp(this.headGroup.rotation.y, targetRotY, 0.08);
    this.headGroup.rotation.x = THREE.MathUtils.lerp(this.headGroup.rotation.x, targetRotX, 0.08);

    // Eye pupils tracking
    const eyeOffsetX = targetRotY * 0.05;
    const eyeOffsetY = targetRotX * 0.05;
    this.leftEyeGroup.position.x = -0.46 + eyeOffsetX;
    this.leftEyeGroup.position.y = 0.18 + eyeOffsetY;
    this.rightEyeGroup.position.x = 0.46 + eyeOffsetX;
    this.rightEyeGroup.position.y = 0.18 + eyeOffsetY;
  }

  // 60FPS Animation Update
  public update(delta: number) {
    const time = performance.now() * 0.001;

    // 1. Natural Kitten Blinking
    this.blinkTimer += delta;
    if (this.blinkTimer > 3.2 + Math.sin(time) * 1.5) {
      this.isBlinking = true;
      this.leftEyelid.visible = true;
      this.rightEyelid.visible = true;
      if (this.blinkTimer > 3.4 + Math.sin(time) * 1.5) {
        this.isBlinking = false;
        this.leftEyelid.visible = false;
        this.rightEyelid.visible = false;
        this.blinkTimer = 0;
      }
    }

    // 2. Whisker and Ear Micro-Twitching
    const earTwitch = Math.sin(time * 3.5) * 0.05;
    this.leftEarGroup.rotation.z = 0.32 + earTwitch;
    this.rightEarGroup.rotation.z = -0.32 - earTwitch;

    const whiskerWiggle = Math.sin(time * 5.0) * 0.03;
    this.leftWhiskers.rotation.z = whiskerWiggle;
    this.rightWhiskers.rotation.z = -whiskerWiggle;

    // 3. Tail Swish (Gentle organic feline tail motion)
    this.tailTime += delta * 2.8;
    this.tailGroup.rotation.y = Math.sin(this.tailTime) * 0.45;
    this.tailGroup.rotation.z = Math.cos(this.tailTime * 0.7) * 0.15;

    // 4. Talking & Meowing Mouth Animation
    if (this.isSpeaking) {
      this.talkTime += delta * 18;
      const mouthOpen = (Math.sin(this.talkTime) * 0.5 + 0.5) * 0.12;
      this.jawMesh.position.y = -0.11 - mouthOpen;
      this.tongueMesh.position.y = -0.1 - mouthOpen * 0.5;
      this.headGroup.position.y = 2.58 + Math.sin(this.talkTime * 0.5) * 0.03;
    } else {
      this.jawMesh.position.y = -0.11;
      this.tongueMesh.position.y = -0.1;
    }

    // 5. State Machine Animations
    switch (this.animState) {
      case "idle": {
        this.milkSaucerGroup.visible = false;
        this.fishGroup.visible = false;

        // Gentle breathing bob
        const breathe = Math.sin(time * 2.2) * 0.02;
        this.bodyMesh.position.y = 1.28 + breathe;
        this.chestRuffGroup.position.y = 1.48 + breathe;
        this.bellyMesh.position.y = 1.02 + breathe;

        this.leftArmGroup.rotation.set(0, 0, 0);
        this.rightArmGroup.rotation.set(0, 0, 0);
        this.leftLegGroup.rotation.set(0, 0, 0);
        this.rightLegGroup.rotation.set(0, 0, 0);
        break;
      }

      case "walk": {
        this.milkSaucerGroup.visible = false;
        this.fishGroup.visible = false;

        this.walkTime += delta * this.walkSpeed * 2.5;

        // Bouncy kitten trot!
        this.group.position.y = 0 + Math.abs(Math.sin(this.walkTime)) * 0.12;

        this.leftArmGroup.rotation.x = Math.sin(this.walkTime) * 0.55;
        this.rightArmGroup.rotation.x = -Math.sin(this.walkTime) * 0.55;

        this.leftLegGroup.rotation.x = -Math.sin(this.walkTime) * 0.45;
        this.rightLegGroup.rotation.x = Math.sin(this.walkTime) * 0.45;

        this.tailGroup.rotation.y = Math.sin(this.walkTime * 1.8) * 0.7;
        break;
      }

      case "purr": {
        this.purrTime += delta * 24;
        const purrVibe = Math.sin(this.purrTime) * 0.015;
        this.group.position.x += purrVibe;
        this.bodyMesh.scale.set(1.04 + purrVibe * 2, 1.25, 0.96 + purrVibe * 2);

        this.headGroup.rotation.x = 0.12;
        this.leftEyelid.visible = true;
        this.rightEyelid.visible = true;
        break;
      }

      case "bump": {
        // Obstacle Bump Reaction!
        this.bumpTime += delta * 15;
        this.headGroup.rotation.z = Math.sin(this.bumpTime) * 0.28;
        this.headGroup.rotation.x = -0.35 + Math.cos(this.bumpTime * 0.8) * 0.18;

        this.leftEarGroup.rotation.z = 0.55;
        this.rightEarGroup.rotation.z = -0.55;

        this.leftArmGroup.rotation.z = -1.1 + Math.sin(this.bumpTime) * 0.35;
        this.rightArmGroup.rotation.z = 1.1 - Math.sin(this.bumpTime) * 0.35;
        this.bodyMesh.rotation.x = -0.22;
        break;
      }

      case "dance": {
        this.danceTime += delta * 6;
        this.group.position.y = 0 + Math.abs(Math.sin(this.danceTime)) * 0.55;
        this.group.rotation.y += delta * 3.6;

        this.leftArmGroup.rotation.z = -2.2 + Math.sin(this.danceTime * 2) * 0.3;
        this.rightArmGroup.rotation.z = 2.2 - Math.sin(this.danceTime * 2) * 0.3;
        this.leftArmGroup.rotation.x = Math.sin(this.danceTime) * 0.4;
        this.rightArmGroup.rotation.x = Math.sin(this.danceTime) * 0.4;

        this.leftLegGroup.rotation.x = Math.sin(this.danceTime * 1.5) * 0.5;
        this.rightLegGroup.rotation.x = -Math.sin(this.danceTime * 1.5) * 0.5;
        break;
      }

      case "sit": {
        this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, -0.35, 0.1);
        this.leftLegGroup.rotation.x = THREE.MathUtils.lerp(this.leftLegGroup.rotation.x, -1.2, 0.1);
        this.rightLegGroup.rotation.x = THREE.MathUtils.lerp(this.rightLegGroup.rotation.x, -1.2, 0.1);

        this.leftArmGroup.rotation.x = -0.9;
        this.rightArmGroup.rotation.x = -0.9;

        this.tailGroup.rotation.y = THREE.MathUtils.lerp(this.tailGroup.rotation.y, 1.35, 0.1);
        this.tailGroup.rotation.z = 0.25;
        break;
      }

      case "sleep": {
        this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, -0.75, 0.1);
        this.bodyMesh.rotation.x = THREE.MathUtils.lerp(this.bodyMesh.rotation.x, 1.25, 0.1);
        this.headGroup.position.set(0, 1.25, 1.05);
        this.headGroup.rotation.x = 0.25;

        this.leftEyelid.visible = true;
        this.rightEyelid.visible = true;

        const napBreath = Math.sin(time * 1.5) * 0.04;
        this.bodyMesh.scale.set(1.04 + napBreath, 1.25 + napBreath, 0.96);
        break;
      }

      case "wave": {
        this.group.position.y = 0;
        const waveT = performance.now() * 0.012;
        this.rightArmGroup.rotation.z = 2.1;
        this.rightArmGroup.rotation.x = -0.3;
        this.rightArmGroup.rotation.y = Math.sin(waveT) * 0.55;

        this.leftArmGroup.rotation.set(0, 0, -0.15);
        break;
      }

      case "poke_head": {
        const t = performance.now() * 0.015;
        this.headGroup.rotation.x = -0.45 + Math.sin(t) * 0.2;
        this.headGroup.rotation.y = Math.cos(t) * 0.25;
        this.leftEarGroup.rotation.z = 0.55;
        break;
      }

      case "poke_belly": {
        const t = performance.now() * 0.02;
        this.bodyMesh.scale.z = 0.85 + Math.sin(t) * 0.1;
        this.leftArmGroup.rotation.z = -0.6;
        this.rightArmGroup.rotation.z = 0.6;
        break;
      }

      case "pout": {
        const t = performance.now() * 0.012;
        this.group.position.y = Math.sin(t) * 0.15;
        this.tailGroup.rotation.y = Math.sin(t * 3) * 0.8;
        break;
      }
    }
  }

  // Toggles for accessories
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
