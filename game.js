let config = {
    type: Phaser.AUTO,
    score: 0,
    scale: {

        height: 600,
        width: 800,
    },
    backgroundColor: 0xff00cc,
    scene: {

        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000,

            },

        }


    }

};
let game = new Phaser.Game(config);


let player_config = {
    player_speed: 150,
    player_jumpspeed: -700,
}





function preload() {
    this.load.image("ground", "./public/topground.png");
    this.load.image("sky", "./public/background.png");
    this.load.image("apple", "./public/apple.png");
    this.load.spritesheet("dude", "./public/dude.png", {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.image("platform", "./public/grass.png");
    this.load.image("ray", "./public/ray.png");

}



function create() {
    W = game.config.width;
    H = game.config.height;
    let ground = this.add.tileSprite(0, H - 140, W, 128, 'ground');

    ground.setOrigin(0, 0);
    let background = this.add.sprite(0, 0, 'sky');

    background.setOrigin(0, 0);

    background.displayWidth = W;
    background.depth = -1;
    let rays = [];

    for (let i = -10; i <= 10; i++) {
        let ray = this.add.sprite(W / 2, H - 100, 'ray');
        ray.displayHeight = 1.2 * H;
        ray.setOrigin(0.5, 1);
        ray.alpha = 0.2;
        ray.angle = i * 20;
        ray.depth = -1;
        rays.push(ray);
    }
    console.log(rays);

    //tween
    this.tweens.add({
        targets: rays,
        props: {
            angle: {
                value: "+=20"
            },
        },
        duration: 8000,
        repeat: -1
    });
    this.score = 0;
    this.scoreText = null;
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    this.player = this.physics.add.sprite(100, 100, 'dude', 4);
    this.physics.add.existing(ground, true);
    this.player.setCollideWorldBounds(true);
    ground.body.allowGravity = false;
    ground.body.immovable = true;
    this.physics.add.collider(ground, this.player);
    let fruits = this.physics.add.group({
        key: "apple",
        repeat: 8,
        setScale: { x: 0.2, y: 0.2 },
        setXY: {
            x: 10,
            y: 0,

            stepX: 100
        },

    });
    fruits.children.iterate(function(f) {
        f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7));
    })
    this.physics.add.collider(ground, fruits);
    this.player.setBounce(0.8);

    let platforms = this.physics.add.staticGroup();
    platforms.create(500, 350, 'ground').setScale(2, 0.5).refreshBody();
    platforms.create(700, 200, 'ground').setScale(2, 0.5).refreshBody();
    platforms.create(100, 200, 'ground').setScale(2, 0.5).refreshBody();
    this.physics.add.collider(platforms, fruits);

    this.physics.add.collider(platforms, this.player);
    this.physics.add.overlap(fruits, this.player, eatFruit, null, this);
    this.cursors = this.input.keyboard.createCursorKeys();


    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'center',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 10,

    });
    this.cameras.main.setBounds(0, 0, W, H);
    this.physics.world.setBounds(0, 0, W, H);

    this.cameras.main.startFollow(this.player, true, true);
    this.cameras.main.setZoom(1.5);

}





function update() {

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play('right', true);
    } else {
        this.player.setVelocityX(0);

        this.player.anims.play('center', true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(player_config.player_jumpspeed);
    }

}

function eatFruit(player, fruit) {
    fruit.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
}