const STATE_DICE_APPEAR = 0;
const STATE_DICE_WAITING = 1;
const STATE_DICE_THROWING = 2;
const STATE_DICE_FINISHED = 3;

function Dice(isBlack, isLeft, scene) {
    this.isLeft = isLeft;
    this.scene = scene;
    this.diceIndex = Math.ceil(Math.random()*100) % 6 + 1;

    this.cx = (isBlack && MY_DICE_POS) ? 775 : 260;
    this.cy = 400;

    let scale = 1.5;
    let sign = this.isLeft ? -1 : 1;
    let x = this.cx + sign * (Math.random()*50+70);
    let y = this.cy + (0.5 - Math.random()) * 200;

    this.sprAnim = newSprite('dice_anim', x, y, 0.5, 0.5, scale, scale, 100, this.scene.group, this.scene.game);
    this.sprAnim.angle = Math.random()*360;
    this.sprAnim.animations.add('roll');

    this.sprAnim.inputEnabled = true;
    this.sprAnim.events.onInputDown.add(this.onClick, this);

    this.target = null;
    this.used = false;
    this.isWaiting = true;

    this.appear();

    return this;
}

Dice.prototype.appear = function() {
    this.state = STATE_DICE_APPEAR;
    let scale = 0.5;
    scaleAnim(this.scene.game, this.sprAnim, scale, scale, 200, () => this.wait());
}

Dice.prototype.wait = function() {   
    this.state = STATE_DICE_WAITING;
    let scale1 = 0.5;
    let scale2 = 0.65; 
    this.sprAnim.animations.play('roll', 8, true);

    this.waitTween = scaleAnim(this.scene.game, this.sprAnim, scale2, scale2, 500, () => {
        scaleAnim(this.scene.game, this.sprAnim, scale1, scale1, 500, () => {
            if (this.waitTween)
                this.waitTween.start();
        });
    });
}

Dice.prototype.onClick = function() {
    if (!GameScene.isGameStarted) return;
    if (this.state === STATE_DICE_APPEAR) return;
        GameScene.startThrow();
}

Dice.prototype.throw = function() {
    this.state = STATE_DICE_THROWING;
    
    // destroy wait tween
    this.waitTween.stop();
    this.waitTween = null;

    let scale = 0.3;
    let sign = this.isLeft ? -1 : 1;
    let x = this.cx + sign * (Math.random()*40+40);
    let y = this.cy + (0.5 - Math.random()) * 40;

    this.sprAnim.animations.play('roll', 20, true);
    moveAnim(this.scene.game, this.sprAnim, x, y, 400);
    scaleAnim(this.scene.game, this.sprAnim, scale, scale, 400, () => {
        // speed up rolling
        this.sprAnim.animations.stop(null, true);
        this.sprAnim.animations.play('roll', 20, true);
        // create target dice
        this.target = newSprite(`dice_${this.diceIndex}`, x, y, 0.5, 0.5, 0.5, 0.5, 100, this.scene.group, this.scene.game);
        this.target.angle = this.sprAnim.angle;
        this.sprAnim.destroy();
        this.sprAnim = null;
        this.scene.diceThrowEnded();
    });
}

Dice.prototype.updateUseState = function(isUsed) {
    this.used = isUsed;
}

Dice.prototype.destroy = function() {
    this.target.destroy();
    delete this;
}