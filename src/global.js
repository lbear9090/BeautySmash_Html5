const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

var s_aSounds;
var s_bIsIphone = false;
var g_coin = 0;

var rotateAnimEase = function(game, sprite, value, duration, callback = undefined) {
    let tween = game.add.tween(sprite).to({angle: value}, duration, Phaser.Easing.Quadratic.InOut, true);
    if (callback) {
        tween.onComplete.add(callback);
    }
    return tween;
}

var rotateAnim = function(game, sprite, value, duration, callback = undefined) {
    let tween = game.add.tween(sprite).to({angle: value}, duration, Phaser.Easing.Linear.None, true);
    if (callback) {
        tween.onComplete.add(callback);
    }
    return tween;
}

var moveAnim = function(game, sprite, x, y, duration, callback = undefined) {
    let tween = game.add.tween(sprite).to({x, y}, duration, Phaser.Easing.Linear.None, true);
    if (callback) {
        tween.onComplete.add(callback);
    }
    return tween;
}

var scaleAnim = function(game, sprite, x, y, duration, callback = undefined) {
    let tween = game.add.tween(sprite.scale).to({x, y}, duration, Phaser.Easing.Linear.None, true);
    if (callback) {
        tween.onComplete.add(callback);
    }
    return tween;
}

var opacityAnim = function(game, sprite, value, duration, callback = undefined){
    let tween = game.add.tween(sprite).to({alpha: value}, duration, Phaser.Easing.Linear.None, true);
    if (callback) {
        tween.onComplete.add(callback);
    }
    return tween;
}

var convertToNodeSpace = function(pos_x, pos_y, parent) {
    // lc = left_corner
    var pos_lc = {x: parent.worldPosition.x - parent.anchor.x * parent.width, y: parent.worldPosition.y - parent.anchor.y * parent.height};
    pos_x = pos_x - pos_lc.x;
    pos_y = pos_y - pos_lc.y;
    return {x: pos_x, y: pos_y};
};

var newButton = function(asset_name, pos_x, pos_y, anchor_x, anchor_y, scale_x, scale_y, z_order, callback, cb_owner, group, game, is_child, parent, over, out, down) {
    if (!is_child) is_child = false;
    if (!parent) parent = null;
    if (!over) over = 2;
    if (!out) out = 0;
    if (!down) down = 1;

    var button;
    if (is_child) {
        var anchor = parent.anchor;
        button = game.make.button(pos_x - parent.width*anchor.x, pos_y - parent.height*anchor.y, asset_name, callback, cb_owner, over, out, down);
        parent.addChild(button);
    } else {
        button = game.add.button(pos_x, pos_y, asset_name, callback, cb_owner, over, out, down);
        button.z_order = z_order;
        group.add(button);
    }

    button.onInputUp.add(
        function() {
            button.alpha = 1;
        },
        cb_owner
    );

    button.onInputDown.add(
        function() {
            button.alpha = 0.5;
        },
        cb_owner
    );

    button.anchor.x = anchor_x;
    button.anchor.y = anchor_y;
    button.scale.x = scale_x;
    button.scale.y = scale_y;

    return button;
};

var newLabelButton = function(caption, font_size, bgColor, capColor, asset_name, pos_x, pos_y, anchor_x, anchor_y, scale_x, scale_y, z_order, callback, cb_owner, group, game, is_child, parent, offset = 0) {
    const button = newButton(asset_name, pos_x, pos_y, anchor_x, anchor_y, scale_x, scale_y, z_order, callback, cb_owner, group, game, is_child, parent);
    newLabel(caption, font_size, 'Arial', capColor, button.width/2, button.height/2+offset, 0.5, 0.5, 1/scale_x, 1/scale_y, 1, group, game, false, true, button);
    if (bgColor !== null) button.tint = bgColor;

    return button;
};

