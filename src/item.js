function Item(type, index, x, y, z, scene) {
    this.type = type;
    this.row = index;
    this.floor = z;
    this.scene = scene;
    this.choosed = false;
    this.goneBag = false;

    let scaleX = 0.8;
    let scaleY = 0.8;

    this.sprite = newSprite("item"+type, x, y, 0.5, 0.5, scaleX, scaleY, z, this.scene.itemLayer, this.scene.game, 0);
    
    this.rotateTween = rotateAnimEase(this.scene.game, this.sprite, this.sprite.angle + (Math.random() * 100 > 50 ? 1 : -1) * (Math.random()*180 + 180), Math.random() * 1000 + 2000, () => {
        rotateAnimEase(this.scene.game, this.sprite, this.sprite.angle + (Math.random() * 100 > 50 ? 1 : -1) * (Math.random()*180 + 180), Math.random() * 1000 + 2000, () => {
            if (this.rotateTween)
                this.rotateTween.start();
        });
    });
    return this;
}

Item.prototype.destroy = function() {
    this.rotateTween.stop();
    this.rotateTween = null;
    this.sprite.destroy();
}

Item.prototype.setPosition = function(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
}

Item.prototype.gotoBag = function(pos) {
    opacityAnim(this.scene.game, this.sprite, 0, 500);
    scaleAnim(this.scene.game, this.sprite, 0.5, 0.5, 500);
    moveAnim(this.scene.game, this.sprite, pos.x, pos.y, 500, () => {
        this.goneBag = true;
        this.scene.checkClear();
    });
}

Item.prototype.addAngle = function(angle) {
    this.sprite.angle += angle;
}

Item.prototype.onClick = function() {
    if (this.scene.chooseChecker(this)) {
        this.choose(true);
    }
}