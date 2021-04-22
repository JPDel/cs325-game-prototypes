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
var station;
var mineral;
var pirate;
var pirateVel;
var text;
var bgm;
var cursors;
var playerMinerals = 0;
var stationMinerals = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('space', 'assets/space.png');
    this.load.image('asteroid', 'assets/asteroid.png');
    this.load.image('sprite', 'assets/player.png'); //30, 12
    this.load.image('mineral', 'assets/mineral.png'); //16, 12
    this.load.image('pirate', 'assets/pirate.png'); //54, 22
    this.load.image('station', 'assets/station.png');
    this.load.image('dog', 'assets/dog.png');
    this.load.audio('moonlight', ['assets/moonlight.mp3', 'assets/moonlight.ogg']);
}

function create ()
{
    bgm = this.sound.add('moonlight');
    bgm.play();

    this.add.image(400, 350, 'space').setScale(1);
    this.add.image(100, 325, 'asteroid').setScale(0.8);

    player = this.physics.add.image(Math.floor(Math.random() * 800), Math.floor(Math.random() * 600), 'sprite').setScale(0.5);
    player.setDamping(true);
    player.setDrag(.5);
    player.setMaxVelocity(100);

    pirate = this.physics.add.image(Math.floor(Math.random() * 1000), Math.floor(Math.random() * 1000), 'pirate').setScale(0.5);
    station = this.physics.add.image(700, 350, 'station').setScale(0.25);
    mineral = this.physics.add.image(Math.floor(50 + (Math.random() * 300)), Math.floor(100 + (Math.random() * 600)), 'mineral').setScale(0.1);

    cursors = this.input.keyboard.createCursorKeys();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    pirateVel = 100;

    
    this.physics.add.overlap(player, mineral, collectMineral, null, this);
    this.physics.add.overlap(pirate, player, endGame, null, this);
    this.physics.add.overlap(player, station, depositMineral, null, this);
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


    pirate.rotation = this.physics.accelerateToObject( pirate, player, pirateVel, pirateVel, pirateVel);


    text.setText('Minerals Carried: ' + playerMinerals +'\n'+'Minerals at station: ' + stationMinerals);

    this.physics.world.wrap(player, 32);

    if(stationMinerals >= 20) {
        pirate.x = player.x;
        pirate.y = player.y;
    }
}

function collectMineral(player, mineral)
{
    mineral.x = Math.floor(100 + (Math.random() * 300));
    mineral.y = Math.floor(100 + (Math.random() * 600));
    playerMinerals += 1;
    pirateVel += 25;
}

function endGame(pirate, player)
{
    pirate.disableBody(true, true);
    player.disableBody(true, true);
    if(playerMinerals >= 20){
        this.add.text(150, 200, 'You win!', { font: '40px Courier', fill: '#00ff00' })
    }
    else {
        this.add.text(150, 200, 'You lose :(', { font: '40px Courier', fill: '#00ff00' })
    }
    
}

function depositMineral(player, station)
{   
    if(playerMinerals == 0) {
        return;
    }
    stationMinerals = playerMinerals;
    playerMinerals = 0;
    pirateVel = 100;
}
