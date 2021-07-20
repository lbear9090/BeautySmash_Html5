
var MainScene = {
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
        let bg = newSprite(`bg`, 0, 0, 0, 0, 1, 1, -1, this.group, this.game);
        
        if (this.game.device.touch)
            this.game.input.mouse.stop();

        // sort
        this.sort();
    },
    
    sort: function() {
        this.group.sort('z_order', Phaser.Group.SORT_ASCENDING);
    },

    onClickReplay: function() {
        window.location.reload();
    }
};
