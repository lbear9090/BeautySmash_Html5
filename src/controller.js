var controller = { game: {} };

controller.createGame = function() {
    this.game = new Phaser.Game(CANVAS_WIDTH, CANVAS_HEIGHT, Phaser.CANVAS, 'game');
    this.game.state.add('PreloadScene', PreloadScene);
    this.game.state.add('GameScene', GameScene);

    this.goToPreloadScene();
    sizeHandler();
};

controller.goToScene = function(sceneName) {
    this.game.state.start(sceneName);
};

controller.goToPreloadScene = function() { this.goToScene('PreloadScene'); };
controller.goToGameScene = function() { this.goToScene('GameScene'); };