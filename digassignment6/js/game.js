import "./phaser.js";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var fox;
var falcon;
var text;
var timedEvent;
var bgm;
var blip;
var gamestart = false;
var counter = 0;
var streak = 0;
var mouse;
var randX;
var randY;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('dream', 'assets/dream.png');
    this.load.audio('race', ['assets/race.mp3', 'assets/race.ogg']);
    this.load.audio('blip', ['assets/blip.mp3', 'assets/blip.ogg']);
    this.load.image('foxshine', 'assets/foxshine.png');
    this.load.image('falconshine', 'assets/falconshine.png');
}

function create ()
{

    this.input.mouse.disableContextMenu();
    mouse = this.input.activePointer;

    blip = this.sound.add('blip');

    bgm = this.sound.add('race');
    bgm.play();

    this.add.image(400, 350, 'dream').setScale(1.4);

    fox = this.add.sprite(1000, 1000, 'foxshine').setScale(0.1);
    fox.setInteractive();
    
    falcon = this.add.sprite(1000, 1000, 'falconshine').setScale(0.23);
    falcon.setInteractive();

    fox.on('pointerdown', function (score) {
        if(!mouse.rightButtonDown()){
            streak++;
            counter = counter + streak;
        }
        else {
            streak = 0;
        }
    });

    falcon.on('pointerdown', function (score) {
        if(mouse.rightButtonDown()){
            streak++;
            counter = counter + streak;
        }
        else {
            streak = 0;
        }
    });


    text = this.add.text(32, 32);
    text.setTint(0x000000);
    text.setFont('bold')
    text.setFont('32px bold')

    timedEvent = new Phaser.Time.TimerEvent({ delay: 20000 });

    this.input.on('pointerdown', () => {
        if(!gamestart){
            this.time.addEvent(timedEvent);
            if(Math.random() <= 0.5) {
                fox.x = Math.floor(Math.random() * 800);
                fox.y = Math.floor(Math.random() * 600);
            }
            else {
                falcon.x = Math.floor(Math.random() * 800);
                falcon.y = Math.floor(Math.random() * 600);
            }
            gamestart = true;
        }
    }, this);
}

function update ()
{
    var progress = 20 - (20 * timedEvent.getProgress());

    if(progress === 0)
    {
        fox.x = 1000;
        fox.y = 1000;
        falcon.x = 1000;
        falcon.y = 1000;
        text.setText([
            'Your final score: ' + counter.toString()
        ]);
    }
    else{
        fox.on('pointerdown', function (score) {
            blip.play();
            if(Math.random() <= 0.5) {
                fox.x = Math.floor(Math.random() * 800);
                fox.y = Math.floor(Math.random() * 600);
                falcon.x = 1000;
                falcon.y = 1000;
            }
            else {
                falcon.x = Math.floor(Math.random() * 800);
                falcon.y = Math.floor(Math.random() * 600);
                fox.x = 1000;
                fox.y = 1000;
            }
        });

        falcon.on('pointerdown', function (score) {
            blip.play();
            if(Math.random() <= 0.5) {
                fox.x = Math.floor(Math.random() * 800);
                fox.y = Math.floor(Math.random() * 600);
                falcon.x = 1000;
                falcon.y = 1000;
            }
            else {
                falcon.x = Math.floor(Math.random() * 800);
                falcon.y = Math.floor(Math.random() * 600);
                fox.x = 1000;
                fox.y = 1000;
            }
            
        });

        text.setText([
            'Event.progress: ' + progress.toString().substr(0, 4),
            'Score: ' + counter.toString(),
            'Streak: ' + streak.toString(),
        ]);

    }
}

