var cnt_files = 0;
var cnt_loaded_files = 0;

var PreloadScene = {
    game: controller.game,
    lblProgress: {},

    init: function() {
        this.game.renderer.renderSession.roundPixels = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignVertically = true;
    },

    preload: function() {

    },
    
    create: function() {
        this.game.stage.backgroundColor = '#071e22';
        this.group = this.game.add.group();
        this.lblProgress = newLabel('', 20, 'digital', 'white', CANVAS_WIDTH/2, CANVAS_HEIGHT/2, 0.5, 0.5, 1, 1, 1, this.group, this.game);

        this.game.load.onLoadStart.add(this.loadStart, this);
        this.game.load.onFileComplete.add(this.fileComplete, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);

        this.start();
    },
    
    start: function() {
        cnt_files = 0;
        const IMG_PATH = "./resources/images";
        const SOUND_PATH = "./resources/sounds";

        this.loadImage("board",  	    `${IMG_PATH}/board.png`);
        this.loadImage("confirm",	    `${IMG_PATH}/confirm.png`);
        this.loadImage("replay",	    `${IMG_PATH}/replay.png`);
        this.loadImage("undo",	        `${IMG_PATH}/undo.png`);
        this.loadImage("switch",	        `${IMG_PATH}/switch.png`);
        this.loadImage("placeholder",   `${IMG_PATH}/placeholder.png`);
        this.loadImage("white",		    `${IMG_PATH}/white.png`, true, 108, 108, 4);
        this.loadImage("black",   	    `${IMG_PATH}/black.png`, true, 108, 108, 4);
        this.loadImage("dice_1",   	    `${IMG_PATH}/dice_1.png`, true, 116, 116, 2);
        this.loadImage("dice_2",   	    `${IMG_PATH}/dice_2.png`, true, 116, 116, 2);
        this.loadImage("dice_3",   	    `${IMG_PATH}/dice_3.png`, true, 116, 116, 2);
        this.loadImage("dice_4",   	    `${IMG_PATH}/dice_4.png`, true, 116, 116, 2);
        this.loadImage("dice_5",   	    `${IMG_PATH}/dice_5.png`, true, 116, 116, 2);
        this.loadImage("dice_6",   	    `${IMG_PATH}/dice_6.png`, true, 116, 116, 2);
        this.loadImage("dice_anim",   	`${IMG_PATH}/dice_anim.png`, true, 300, 300, 6);

        var aSoundsInfo = [];
        aSoundsInfo.push({filename: `${SOUND_PATH}/click`, loop: false, volume: 1, ingamename: "click"});
        cnt_files += aSoundsInfo.length;

        s_aSounds = [];
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = 
                new Howl({ 
                    src: [aSoundsInfo[i].filename+'.mp3', `${aSoundsInfo[i].path}${aSoundsInfo[i].filename}.ogg`],
                    autoplay: false,
                    preload: true,
                    loop: aSoundsInfo[i].loop, 
                    volume: aSoundsInfo[i].volume,
                    onload: this.fileComplete()
                });
        }

        cnt_loaded_files = 0;
        this.game.load.start();
    },

    loadSound: function(name, path) {
        cnt_files++;
        this.game.load.audio(name, [path]);
    },

    loadImage: function(name, path, spritesheet, width, height, cnt) {
        if (!spritesheet) spritesheet = false;
        if (!width) width = -1;
        if (!height) height = -1;
        if (!cnt) cnt = -1;

        cnt_files++;
        if (!spritesheet) {
            this.game.load.image(name, path);
        } else {
            this.game.load.spritesheet(name, path, width, height, cnt);
        }
    },

    loadStart: function() {
        this.lblProgress.text = 'Loading: 0%';
    },

    fileComplete: function(e) {
        cnt_loaded_files++;
        this.lblProgress.text = 'Loading: ' + Math.floor(cnt_loaded_files/cnt_files * 100) + '%';
    },
    
    loadComplete: function() {
        controller.goToScene('GameScene');
    }
};
