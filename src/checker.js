function Checker(type, index, x, y, z, scene) {
    this.type = type;
    this.row = index;
    this.floor = z;
    this.scene = scene;
    this.choosed = false;

    let scaleX = CHECKER_WIDTH/CHECKER_ORG_WIDTH;
    let scaleY = CHECKER_HEIGHT/CHECKER_ORG_HEIGHT;

    this.sprite = newSprite(type==BLACK_CHECKER?"black":"white", x, y, 0.5, 0.5, scaleX, scaleY, z, this.scene.group, this.scene.game)
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(this.onClick, this);
    this.sprite.animations.add('tobox');

    return this;
}

Checker.prototype.destroy = function() {
    this.sprite.destroy();
}

Checker.prototype.getPosition = function() {
    return {row: this.row, floor: this.floor};
}

Checker.prototype.updatePosition = function(row, floor) {
    this.row = row;
    this.floor = floor;
    this.sprite.z_order = floor;
}

Checker.prototype.setPosition = function(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
}

Checker.prototype.move = function(row, floor) {
    this.updatePosition(row, floor);
    if (row === ROW_BOX) {
        if (this.type === OTHER_TYPE)
            this.sprite.angle = 180;
        this.sprite.animations.play('tobox', 10)
    }
    let {x, y} = getLocation(this.type, row, floor);
    moveAnim(this.scene.game, this.sprite, x, y, 300);
}

Checker.prototype.choose = function(flag) {
    if (flag) {
        this.choosed = true;
        this.choosedTween1 = scaleAnim(this.scene.game, this.sprite, 0.55, 0.55, 500, () => {
            if (this.choosedTween1) {
                this.choosedTween2 = scaleAnim(this.scene.game, this.sprite, 0.45, 0.45, 500, () => {
                    if (this.choosedTween1)
                        this.choosedTween1.start();
                });
            }
        });
    }
    else {
        this.choosed = false;
        if (this.choosedTween1) {
            this.choosedTween1.stop();
            this.choosedTween1 = null;
        }
        if (this.choosedTween2) {
            this.choosedTween2.stop();
            this.choosedTween2 = null;
        }
        this.sprite.scale.setTo(0.5);
    }
}

Checker.prototype.showOrigin = function() {
    if (this.type === OTHER_TYPE)
        this.sprite.angle = -180;
    this.sprite.frame = 0;
}

Checker.prototype.addAngle = function(angle) {
    this.sprite.angle += angle;
}

Checker.prototype.onClick = function() {
    if (this.scene.chooseChecker(this)) {
        this.choose(true);
    }
}