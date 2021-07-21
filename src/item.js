function Item(type, index, x, y, z, scene) {
    this.type = type;
    this.row = index;
    this.floor = z;
    this.scene = scene;
    this.choosed = false;

    let scaleX = 1;
    let scaleY = 1;

    this.sprite = newSprite("item"+type, x, y, 0.5, 0.5, scaleX, scaleY, z, this.scene.group, this.scene.game)
    
    return this;
}

Item.prototype.destroy = function() {
    this.sprite.destroy();
}

Item.prototype.getPosition = function() {
    return {row: this.row, floor: this.floor};
}

Item.prototype.updatePosition = function(row, floor) {
    this.row = row;
    this.floor = floor;
    this.sprite.z_order = floor;
}

Item.prototype.setPosition = function(x, y) {
    this.sprite.x = x;
    this.sprite.y = y;
}

Item.prototype.addAngle = function(angle) {
    this.sprite.angle += angle;
}

Item.prototype.onClick = function() {
    if (this.scene.chooseChecker(this)) {
        this.choose(true);
    }
}