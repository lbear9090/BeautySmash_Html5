
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
        newSprite(`bg`, 0, 0, 0, 0, 1, 1, -1, this.group, this.game);
        newSprite(`logo`, 320, 390, 0.5, 0.5, 1, 1, 1, this.group, this.game);
        newSprite(`title`, CANVAS_WIDTH / 2, 480, 0.5, 0, 1, 1, -1, this.group, this.game);
        newSprite(`gamii_logo`, CANVAS_WIDTH / 2, 1600, 0.5, 0, 1, 1, -1, this.group, this.game);
        this.btnPlay = newButton("btn_play", CANVAS_WIDTH / 2, 1200, 0.5, 0, 1, 1, 200, this.onClickPlay, this, this.group, this.game);

        this.waitTween = scaleAnim(this.game, this.btnPlay, 0.9, 0.9, 500, () => {
            scaleAnim(this.game, this.btnPlay, 1, 1, 500, () => {
                if (this.waitTween)
                    this.waitTween.start();
            });
        });

        if (this.game.device.touch)
            this.game.input.mouse.stop();

        // sort
        this.sort();
    },
    
    sort: function() {
        this.group.sort('z_order', Phaser.Group.SORT_ASCENDING);
    },

    onClickPlay: function() {
        controller.goToScene('GameScene');
    },

    onClickReplay: function() {
        window.location.reload();
    }
};
