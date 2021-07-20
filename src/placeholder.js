function Placeholder(row, step, x, y, z, scene) {
    this.row = row;
    this.floor = z;
    this.scene = scene;
    this.step = step;

    let scaleX = CHECKER_WIDTH/CHECKER_ORG_WIDTH;
    let scaleY = CHECKER_HEIGHT/CHECKER_ORG_HEIGHT;

    this.sprite = newSprite("placeholder", x, y, 0.5, 0.5, scaleX, scaleY, z, this.scene.group, this.scene.game)
    this.sprite.alpha = 0.5;
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(this.onClick, this);

    return this;
}

Placeholder.prototype.destroy = function() {
    this.sprite.destroy();
    delete this;
}

Placeholder.prototype.onClick = function() {
    this.scene.choosePlaceholder(this);
}