var newSpriteButton = function(sprName, bgColor, pos_x, pos_y, anchor_x, anchor_y, scale_x, scale_y, z_order, callback, cb_owner, group, game, is_child, parent) {
    const button = newButton("white",  pos_x, pos_y, anchor_x, anchor_y, scale_x, scale_y, 1, callback, cb_owner, group, game, is_child, parent);
    newSprite(sprName, scale_x, scale_y, 0.5, 0.5, 1/scale_x, 1/scale_y, 1, group, game, true, button);
    button.tint = bgColor;

    return button;
};
var newSprite = function(asset_name, pos_x, pos_y, anchor_x, anchor_y, scale_x, scale_y, z_order, group, game, is_child, parent) {
    if (!is_child) is_child = false;
    if (!parent) parent = null;

    var sprite;
    // if child sprite
    if (is_child) {
        var anchor = parent.anchor;
        sprite = game.make.sprite((pos_x - parent.width*anchor.x)/parent.scale.x, (pos_y - parent.height*anchor.y)/parent.scale.y, asset_name);
        parent.addChild(sprite);
    } else {
        sprite = game.add.sprite(pos_x, pos_y, asset_name);
        sprite.z_order = z_order;
        if (group !== null) group.add(sprite);
    }    
    // Set anchor point
    sprite.anchor.x = anchor_x;
    sprite.anchor.y = anchor_y;
    sprite.scale.x = scale_x;
    sprite.scale.y = scale_y;
    
    return sprite;
};

var newLabel = function(text, font_size, font_name, color, pos_x, pos_y, anchor_x, anchor_y, scale_x, scale_y, z_order, group, game, shadow, is_child, parent, shadow_color, shadow_x, shadow_y, shadow_size) {
    if (!shadow) shadow = false;
    if (!is_child) is_child = false;
    if (!parent) parent = null;
    if (!shadow_color) shadow_color = 'rgba(0, 0, 0, 0.5';
    if (!shadow_x) shadow_x = 5;
    if (!shadow_y) shadow_y = 5;
    if (!shadow_size) shadow_size = 5;

    var label;
    var style = {
        font: 'bold ' + font_size + 'px ' + font_name,
        fill: color,
        align: "center"
    };

    // if child sprite
    if (is_child) {
        var anchor = parent.anchor;
        label = game.make.text((pos_x - parent.width*anchor.x)/parent.scale.x, (pos_y - parent.height*anchor.y)/parent.scale.y, text, style);
        parent.addChild(label);
    } else {
        label = game.add.text(pos_x, pos_y, text, style);
        label.z_order = z_order;
        group.add(label);
    }    
    
    // Set anchor point
    label.anchor.x = anchor_x;
    label.anchor.y = anchor_y;
    label.scale.x = scale_x;
    label.scale.y = scale_y;

    // Shadow
    if (shadow)
        label.setShadow(shadow_x, shadow_y, shadow_color, shadow_size);

    return label;
};

var convertSecondToMinute = function(second) {
    var mm = Math.floor(second / 60);
    var ss = second % 60;
    return (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
};

var readGameData = function(key, default_value) {
    if (localStorage[key]) {
        return localStorage[key];
    } else {
        saveGameData(key, default_value);
        return default_value;
    }
};

var saveGameData = function(key, value) {
    localStorage.setItem(key, value);
};

var playSound = function(szSound,iVolume,bLoop){
    s_aSounds[szSound].play();
    s_aSounds[szSound].volume(iVolume);

    s_aSounds[szSound].loop(bLoop);

    return s_aSounds[szSound];
};

function isIOS() {
    var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod' 
    ]; 
 
    if (navigator.userAgent.toLowerCase().indexOf("iphone") !== -1){
        s_bIsIphone = true;
    }
            
    while (iDevices.length) {
        if (navigator.platform === iDevices.pop()){
            return true; 
        } 
    } 
    s_bIsIphone = false;
 
    return false; 
 }

function sizeHandler(){
    window.scrollTo(0, 1);
}

function calculateLandscapeSize(width, height) {
    var o_ratio = CANVAS_HEIGHT / CANVAS_WIDTH;
    var n_ratio = height / width;
    return o_ratio < n_ratio;
}

$(window).resize(function() {
    sizeHandler();
});

function getTimeStamp() {
    var d = new Date();

    var s =
        leadingZeros(d.getFullYear(), 4) + '-' +
        leadingZeros(d.getMonth() + 1, 2) + '-' +
        leadingZeros(d.getDate(), 2) + ' ' +

        leadingZeros(d.getHours(), 2) + ':' +
        leadingZeros(d.getMinutes(), 2) + ':' +
        leadingZeros(d.getSeconds(), 2);

    return s;
}

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
}