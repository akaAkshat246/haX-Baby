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

  // Major feline body parts
  public bodyMesh: THREE.Mesh;
  public chestRuffMesh: THREE.Mesh;
  public bellyMesh: THREE.Mesh;
  public headGroup: THREE.Group;
  public muzzleGroup: THREE.Group;
  public jawMesh: THREE.Mesh;
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
  public tailTipMesh: THREE.Mesh;

  // Iconic Accessories matching reference image
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

    // 1. Premium PBR Materials matching reference cute cat image
    // Soft silver-grey tabby coat
    const silverFurMat = new THREE.MeshStandardMaterial({
      color: 0xd6d9de,
      roughness: 0.82,
      metalness: 0.05,
    });

    // Fluffy cream-white chest, muzzle, belly & paws
    const whiteFurMat = new THREE.MeshStandardMaterial({
      color: 0xfbfaf8,
      roughness: 0.85,
      metalness: 0.04,
    });

    // Charcoal-grey tabby stripes
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0x6e737c,
      roughness: 0.8,
      metalness: 0.05,
    });

    // Soft baby-pink inner ear & paw toe beans
    const pinkInnerEarMat = new THREE.MeshStandardMaterial({
      color: 0xffafc4,
      roughness: 0.65,
      metalness: 0.0,
    });

    // Sweet baby-pink nose
    const pinkNoseMat = new THREE.MeshStandardMaterial({
      color: 0xff7b9d,
      roughness: 0.35,
      metalness: 0.1,
    });

    // Mouth / Tongue
    const mouthMat = new THREE.MeshStandardMaterial({
      color: 0xff6b8d,
      roughness: 0.5,
    });

    // Rosy pink blush on chubby cheeks
    const blushMat = new THREE.MeshStandardMaterial({
      color: 0xff8ca5,
      roughness: 0.7,
      transparent: true,
      opacity: 0.75,
    });

    // Iconic Pink Bow Material with polka/heart accent
    const bowPinkMat = new THREE.MeshStandardMaterial({
      color: 0xff668c,
      roughness: 0.45,
      metalness: 0.08,
    });
    const bowCenterMat = new THREE.MeshStandardMaterial({
      color: 0xff4873,
      roughness: 0.4,
      metalness: 0.1,
    });
    const whiteDecalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    });

    // Glistening Hazel-Amber Anime Eyes (Matching reference image!)
    const amberIrisMat = new THREE.MeshStandardMaterial({
      color: 0xa85e26, // rich honey amber
      roughness: 0.12,
      metalness: 0.65,
    });
    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x0a070e,
      roughness: 0.05,
      metalness: 0.9,
    });
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const eyelashMat = new THREE.MeshBasicMaterial({
      color: 0x221820,
    });

    // Whisker material
    const whiskerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.3,
      transparent: true,
      opacity: 0.88,
    });

    // ==========================================
    // 2. Torso / Chubby Kitten Body
    // ==========================================
    const bodyGeo = new THREE.SphereGeometry(1.05, 32, 24);
    bodyGeo.scale(1.02, 1.25, 0.98);
    this.bodyMesh = new THREE.Mesh(bodyGeo, silverFurMat);
    this.bodyMesh.position.y = 1.28;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.bodyMesh.userData = { part: "belly" };
    this.group.add(this.bodyMesh);

    // Fluffy White Chest Ruff / Bib (Like reference photo!)
    const ruffGeo = new THREE.SphereGeometry(0.78, 24, 18);
    ruffGeo.scale(0.92, 1.15, 0.65);
    this.chestRuffMesh = new THREE.Mesh(ruffGeo, whiteFurMat);
    this.chestRuffMesh.position.set(0, 1.45, 0.46);
    this.chestRuffMesh.userData = { part: "belly" };
    this.group.add(this.chestRuffMesh);

    // Cream-White Kitten Belly
    const bellyGeo = new THREE.SphereGeometry(0.85, 24, 18);
    bellyGeo.scale(0.88, 1.05, 0.62);
    this.bellyMesh = new THREE.Mesh(bellyGeo, whiteFurMat);
    this.bellyMesh.position.set(0, 1.05, 0.44);
    this.bellyMesh.userData = { part: "belly" };
    this.group.add(this.bellyMesh);

    // Subtle Tabby Stripes on Back / Sides
    [-0.3, 0.0, 0.3].forEach((yOff, idx) => {
      const stripeGeo = new THREE.TorusGeometry(0.98 - idx * 0.04, 0.045, 8, 24, Math.PI * 0.8);
      const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
      stripeMesh.position.set(0, 1.35 + yOff, -0.1);
      stripeMesh.rotation.x = Math.PI / 2;
      stripeMesh.rotation.z = Math.PI * 0.1;
      this.group.add(stripeMesh);
    });

    // ==========================================
    // 3. Head & Cute Kawaii Kitten Face
    // ==========================================
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 2.58, 0.1);

    // Round, fluffy kitten head with wide cheeks
    const headGeo = new THREE.SphereGeometry(1.18, 32, 24);
    headGeo.scale(1.24, 1.08, 1.04);
    const headMesh = new THREE.Mesh(headGeo, silverFurMat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headMesh.userData = { part: "head" };
    this.headGroup.add(headMesh);

    // Puffy White Cheeks
    const cheekGeo = new THREE.SphereGeometry(0.62, 20, 16);
    cheekGeo.scale(1.12, 0.88, 0.75);

    const leftCheek = new THREE.Mesh(cheekGeo, whiteFurMat);
    leftCheek.position.set(-0.64, -0.22, 0.52);
    this.headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, whiteFurMat);
    rightCheek.position.set(0.64, -0.22, 0.52);
    this.headGroup.add(rightCheek);

    // Rosy Pink Blush on Cheeks
    const blushGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.04, 20);
    blushGeo.rotateX(Math.PI / 2);

    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.72, -0.16, 0.94);
    leftBlush.rotation.y = -0.22;
    this.headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.72, -0.16, 0.94);
    rightBlush.rotation.y = 0.22;
    this.headGroup.add(rightBlush);

    // Forehead Tabby Stripe Trio (Classic kitten "M" mark!)
    const stripeGeoM = new THREE.CylinderGeometry(0.025, 0.035, 0.42, 8);
    const centerStripe = new THREE.Mesh(stripeGeoM, stripeMat);
    centerStripe.position.set(0, 0.72, 0.95);
    centerStripe.rotation.x = -0.25;
    this.headGroup.add(centerStripe);

    const leftStripe = new THREE.Mesh(stripeGeoM, stripeMat);
    leftStripe.position.set(-0.24, 0.68, 0.92);
    leftStripe.rotation.x = -0.25;
    leftStripe.rotation.z = -0.2;
    this.headGroup.add(leftStripe);

    const rightStripe = new THREE.Mesh(stripeGeoM, stripeMat);
    rightStripe.position.set(0.24, 0.68, 0.92);
    rightStripe.rotation.x = -0.25;
    rightStripe.rotation.z = 0.2;
    this.headGroup.add(rightStripe);

    // ==========================================
    // 4. Pointed Feline Ears with Pink Fluff
    // ==========================================
    const earGeo = new THREE.ConeGeometry(0.55, 1.05, 18);
    earGeo.scale(1.15, 1.0, 0.45);

    // Left Ear
    this.leftEarGroup = new THREE.Group();
    this.leftEarGroup.position.set(-0.82, 1.05, 0.05);
    this.leftEarGroup.rotation.z = 0.32;
    this.leftEarGroup.rotation.y = 0.15;
    this.leftEarGroup.rotation.x = -0.12;

    const leftEarMesh = new THREE.Mesh(earGeo, silverFurMat);
    leftEarMesh.castShadow = true;
    this.leftEarGroup.add(leftEarMesh);

    // Soft Pink Inner Ear
    const innerEarGeo = new THREE.ConeGeometry(0.42, 0.88, 16);
    innerEarGeo.scale(1.05, 1.0, 0.32);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, pinkInnerEarMat);
    leftInnerEar.position.set(0, -0.04, 0.1);
    this.leftEarGroup.add(leftInnerEar);
    this.headGroup.add(this.leftEarGroup);

    // Right Ear
    this.rightEarGroup = new THREE.Group();
    this.rightEarGroup.position.set(0.82, 1.05, 0.05);
    this.rightEarGroup.rotation.z = -0.32;
    this.rightEarGroup.rotation.y = -0.15;
    this.rightEarGroup.rotation.x = -0.12;

    const rightEarMesh = new THREE.Mesh(earGeo, silverFurMat);
    rightEarMesh.castShadow = true;
    this.rightEarGroup.add(rightEarMesh);

    const rightInnerEar = new THREE.Mesh(innerEarGeo, pinkInnerEarMat);
    rightInnerEar.position.set(0, -0.04, 0.1);
    this.rightEarGroup.add(rightInnerEar);
    this.headGroup.add(this.rightEarGroup);

    // ==========================================
    // 5. Cute Pink Ribbon Bow with White Hearts (Reference Image Hero Element!)
    // ==========================================
    this.pinkBowGroup = new THREE.Group();
    // Positioned delicately right at the base of the left ear
    this.pinkBowGroup.position.set(-0.76, 0.98, 0.35);
    this.pinkBowGroup.rotation.z = -0.35;
    this.pinkBowGroup.rotation.y = 0.25;
    this.pinkBowGroup.rotation.x = 0.15;

    // Bow Center Knot
    const knotGeo = new THREE.SphereGeometry(0.18, 16, 14);
    knotGeo.scale(1.0, 0.85, 0.7);
    const knotMesh = new THREE.Mesh(knotGeo, bowCenterMat);
    this.pinkBowGroup.add(knotMesh);

    // Left Loop of Ribbon Bow
    const loopGeo = new THREE.TorusGeometry(0.38, 0.14, 12, 24);
    loopGeo.scale(1.3, 0.8, 0.4);
    const leftLoop = new THREE.Mesh(loopGeo, bowPinkMat);
    leftLoop.position.set(-0.38, 0.06, 0);
    leftLoop.rotation.z = 0.2;
    this.pinkBowGroup.add(leftLoop);

    // Right Loop of Ribbon Bow
    const rightLoop = new THREE.Mesh(loopGeo, bowPinkMat);
    rightLoop.position.set(0.38, 0.06, 0);
    rightLoop.rotation.z = -0.2;
    this.pinkBowGroup.add(rightLoop);

    // Ribbon Tails hanging down
    const ribbonTailGeo = new THREE.BoxGeometry(0.18, 0.45, 0.05);
    const leftTail = new THREE.Mesh(ribbonTailGeo, bowPinkMat);
    leftTail.position.set(-0.16, -0.32, 0.02);
    leftTail.rotation.z = 0.4;
    this.pinkBowGroup.add(leftTail);

    const rightTail = new THREE.Mesh(ribbonTailGeo, bowPinkMat);
    rightTail.position.set(0.16, -0.32, 0.02);
    rightTail.rotation.z = -0.4;
    this.pinkBowGroup.add(rightTail);

    // Tiny White Heart Accents on Bow Loops
    const heartGeo = new THREE.SphereGeometry(0.06, 8, 8);
    [-0.32, -0.48, 0.32, 0.48].forEach((xVal) => {
      const heartDot = new THREE.Mesh(heartGeo, whiteDecalMat);
      heartDot.position.set(xVal, 0.08, 0.09);
      this.pinkBowGroup.add(heartDot);
    });

    this.headGroup.add(this.pinkBowGroup);

    // ==========================================
    // 6. Cute Kitten Muzzle, Nose, Mouth & Whiskers (:3 cat face)
    // ==========================================
    this.muzzleGroup = new THREE.Group();
    this.muzzleGroup.position.set(0, -0.22, 0.95);

    // Whisker Pads (Two white puffy rounded pillows forming the classic ":3" cat mouth)
    const padGeo = new THREE.SphereGeometry(0.28, 18, 14);
    padGeo.scale(1.15, 0.9, 0.65);

    const leftPad = new THREE.Mesh(padGeo, whiteFurMat);
    leftPad.position.set(-0.2, 0.04, 0.12);
    this.muzzleGroup.add(leftPad);

    const rightPad = new THREE.Mesh(padGeo, whiteFurMat);
    rightPad.position.set(0.2, 0.04, 0.12);
    this.muzzleGroup.add(rightPad);

    // Small Triangular Baby Pink Kitten Button Nose
    const noseGeo = new THREE.ConeGeometry(0.11, 0.14, 3);
    noseGeo.rotateX(Math.PI);
    noseGeo.scale(1.25, 0.9, 0.5);
    const noseMesh = new THREE.Mesh(noseGeo, pinkNoseMat);
    noseMesh.position.set(0, 0.16, 0.28);
    this.muzzleGroup.add(noseMesh);

    // Smiling Lower Jaw / Mouth with pink kitten tongue
    const jawGeo = new THREE.CylinderGeometry(0.18, 0.12, 0.12, 16);
    jawGeo.rotateX(Math.PI / 2);
    this.jawMesh = new THREE.Mesh(jawGeo, mouthMat);
    this.jawMesh.position.set(0, -0.12, 0.18);
    this.muzzleGroup.add(this.jawMesh);

    // Fine Delicate Kitten Whiskers (3 on Left, 3 on Right)
    this.leftWhiskers = new THREE.Group();
    this.leftWhiskers.position.set(-0.28, 0.04, 0.2);

    [-0.15, 0.0, 0.15].forEach((angle, idx) => {
      const whiskerGeo = new THREE.CylinderGeometry(0.008, 0.005, 0.75, 6);
      whiskerGeo.rotateZ(Math.PI / 2 + angle);
      const whisker = new THREE.Mesh(whiskerGeo, whiskerMat);
      whisker.position.set(-0.35, angle * 0.4, idx * 0.02);
      this.leftWhiskers.add(whisker);
    });
    this.muzzleGroup.add(this.leftWhiskers);

    this.rightWhiskers = new THREE.Group();
    this.rightWhiskers.position.set(0.28, 0.04, 0.2);

    [-0.15, 0.0, 0.15].forEach((angle, idx) => {
      const whiskerGeo = new THREE.CylinderGeometry(0.008, 0.005, 0.75, 6);
      whiskerGeo.rotateZ(-Math.PI / 2 - angle);
      const whisker = new THREE.Mesh(whiskerGeo, whiskerMat);
      whisker.position.set(0.35, angle * 0.4, idx * 0.02);
      this.rightWhiskers.add(whisker);
    });
    this.muzzleGroup.add(this.rightWhiskers);

    this.headGroup.add(this.muzzleGroup);

    // ==========================================
    // 7. Giant Glistening Hazel-Amber Anime Kitten Eyes (With Eyelashes & Highlights!)
    // ==========================================
    const eyeBaseGeo = new THREE.SphereGeometry(0.28, 24, 20);
    eyeBaseGeo.scale(0.98, 1.15, 0.55);

    // Left Eye
    this.leftEyeGroup = new THREE.Group();
    this.leftEyeGroup.position.set(-0.46, 0.16, 0.98);
    this.leftEyeGroup.rotation.y = -0.16;
    this.leftEyeGroup.rotation.z = 0.04;

    const leftIris = new THREE.Mesh(eyeBaseGeo, amberIrisMat);
    this.leftEyeGroup.add(leftIris);

    // Deep Dark Pupil
    const pupilGeo = new THREE.SphereGeometry(0.18, 18, 16);
    pupilGeo.scale(0.85, 1.15, 0.3);
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(0, 0, 0.14);
    this.leftEyeGroup.add(leftPupil);

    // Specular Highlight Sparkle 1 (Large Top Sparkle)
    const hlBigGeo = new THREE.SphereGeometry(0.08, 12, 10);
    const leftHl1 = new THREE.Mesh(hlBigGeo, highlightMat);
    leftHl1.position.set(-0.06, 0.09, 0.22);
    this.leftEyeGroup.add(leftHl1);

    // Specular Highlight Sparkle 2 (Mini Bottom-Right Sparkle)
    const hlSmallGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const leftHl2 = new THREE.Mesh(hlSmallGeo, highlightMat);
    leftHl2.position.set(0.08, -0.08, 0.22);
    this.leftEyeGroup.add(leftHl2);

    // Cute Curved Feline Eyelashes on Upper Rim (Matching reference image!)
    const lashGeo = new THREE.TorusGeometry(0.29, 0.022, 8, 16, Math.PI * 0.65);
    const leftLash = new THREE.Mesh(lashGeo, eyelashMat);
    leftLash.position.set(-0.02, 0.08, 0.16);
    leftLash.rotation.z = Math.PI * 0.2;
    this.leftEyeGroup.add(leftLash);

    // Animated Eyelid for Blinking
    const eyelidGeo = new THREE.SphereGeometry(0.31, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2);
    this.leftEyelid = new THREE.Mesh(eyelidGeo, silverFurMat);
    this.leftEyelid.position.set(0, 0, 0.02);
    this.leftEyelid.rotation.x = -Math.PI / 2;
    this.leftEyelid.visible = false;
    this.leftEyeGroup.add(this.leftEyelid);

    this.headGroup.add(this.leftEyeGroup);

    // Right Eye
    this.rightEyeGroup = new THREE.Group();
    this.rightEyeGroup.position.set(0.46, 0.16, 0.98);
    this.rightEyeGroup.rotation.y = 0.16;
    this.rightEyeGroup.rotation.z = -0.04;

    const rightIris = new THREE.Mesh(eyeBaseGeo, amberIrisMat);
    this.rightEyeGroup.add(rightIris);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0, 0, 0.14);
    this.rightEyeGroup.add(rightPupil);

    const rightHl1 = new THREE.Mesh(hlBigGeo, highlightMat);
    rightHl1.position.set(-0.06, 0.09, 0.22);
    this.rightEyeGroup.add(rightHl1);

    const rightHl2 = new THREE.Mesh(hlSmallGeo, highlightMat);
    rightHl2.position.set(0.08, -0.08, 0.22);
    this.rightEyeGroup.add(rightHl2);

    const rightLash = new THREE.Mesh(lashGeo, eyelashMat);
    rightLash.position.set(0.02, 0.08, 0.16);
    rightLash.rotation.z = Math.PI * 0.15;
    this.rightEyeGroup.add(rightLash);

    this.rightEyelid = new THREE.Mesh(eyelidGeo, silverFurMat);
    this.rightEyelid.position.set(0, 0, 0.02);
    this.rightEyelid.rotation.x = -Math.PI / 2;
    this.rightEyelid.visible = false;
    this.rightEyeGroup.add(this.rightEyelid);

    this.headGroup.add(this.rightEyeGroup);
    this.group.add(this.headGroup);

    // ==========================================
    // 8. Chubby Kitten Paws with Pink Toe Beans
    // ==========================================
    // Paw geometry with toe grooves
    const pawGeo = new THREE.SphereGeometry(0.35, 18, 14);
    pawGeo.scale(1.05, 0.75, 1.25);

    // Front Left Arm & Paw
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.62, 1.35, 0.2);

    const armGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.85, 16);
    const leftArmMesh = new THREE.Mesh(armGeo, silverFurMat);
    leftArmMesh.position.y = -0.42;
    this.leftArmGroup.add(leftArmMesh);

    // White Mittens / Paws
    const leftPawMesh = new THREE.Mesh(pawGeo, whiteFurMat);
    leftPawMesh.position.set(0, -0.85, 0.18);
    leftPawMesh.castShadow = true;
    this.leftArmGroup.add(leftPawMesh);

    // Pink Toe Beans Under Paw
    const beanCenterGeo = new THREE.SphereGeometry(0.1, 10, 8);
    beanCenterGeo.scale(1.2, 0.4, 1.0);
    const leftCenterBean = new THREE.Mesh(beanCenterGeo, pinkInnerEarMat);
    leftCenterBean.position.set(0, -0.92, 0.16);
    this.leftArmGroup.add(leftCenterBean);

    this.group.add(this.leftArmGroup);

    // Front Right Arm & Paw
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.62, 1.35, 0.2);

    const rightArmMesh = new THREE.Mesh(armGeo, silverFurMat);
    rightArmMesh.position.y = -0.42;
    this.rightArmGroup.add(rightArmMesh);

    const rightPawMesh = new THREE.Mesh(pawGeo, whiteFurMat);
    rightPawMesh.position.set(0, -0.85, 0.18);
    rightPawMesh.castShadow = true;
    this.rightArmGroup.add(rightPawMesh);

    const rightCenterBean = new THREE.Mesh(beanCenterGeo, pinkInnerEarMat);
    rightCenterBean.position.set(0, -0.92, 0.16);
    this.rightArmGroup.add(rightCenterBean);

    this.group.add(this.rightArmGroup);

    // Hind Sitting Legs & Paws
    const hindLegGeo = new THREE.SphereGeometry(0.48, 16, 14);
    hindLegGeo.scale(0.85, 1.1, 1.0);

    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.68, 0.45, 0.0);
    const leftHindThigh = new THREE.Mesh(hindLegGeo, silverFurMat);
    this.leftLegGroup.add(leftHindThigh);

    const leftHindPaw = new THREE.Mesh(pawGeo, whiteFurMat);
    leftHindPaw.position.set(0.05, -0.32, 0.38);
    this.leftLegGroup.add(leftHindPaw);
    this.group.add(this.leftLegGroup);

    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.68, 0.45, 0.0);
    const rightHindThigh = new THREE.Mesh(hindLegGeo, silverFurMat);
    this.rightLegGroup.add(rightHindThigh);

    const rightHindPaw = new THREE.Mesh(pawGeo, whiteFurMat);
    rightHindPaw.position.set(-0.05, -0.32, 0.38);
    this.rightLegGroup.add(rightHindPaw);
    this.group.add(this.rightLegGroup);

    // ==========================================
    // 9. Fluffy Curved Kitten Tail with White Tip!
    // ==========================================
    this.tailGroup = new THREE.Group();
    this.tailGroup.position.set(0, 0.55, -0.85);

    // Curved S-shape tail built from tapering segments
    const tailSegCount = 7;
    let prevSeg = this.tailGroup;

    for (let i = 0; i < tailSegCount; i++) {
      const radius = THREE.MathUtils.lerp(0.18, 0.11, i / tailSegCount);
      const length = 0.28;
      const segGeo = new THREE.CylinderGeometry(radius * 0.9, radius, length, 12);
      const isTip = i >= tailSegCount - 2;
      const mat = isTip ? whiteFurMat : silverFurMat;
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

    // Fluffy White Tail Tip Sphere
    const tipGeo = new THREE.SphereGeometry(0.16, 12, 10);
    this.tailTipMesh = new THREE.Mesh(tipGeo, whiteFurMat);
    this.tailTipMesh.position.y = 0.28;
    prevSeg.add(this.tailTipMesh);

    this.group.add(this.tailGroup);

    // ==========================================
    // 10. Optional Accessories (Glasses, Party Hat, Milk Saucer)
    // ==========================================
    // Cool Cat Sunglasses
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

    // Party Crown / Hat
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

    // Warm Milk Saucer
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

  // Look at 3D target coordinates (Smooth head & eye tracking!)
  public lookAtTarget(worldPoint: THREE.Vector3) {
    if (this.animState === "sleep") return;

    const localPoint = this.group.worldToLocal(worldPoint.clone());
    const targetRotY = Math.max(-0.6, Math.min(0.6, localPoint.x * 0.18));
    const targetRotX = Math.max(-0.4, Math.min(0.4, -localPoint.y * 0.12 + 0.1));

    this.headGroup.rotation.y = THREE.MathUtils.lerp(this.headGroup.rotation.y, targetRotY, 0.08);
    this.headGroup.rotation.x = THREE.MathUtils.lerp(this.headGroup.rotation.x, targetRotX, 0.08);

    // Eyes tracking
    const eyeOffsetX = targetRotY * 0.06;
    const eyeOffsetY = targetRotX * 0.06;
    this.leftEyeGroup.position.x = -0.46 + eyeOffsetX;
    this.leftEyeGroup.position.y = 0.16 + eyeOffsetY;
    this.rightEyeGroup.position.x = 0.46 + eyeOffsetX;
    this.rightEyeGroup.position.y = 0.16 + eyeOffsetY;
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
    const earTwitch = Math.sin(time * 3.5) * 0.06;
    this.leftEarGroup.rotation.z = 0.32 + earTwitch;
    this.rightEarGroup.rotation.z = -0.32 - earTwitch;

    const whiskerWiggle = Math.sin(time * 5.0) * 0.04;
    this.leftWhiskers.rotation.z = whiskerWiggle;
    this.rightWhiskers.rotation.z = -whiskerWiggle;

    // 3. Tail Swish (Gentle organic feline tail motion!)
    this.tailTime += delta * 2.8;
    this.tailGroup.rotation.y = Math.sin(this.tailTime) * 0.45;
    this.tailGroup.rotation.z = Math.cos(this.tailTime * 0.7) * 0.15;

    // 4. Talking & Meowing Mouth Animation
    if (this.isSpeaking) {
      this.talkTime += delta * 18;
      const mouthOpen = (Math.sin(this.talkTime) * 0.5 + 0.5) * 0.14;
      this.jawMesh.position.y = -0.12 - mouthOpen;
      this.headGroup.position.y = 2.58 + Math.sin(this.talkTime * 0.5) * 0.04;
    } else {
      this.jawMesh.position.y = -0.12;
    }

    // 5. State Machine Animations
    switch (this.animState) {
      case "idle": {
        this.milkSaucerGroup.visible = false;
        this.fishGroup.visible = false;

        // Breathing & gentle kitten bobbing
        const breathe = Math.sin(time * 2.2) * 0.025;
        this.bodyMesh.position.y = 1.28 + breathe;
        this.chestRuffMesh.position.y = 1.45 + breathe;
        this.bellyMesh.position.y = 1.05 + breathe;

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

        // Arm / Front Paw swing
        this.leftArmGroup.rotation.x = Math.sin(this.walkTime) * 0.55;
        this.rightArmGroup.rotation.x = -Math.sin(this.walkTime) * 0.55;

        // Hind Leg swing
        this.leftLegGroup.rotation.x = -Math.sin(this.walkTime) * 0.45;
        this.rightLegGroup.rotation.x = Math.sin(this.walkTime) * 0.45;

        // Fast playful tail wag
        this.tailGroup.rotation.y = Math.sin(this.walkTime * 1.8) * 0.7;
        break;
      }

      case "purr": {
        this.purrTime += delta * 24;
        // Contented kitten purr vibration & half-closed eyes
        const purrVibe = Math.sin(this.purrTime) * 0.015;
        this.group.position.x += purrVibe;
        this.bodyMesh.scale.set(1.02 + purrVibe * 2, 1.25, 0.98 + purrVibe * 2);

        this.headGroup.rotation.x = 0.12;
        this.leftEyelid.visible = true;
        this.rightEyelid.visible = true;
        break;
      }

      case "bump": {
        // Obstacle Bump Reaction!
        // Cat reels back with wide surprised eyes, ears flattened, paws flailing!
        this.bumpTime += delta * 15;
        this.headGroup.rotation.z = Math.sin(this.bumpTime) * 0.28;
        this.headGroup.rotation.x = -0.35 + Math.cos(this.bumpTime * 0.8) * 0.18;

        this.leftEarGroup.rotation.z = 0.55; // flattened ears
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
        // Cute cat loaf / seated pose
        this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, -0.38, 0.1);
        this.leftLegGroup.rotation.x = THREE.MathUtils.lerp(this.leftLegGroup.rotation.x, -1.2, 0.1);
        this.rightLegGroup.rotation.x = THREE.MathUtils.lerp(this.rightLegGroup.rotation.x, -1.2, 0.1);

        this.leftArmGroup.rotation.x = -0.9;
        this.rightArmGroup.rotation.x = -0.9;

        // Tail curled around paws
        this.tailGroup.rotation.y = THREE.MathUtils.lerp(this.tailGroup.rotation.y, 1.35, 0.1);
        this.tailGroup.rotation.z = 0.25;
        break;
      }

      case "sleep": {
        // Cozy kitten nap
        this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, -0.75, 0.1);
        this.bodyMesh.rotation.x = THREE.MathUtils.lerp(this.bodyMesh.rotation.x, 1.25, 0.1);
        this.headGroup.position.set(0, 1.25, 1.05);
        this.headGroup.rotation.x = 0.25;

        this.leftEyelid.visible = true;
        this.rightEyelid.visible = true;

        const napBreath = Math.sin(time * 1.5) * 0.04;
        this.bodyMesh.scale.set(1.02 + napBreath, 1.25 + napBreath, 0.98);
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
        this.tailGroup.rotation.y = Math.sin(t * 3) * 0.8; // irritated swish
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
