R2 = 1.4142
R3 = 1.732
var GameScene = {
    game: controller.game,
    isGameStarted: false,
    isSwitchAble: true,
    level: 0,
    points: [],
    items: [],

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
        this.isGameStarted = true;
        this.group = this.game.add.group();

        // bg
        let bg = newSprite(`bg`, 0, 0, 0, 0, 1, 1, -1, this.group, this.game);
        
        if (this.game.device.touch)
            this.game.input.mouse.stop();

        this.createItems();
        // sort
        this.sort();
    },

    createItems: function() {
        this.objLayer = this.game.add.group();
        this.objLayer.position.x = CANVAS_WIDTH / 2;
        this.objLayer.position.y = 600;
        
        let pos = this.mainpos[0];
        
        for(i = 0; i < pos.length; i++){
            this.points[i] = newSprite('point', pos[i][0], pos[i][1], 0.5, 0.5, 1, 1, 1, this.objLayer, this.game);
            
            this.items[i] = newSprite('item1', this.points[i].world.x, this.points[i].world.y, 0.5, 0.5, 1, 1, 1, this.group, this.game);//new Item(1, i, this.points[i].world.x, this.points[i].world.y, 1, this.game);
        }
    },
    
    sort: function() {
        this.group.sort('z_order', Phaser.Group.SORT_ASCENDING);
    },

    gameEnd: function(type) {
        this.isGameStarted = false;
    },

    onClickReplay: function() {
        window.location.reload();
    },

    update: function() {
        
        this.objLayer.angle += 1;
        
        for(i = 0; i < this.points.length; i++){
            this.items[i].x = this.points[i].world.x
            this.items[i].y = this.points[i].world.y
        }
    }
};
