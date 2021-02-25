import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
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
var shark;
var food;
var text;
var bgm;
var cursors;
var score = 0;
var next = Math.floor(Math.random() * 4) + 1;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('underwater', 'assets/underwater.png');
    this.load.image('sprite', 'assets/7.png'); //30, 12
    this.load.image('food', 'assets/2.png'); //16, 12
    this.load.image('shark', 'assets/6.png'); //54, 22
    this.load.image('dog', 'assets/dog.png');
    this.load.audio('monkeys', ['assets/monkeys.mp3', 'assets/monkeys.ogg']);
}

function create ()
{
    bgm = this.sound.add('monkeys');
    bgm.play();

    this.add.image(400, 350, 'underwater').setScale(1);

    player = this.physics.add.image(Math.floor(Math.random() * 800), Math.floor(Math.random() * 600), 'sprite').setScale(Math.floor(Math.random() * 3) + 1);
    player.setDamping(true);
    player.setDrag(.5);
    player.setMaxVelocity(100);

    shark = this.physics.add.image(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), 'shark').setScale(Math.floor(Math.random() * 4) + 2);

    food = this.physics.add.image(Math.floor(Math.random() * 750), Math.floor(Math.random() * 550), 'food').setScale(next);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    this.physics.add.overlap(player, food, collectFood, null, this);
    this.physics.add.overlap(shark, player, endGame, null, this);

}

function update ()
{
    if (cursors.up.isDown)
    {
        this.physics.velocityFromRotation(player.rotation, 200, player.body.acceleration);
    }
    else
    {
        player.setAcceleration(0);
    }

    if (cursors.left.isDown)
    {
        player.setAngularVelocity(-300);
    }
    else if (cursors.right.isDown)
    {
        player.setAngularVelocity(300);
    }
    else
    {
        player.setAngularVelocity(0);
    }


    shark.rotation = this.physics.accelerateToObject( shark, player, 100, 100, 100);


    text.setText('Score: ' + score);

    this.physics.world.wrap(player, 32);
}

function collectFood(player, food)
{
    food.x = Math.floor(Math.random() * 750);
    food.y = Math.floor(Math.random() * 550);
    food.setScale(next);
    score += next;
    next = Math.floor(Math.random() * 4) + 1
}

function endGame(shark, player)
{
    shark.disableBody(true, true);
    player.disableBody(true, true);
    this.add.text(150, 200, 'Your final score is ' + score, { font: '40px Courier', fill: '#00ff00' })
}

