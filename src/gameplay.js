R2 = 1.4142
R3 = 1.732
var GameScene = {
    game: controller.game,
    isThrown: false,
    bObjCreated: false,
    bGameOver: false,
    nLevel: 0,
    nSmallLevel: 0,
    points: [],
    items: [],
    levelInfo: [],
    nTotalItemCnt: 0,
    nCollectedCnt: 0,

    mainpos: [
        [[-250, -250], [0, -250], [250, -250], [-250, 0], [0, 0], [250, 0], [-250, 250], [0, 250], [250, 250]],
        [[-125, -250], [125, -250], [-125, 0], [125, 0], [-125, 250], [125, 250]],
        [[0, -150*2], [150*R3/2, -150/2], [-150*R3/2,-150/2], [-150*R3,150], [0, 150], [150*R3, 150]],
        [[0, -150*2], [-150*R3,150], [150*R3, 150], [0, 150 * 2], [-150*R3, -150], [150*R3, -150]],
        [[0, -300], [300, 0], [0, 300], [-300, 0], [-300/R2, -300/R2], [300/R2, -300/R2], [-300/R2, 300/R2], [300/R2, 300/R2]],
    ],
    init: function() {
        this.game.renderer.renderSession.roundPixels = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignVertically = true;
    },
    
    preload: function() {
        
    },

    create: function() {
        var me = this;
        this.isThrown = false;
        this.group = this.game.add.group();

        // bg
        newSprite(`bg`, 0, 0, 0, 0, 1, 1, -1, this.group, this.game);
        
        this.pointLayer = this.game.add.group();
        this.pointLayer.x = CANVAS_WIDTH / 2;
        this.pointLayer.y = 700;

        this.itemLayer = this.game.add.group();
        this.itemLayer.alpha = 0;

        this.uiLayer = this.game.add.group();

        if (this.game.device.touch)
            this.game.input.mouse.stop();

        this.bag = newSprite(`bag`, 200, 1700, 0.5, 0.5, 1, 1, 3, this.uiLayer, this.game);
        newSprite(`level_bg`, CANVAS_WIDTH/2, 80, 0.5, 0.5, 1, 1, 1, this.uiLayer, this.game);
        this.lblLabel = newLabel(`Level ` + (this.nLevel+1), 60, 'Arial', '#FFFFFF', CANVAS_WIDTH/2, 80, 0.5, 0.5, 1, 1, 3, this.uiLayer, this.game);

        newSprite(`progress_bg`, CANVAS_WIDTH / 2 - 368 / 2, 160, 0, 0.5, 1, 1, 3, this.uiLayer, this.game);
        this.sProgress = newSprite(`progress`, CANVAS_WIDTH / 2 - 368 / 2, 160, 0, 0.5, 0, 1, 4, this.uiLayer, this.game);

        this.bgMissed = newSprite(`bg_missed`, 0,0,0,0, 1,1,-1, this.uiLayer, this.game);
        this.sMissed = newSprite(`missed`, CANVAS_WIDTH/2 , 1600 ,0.5,0.5, 1,1,1, this.uiLayer, this.game);

        this.bgMissed.alpha = 0;
        this.sMissed.alpha = 0;

        this.createLevelInfo(this.nLevel);

        this.createItems();
        
        this.card = newSprite(`throw1`, CANVAS_WIDTH/2, 1600, 0.5, 0.5, 0.7, 0.7, 2, this.itemLayer, this.game);

        this.game.input.onUp.add( () => {
            this.throwCard();
        });
      
        // sort
        this.sort();
    },

    createLevelInfo: function(level){
        this.levelInfo = [];
        this.nSmallLevel = 0;
        this.nTotalItemCnt = 0;
        this.nCollectedCnt = 0;
        var lvCount = Math.floor(level/10) + 2;
        for(i = 0; i < lvCount; i++){
            this.levelInfo[i] = this.mainpos[Math.floor(Math.random()*5)];
            this.nTotalItemCnt += this.levelInfo[i].length;
        }
        
        this.setProgress();
    },

    setProgress: function(){
        this.sProgress.scale.x = this.nCollectedCnt / this.nTotalItemCnt;
    },

    createItems: function() {
        this.bObjCreated = false;

        if(this.points.length > 0){
            for(i = 0; i < this.items.length; i++){
                this.items[i].destroy();
                this.points[i].destroy();
            }
            this.items = [];
            this.points = [];
        }

        this.pointLayer.alpha = 0;
        this.pointLayer.scale.x = 0.1;
        this.pointLayer.scale.y = 0.1;
        this.pointLayer.angle = 180;

        let pos = this.levelInfo[this.nSmallLevel];
        
        for(i = 0; i < pos.length; i++){
            this.points[i] = newSprite('point', pos[i][0], pos[i][1], 0.5, 0.5, 1, 1, 1, this.pointLayer, this.game);
            
            this.items[i] = new Item(Math.ceil(Math.random() * 15), i, this.points[i].x + this.pointLayer.x, this.points[i].y + this.pointLayer.y, 1, this);
        }

        scaleAnim(this.game, this.pointLayer, 1, 1, 500);
        opacityAnim(this.game, this.pointLayer, 1, 500);
        rotateAnim(this.game, this.pointLayer, 0, 500, () => {
            opacityAnim(this.game, this.itemLayer, 1, 500);
            this.bObjCreated = true;
            this.startRotate();
        });

        this.sort();
    },
    
    startRotate: function() {
        var rotationTime = Math.max(5000 - this.nLevel * 50, 1000);
        console.log(rotationTime);
        if(this.nSmallLevel == 0){
            this.rotateTween = rotateAnim(this.game, this.pointLayer, ((Math.random() * 100 > 50) ? 1 : -1) * 360, rotationTime).loop(true);
        }else{
            this.rotateTween = rotateAnimEase(this.game, this.pointLayer, this.pointLayer.angle + ((Math.random() * 100 > 50) ? 1 : -1) * (Math.random()*360 + 180), rotationTime, () => {
                rotateAnimEase(this.game, this.pointLayer, this.pointLayer.angle + ((Math.random() * 100 > 50) ? 1 : -1) * (Math.random()*360 + 180), rotationTime, () => {
                    if (this.rotateTween)
                        this.rotateTween.start();
                });
            });
        }
    },

    sort: function() {
        this.group.sort('z_order', Phaser.Group.SORT_ASCENDING);
    },

    gameOver: function() {
        this.bGameOver = true;
        this.game.tweens.removeAll();
        this.bgMissed.alpha = 1;
        opacityAnim(this.game, this.sMissed, 1, 1000, () => {
            setTimeout(() => {
                
            }, 1000)
        });
    },

    throwCard: function(){
        if(this.bGameOver || this.isThrown || !this.bObjCreated || this.checkAllChoose()){
            return;
        }

        this.hasScore = false;
        this.isThrown = true;
        rotateAnimEase(this.game, this.card, 360, 300);
        moveAnim(this.game, this.card, CANVAS_WIDTH/2, -100, 300, () => {
            if(this.hasScore){
                this.card.y = 1600;
                this.isThrown = false;
            }else{
                this.gameOver();
            }
        });
    },

    checkClear: function(){
        var bCleared = true;
        for(i = 0; i < this.items.length; i++){
            if(!this.items[i].goneBag){
                bCleared = false;
            }
        }

        if(bCleared){
            this.bObjCreated = false;
            
            this.rotateTween.stop();
            this.rotateTween = null;
            this.game.tweens.removeAll();
            
            opacityAnim(this.game, this.itemLayer, 0, 500);

            scaleAnim(this.game, this.pointLayer, 0.1, 0.1, 500);
            opacityAnim(this.game, this.pointLayer, 0, 500);
            rotateAnim(this.game, this.pointLayer, this.pointLayer.angle + 180, 500, () => {
                this.nextLevel();
            });
        }
    },

    nextLevel: function(){
        if(this.nSmallLevel < this.levelInfo.length-1){
            this.nSmallLevel++;
        }else{
            this.nSmallLevel = 0;
            this.nLevel++;
            this.lblLabel.text = "Level " + (this.nLevel + 1);
            this.createLevelInfo(this.nLevel);
        }
        this.createItems();
    }, 

    checkAllChoose: function(){
        var bChoose = true;
        for(i = 0; i < this.items.length; i++){
            if(!this.items[i].choosed){
                bChoose = false;
            }
        }
        return bChoose;
    },

    onClickReplay: function() {
        window.location.reload();
    },

    update: function() {
        if(this.bObjCreated && !this.bGameOver){
            for(i = 0; i < this.points.length; i++){
                if(!this.items[i].choosed){
                    this.items[i].setPosition(this.points[i].world.x, this.points[i].world.y);
                    if(this.isThrown){
                        if(Phaser.Math.distance(this.items[i].sprite.x, this.items[i].sprite.y, this.card.position.x, this.card.position.y) < 150){
                            this.items[i].choosed = true;
                            this.items[i].gotoBag(this.bag.position);
                            this.hasScore = true;
                            this.nCollectedCnt++;
                            this.setProgress();
                        }
                    }
                }                
            }
        }
    }
};
