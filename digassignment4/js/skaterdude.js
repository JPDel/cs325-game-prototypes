import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
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
var cone1;
var coneVel = -150;
var platforms;
var fakeground;
var cursors;
var bgm;
var score = 0;
var falling = true;
var text;
var finalScore;
var end = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('cone', 'assets/cone.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('harold', 'assets/sickharold.png');
    this.load.image('cherry', 'assets/cherry.png');
    this.load.audio('weasel', ['assets/weasel.mp3', 'assets/weasel.ogg']);
}

function create ()
{
    bgm = this.sound.add('weasel');
    bgm.play();

    this.add.image(400, 300, 'sky').setScale(1.5);

    platforms = this.physics.add.staticGroup();

    platforms.create(390, 600, 'ground').setScale(4).refreshBody();

    fakeground = this.physics.add.staticGroup();

    fakeground.create(390, 650, 'ground').setScale(4).refreshBody();

    player = this.physics.add.sprite(100, 490, 'harold');
    player.setScale(0.1, 0.1)

    player.setBounce(0);
    player.setCollideWorldBounds(true);

    cone1 = this.physics.add.sprite(1100, 300, 'cone').setScale(0.3);
    cone1.setBounce(0);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#000000' });
    text.setText('Score: ' + score);

    this.physics.add.collider(player, fakeground);
    this.physics.add.collider(cone1, fakeground);

    this.physics.add.overlap(player, cone1, endGame, null, this);
}

function update ()
{
    player.setVelocityX(0);

    if (cursors.left.isDown)
    {
        player.setVelocityX(-320);

    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(320);
    }
    else
    {
        
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-800);
        falling = false;
    }

    if(!(cursors.up.isDown) && !(player.body.touching.down) && !falling)
    {
        player.setVelocityY(0);
        falling = true;
    }

    cone1.setVelocityX(coneVel);
    cone1.setVelocityY(1000);
    coneVel -= 0.5;

    if(cone1.x < -100){
        cone1.x = 1100;
        cone1.y = 300;
        cone1.setScale(Math.random() / 2)
    }

    if(!end)
    {
        score++;
        text.setText('Score: ' + score);
    }
}

function endGame(player, cone1)
{
    end = true;

    cone1.disableBody(true, true);
    finalScore = score;

    text.setText('Final score: ' + finalScore);

}