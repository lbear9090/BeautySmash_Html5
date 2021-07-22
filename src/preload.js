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
        this.game.stage.backgroundColor = '#000';
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

        this.loadImage("bg",			`${IMG_PATH}/bg.jpg`);
        this.loadImage("btn_play",		`${IMG_PATH}/btn_play.png`);
        this.loadImage("gamii_logo",	`${IMG_PATH}/gamii_logo.png`);
        this.loadImage("title",			`${IMG_PATH}/title.png`);
        this.loadImage("bg_missed",		`${IMG_PATH}/bg_missed.png`);
        this.loadImage("missed",		`${IMG_PATH}/missed.png`);
        this.loadImage("coin",			`${IMG_PATH}/coin.png`);
        this.loadImage("level_bg",		`${IMG_PATH}/level_bg.png`);
        
        this.loadImage("progress_bg",	`${IMG_PATH}/progress_bg.png`);
        this.loadImage("progress",		`${IMG_PATH}/progress.png`);

        this.loadImage("score_bg",		`${IMG_PATH}/score_bg.png`);
        this.loadImage("bg_gameover",	`${IMG_PATH}/bg_gameover.jpg`);

        this.loadImage("point",			`${IMG_PATH}/point.png`);
        this.loadImage("item1",			`${IMG_PATH}/items/item_1.png`);
        this.loadImage("item2",			`${IMG_PATH}/items/item_2.png`);
        this.loadImage("item3",			`${IMG_PATH}/items/item_3.png`);
        this.loadImage("item4",			`${IMG_PATH}/items/item_4.png`);
        this.loadImage("item5",			`${IMG_PATH}/items/item_5.png`);
        this.loadImage("item6",			`${IMG_PATH}/items/item_6.png`);
        this.loadImage("item7",			`${IMG_PATH}/items/item_7.png`);
        this.loadImage("item8",			`${IMG_PATH}/items/item_8.png`);
        this.loadImage("item9",			`${IMG_PATH}/items/item_9.png`);
        this.loadImage("item10",		`${IMG_PATH}/items/item_10.png`);
        this.loadImage("item11",		`${IMG_PATH}/items/item_11.png`);
        this.loadImage("item12",		`${IMG_PATH}/items/item_12.png`);
        this.loadImage("item13",		`${IMG_PATH}/items/item_13.png`);
        this.loadImage("item14",		`${IMG_PATH}/items/item_14.png`);
        this.loadImage("item15",		`${IMG_PATH}/items/item_15.png`);
        this.loadImage("throw1",		`${IMG_PATH}/throw/throw_1.png`);
        this.loadImage("throw2",		`${IMG_PATH}/throw/throw_2.png`);
        this.loadImage("throw3",		`${IMG_PATH}/throw/throw_3.png`);
        this.loadImage("throw4",		`${IMG_PATH}/throw/throw_4.png`);
        this.loadImage("throw5",		`${IMG_PATH}/throw/throw_5.png`);
        this.loadImage("throw6",		`${IMG_PATH}/throw/throw_6.png`);
        this.loadImage("throw7",		`${IMG_PATH}/throw/throw_7.png`);
        this.loadImage("throw8",		`${IMG_PATH}/throw/throw_8.png`);
        this.loadImage("throw9",		`${IMG_PATH}/throw/throw_9.png`);
        this.loadImage("bag",			`${IMG_PATH}/shopping_bag.png`);
        // this.loadImage("dice_anim",   	`${IMG_PATH}/dice_anim.png`, true, 300, 300, 6);

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
        controller.goToScene('MainScene');
    }
};
