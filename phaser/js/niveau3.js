export default class niveau3 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau3" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {}

  create() {
    this.add.image(400, 300, "img_ciel");
    this.groupe_plateformes = this.physics.add.staticGroup();
    this.groupe_plateformes.create(200, 584, "img_plateforme");
    this.groupe_plateformes.create(600, 584, "img_plateforme");
    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Vous êtes dans le niveau 3", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });

    this.porte_retour = this.physics.add.staticSprite(100, 550, "img_porte3");

    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes);

    // Ajout du groupe de balles
    this.groupeBullets = this.physics.add.group();
    // Ajout de la direction du joueur
    this.player.direction = 'right';
    // Bind du tir sur le clic gauche
    this.input.on('pointerdown', (pointer) => {
      if (pointer.leftButtonDown()) {
        this.tirer(this.player);
      }
    });
  }

  tirer(player) {
    // Détermine la direction
    let vx = 0, vy = 0, offsetX = 0, offsetY = 0;
    if (player.direction === 'left') {
      vx = -500; offsetX = -25;
    } else if (player.direction === 'right') {
      vx = 500; offsetX = 25;
    } else if (player.direction === 'up') {
      vy = -500; offsetY = -25;
    } else if (player.direction === 'down') {
      vy = 500; offsetY = 25;
    }
    let bullet = this.groupeBullets.create(player.x + offsetX, player.y + offsetY, 'bullet');
    bullet.setCollideWorldBounds(true);
    bullet.body.allowGravity = false;
    bullet.setVelocity(vx, vy);
    bullet.body.onWorldBounds = true;
  }

  update() {
    // Mise à jour de la direction du joueur
    if (this.clavier.left.isDown) {
      this.player.direction = 'left';
      this.player.setVelocityX(-90);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.direction = 'right';
      this.player.setVelocityX(90);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.clavier.up.isDown) {
      this.player.direction = 'up';
      this.player.setVelocityY(-90);
      this.player.anims.play("anim_face");
    } else if (this.clavier.down.isDown) {
      this.player.direction = 'down';
      this.player.setVelocityY(90);
      this.player.anims.play("anim_face");
    } else {
      this.player.setVelocityY(0);
      if (!this.clavier.left.isDown && !this.clavier.right.isDown) {
        this.player.anims.play("anim_face");
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("selection");
      }
    }
  }
}
