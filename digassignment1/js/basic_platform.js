import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var cherries;
var platforms;
var cursors;
var movingPlatform;
//var movingPlatform2;
var bgm;
var counter = 0;
var floatingCounter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    //this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('dude', 'assets/dude.png');
    this.load.image('cherry', 'assets/cherry.png');
    this.load.audio('weasel', ['assets/weasel.mp3', 'assets/weasel.ogg']);
}

function create ()
{
    bgm = this.sound.add('weasel');
    bgm.play();

    this.add.image(400, 300, 'sky').setScale(1.5);

    platforms = this.physics.add.staticGroup();

    platforms.create(390, 675, 'ground').setScale(4).refreshBody();

    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    movingPlatform = this.physics.add.image(500, 400, 'ground');

   // movingPlatform2 = this.physics.add.image(250, 250, 'ground');

    movingPlatform.setImmovable(true);
    movingPlatform.body.allowGravity = false;
    movingPlatform.setVelocityX(50);

   //movingPlatform2.setImmovable(true);
    //movingPlatform2.body.allowGravity = false;
   // movingPlatform2.setVelocityX(50);

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setScale(0.5, 0.5)

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    /*this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });*/

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 20, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setScale(0.5);
        if(Math.random() >= 0.65 && floatingCounter < 3){
            child.body.allowGravity = false;
            floatingCounter++;
        }

    });

    cherries = this.physics.add.group({
        key: 'cherry',
        repeat: 3,
        setXY: { x: 100, y: 200, stepX: 250 }
    });

    cherries.children.iterate(function (child){

        child.setScale(0.5);
        child.body.allowGravity = false;

    });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, movingPlatform);
    //this.physics.add.collider(player, movingPlatform2);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(stars, movingPlatform);

    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player, cherries, collectCherry, null, this);
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }

    if (movingPlatform.x >= 500)
    {
        movingPlatform.setVelocityX(-50);
    }
    else if (movingPlatform.x <= 250)
    {
        movingPlatform.setVelocityX(50);
    }

   /* if (movingPlatform2.x >= 500)
    {
        movingPlatform2.setVelocityX(-50);
    }
    else if (movingPlatform2.x <= 250)
    {
        movingPlatform2.setVelocityX(50);
    }*/
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    counter++;
    if(counter == 12){
        this.add.text(300, 200, 'You Win!', {fontSize: '32px', fill: '#000'})
        this.add.text(100, 400, 'All chemicals have been cleaned', {fontSize: '32px', fill: '#000'})
    }
}

function collectCherry(player, cherry)
{
    cherry.disableBody(true, true);
    player.setVelocityY(-400);
}