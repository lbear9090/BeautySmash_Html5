
var GameOverScene = {
    game: controller.game,

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
        newSprite(`bg_gameover`, 0, 0, 0, 0, 1, 1, -1, this.group, this.game);
        newSprite(`logo`, 320, 390, 0.5, 0.5, 1, 1, 1, this.group, this.game);

        if (this.game.device.touch)
            this.game.input.mouse.stop();

        newLabel("Level  " + (g_level+1), 70, "Arial", "#FFF", CANVAS_WIDTH/2, 750, 0.5, 0.5, 1, 1, 2, this.group, this.game);
        newLabel(g_score, 100, "Arial", "#FFF", CANVAS_WIDTH/2, 900, 0.5, 0.5, 1, 1, 2, this.group, this.game);
        // sort

        newButton("btn_replay", 540 - 200, 1600, 0.5, 0.5, 1, 1, 3, this.onClickReplay, this, this.group, this.game);
        // newButton("btn_shop1", 540 + 200, 1600, 0.5, 0.5, 1, 1, 3, this.onClickShop, this, this.group, this.game);
        this.sort();
    },
    
    sort: function() {
        this.group.sort('z_order', Phaser.Group.SORT_ASCENDING);
    },

    onClickShop: function(){

    },

    onClickReplay: function() {
        controller.goToScene('GameScene');
    }
};
