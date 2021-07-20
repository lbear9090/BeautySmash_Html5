const GAME_STATE_DICE_WAITING = 1;
const GAME_STATE_DICE_THROWING = 2;
const GAME_STATE_CHECKERS_MOVING = 3;

var GameScene = {
    game: controller.game,
    isGameStarted: false,
    isSwitchAble: true,

    placeholders: [],
    checkers: [],
    checkerBox: [],
    checkerTrash: [],

    dice1: null,
    dice2: null,
    turn: -1,
    btnConfirm: null,
    btnUndo: null,
    btnSwitchBoard: null,
    gameState: GAME_STATE_DICE_WAITING,
    diceCount: 0,
    diceIndices: [],
    chooseChecker: null,
    myCheckerType: BLACK_CHECKER,

    init: function() {
        this.game.renderer.renderSession.roundPixels = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignVertically = true;
    },
    
    preload: function() {
        
    },

    create: function() {
        var me = this;
        this.checkers = [];
        this.isGameStarted = true;
        this.group = this.game.add.group();
        this.checkerBox = [[], []];
        this.checkerTrash = [[], []];
        MY_TYPE = Math.ceil(Math.random()*100)%2;
        OTHER_TYPE = (MY_TYPE == BLACK_CHECKER) ? WHITE_CHECKER : BLACK_CHECKER;
        this.turn = MY_TYPE;

        // bg
        let bg = newSprite(`board`, 0, 0, 0, 0, 1, 1, -1, this.group, this.game);
        
        if (this.game.device.touch)
            this.game.input.mouse.stop();

        // buttons control buttons
        this.btnConfirm = newButton("confirm", 260, 400, 0.5, 0.5, 1, 1, 200, this.onClickConfirm, this, this.group, this.game);
        this.btnUndo = newButton("undo", 775, 400, 0.5, 0.5, 1, 1, 200, this.onClickUndo, this, this.group, this.game);
        this.toggleConfirmButton(false);
        this.toggleUndoButton(false);
        this.btnSwitchBoard = newButton("switch", 519.5, CANVAS_HEIGHT - 60, 0.5, 0.5, 1, 1, 200, this.onClickSwitch, this, this.group, this.game);

        this.addCheckers();
        this.createDices();

        // sort
        this.sort();
    },
    
    sort: function() {
        this.group.sort('z_order', Phaser.Group.SORT_ASCENDING);
    },

    addCheckers: function() {
        let p;
        for (let i = 0 ; i < 24 ; i++) {
            this.checkers.push([]);
        }
        for (let i = 0 ; i < 2 ; i++) {
            p = getLocation(OTHER_TYPE, 0, i);
            this.checkers[0].push(new Checker(OTHER_TYPE, 0, p.x, p.y, i, this));
            p = getLocation(MY_TYPE, 23, i);
            this.checkers[23].push(new Checker(MY_TYPE, 23, p.x, p.y, i, this));
        }
        for (let i = 0 ; i < 5 ; i++) {
            p = getLocation(MY_TYPE, 5, i);
            this.checkers[5].push(new Checker(MY_TYPE, 5, p.x, p.y, i, this));
            p = getLocation(OTHER_TYPE, 11, i);
            this.checkers[11].push(new Checker(OTHER_TYPE, 11, p.x, p.y, i, this));
            p = getLocation(MY_TYPE, 12, i);
            this.checkers[12].push(new Checker(MY_TYPE, 12, p.x, p.y, i, this));
            p = getLocation(OTHER_TYPE, 18, i);
            this.checkers[18].push(new Checker(OTHER_TYPE, 18, p.x, p.y, i, this));
        }
        for (let i = 0 ; i < 3 ; i++) {
            p = getLocation(MY_TYPE, 7, i);
            this.checkers[7].push(new Checker(MY_TYPE, 7, p.x, p.y, i, this));
            p = getLocation(OTHER_TYPE, 16, i);
            this.checkers[16].push(new Checker(OTHER_TYPE, 16, p.x, p.y, i, this));
        }

        // for (let i = 0 ; i < 5 ; i++) {
        //     for (let j = 0 ; j < 3 ; j++) {
        //         p = getLocation(OTHER_TYPE, 23-i, j);
        //         this.checkers[23-i].push(new Checker(OTHER_TYPE, 23-i, p.x, p.y, j, this));
        //         p = getLocation(MY_TYPE, i, j);
        //         this.checkers[i].push(new Checker(MY_TYPE, i, p.x, p.y, j, this));
        //     }
        // }
    },

    createDices: function() {
        this.btnSwitchBoard.visible = true;
        this.gameState = GAME_STATE_DICE_WAITING;
        this.dice1 = new Dice(this.turn === MY_TYPE, true, this);
        this.dice2 = new Dice(this.turn === MY_TYPE, false, this);
        this.sort();
    },

    startThrow: function() {
        this.gameState = GAME_STATE_DICE_THROWING;
        this.diceCount = 0;
        this.dice1.throw(this.diceThrowEnded, this);
        this.dice2.throw(this.diceThrowEnded, this);
    },

    diceThrowEnded: function() {
        this.diceCount++;

        if (this.diceCount == 2) {
            this.sort();
            this.gameState = GAME_STATE_CHECKERS_MOVING;
            this.btnSwitchBoard.visible = false;
            
            const diceIndex1 = this.dice1.diceIndex;
            const diceIndex2 = this.dice2.diceIndex;

            this.diceIndices = {};
            if (diceIndex1 == diceIndex2) {
                for (let i = 0 ; i < 4 ; i++) {
                    this.diceIndices = {
                        used: [],
                        unused: [diceIndex1, diceIndex1, diceIndex1, diceIndex1]
                    };
                }
            } else {
                this.diceIndices = {
                    used: [],
                    unused: [diceIndex1, diceIndex2]
                };
            }
            if (!this.checkAvailablePosForWhole()) {
                setTimeout(() => {
                    this.onClickConfirm();
                }, 1000);
            }
        }
    },
    
    releaseChecker: function() {
        if (this.currChecker) {
            this.currChecker.choose(false);
            this.currChecker = null;
        }
    },

    chooseChecker: function(checker) {
        if (this.gameState !== GAME_STATE_CHECKERS_MOVING) return;

        let {row, floor} = checker.getPosition();
        let flag = (checker.type === this.turn);

        switch (row) {
            case ROW_TRASH:
                flag = flag && (floor == this.checkerTrash[checker.type].length-1);
                break;
            case ROW_BOX:
                flag = false;
                break;
            default:
                flag = flag && (floor == this.checkers[row].length-1) && (this.checkerTrash[checker.type].length == 0);
                break;
        }

        if (!flag) return false;

        this.removePlaceholders();

        if (checker.choosed) {
            this.releaseChecker();
            return false;
        }

        if (this.currChecker) {
            this.currChecker.choose(false);
            this.currChecker = null;
        }
        this.currChecker = checker;

        return this.checkAvailablePos(checker);
    },

    checkAvailablePosForWhole: function() {
        if (this.checkerTrash[this.turn].length > 0) {
            let checker = this.checkerTrash[this.turn][this.checkerTrash[this.turn].length-1];
            return this.checkAvailablePos(checker, false);
        }
        else {
            let flag = false;
            for (let checkers of this.checkers) {
                if (checkers.length === 0) continue;

                let checker = checkers[checkers.length-1];
                if (checker.type === this.turn) {
                    flag = this.checkAvailablePos(checker, false);
                    if (flag) break;
                }
            }
            return flag;
        }
    },

    inBoard: function(row) {
        return row > -1 && row < 24;
    },

    checkAvailablePos: function(checker, showPlaceholder=true) {
        const sign = this.turn === MY_TYPE ? -1 : 1;
        let {row, floor} = checker.getPosition();
        let dices = [];
        let sRow = 0;
        let flag = false;

        if (this.inBoard(row)) {
            sRow = row;
        } else {
            if (checker.type === MY_TYPE) sRow = 24;
            if (checker.type === OTHER_TYPE) sRow = -1;
        }

        for (let step of this.diceIndices.unused) {
            if (dices.indexOf(step) > -1) continue;
            let newrow = sRow + sign * step;
            let newfloor;
            if (this.inBoard(newrow)) {
                if (this.checkers[newrow].length > 1 && 
                    this.checkers[newrow][0].type !== checker.type)
                    continue;
                newfloor = this.checkers[newrow].length;
            } else if (newrow < 0 || newrow > 23) {
                // check all chekcrs are on homeboard
                let fromto = this.turn === MY_TYPE ? [6, 23] : [0, 17];
                let notOnHomeboard = false;

                for (let i = fromto[0] ; i < fromto[1]+1 ; i++) {
                    for (let chkr of this.checkers[i]) {
                        if (chkr.type === this.turn) {
                            notOnHomeboard = true;
                            break;
                        }
                    }
                    if (notOnHomeboard) break;
                }
                if (notOnHomeboard) continue;
                newfloor = this.checkerBox[checker.type].length;
                newrow = ROW_BOX;
            } else {
            }
            dices.push(step);

            let {x, y} = getLocation(checker.type, newrow, newfloor);
            if (showPlaceholder) {
                let placeholder = new Placeholder(newrow, step, x, y, newfloor, this);
                this.placeholders.push(placeholder);
            }
            else {
                flag = true;
                break;
            }
        }
        return this.placeholders.length > 0 || flag;
    },

    removePlaceholders: function() {
        this.placeholders.forEach(placeholder => placeholder.destroy());
        this.placeholders = [];
    },

    choosePlaceholder: function(placeholder) {
        let newrow = placeholder.row;
        let step = placeholder.step;
        let move = {
            step: step,
            moves: []
        };
        this.diceIndices.used.push(move);
        this.diceIndices.unused.splice(this.diceIndices.unused.indexOf(step), 1);

        if (newrow === ROW_BOX) {
            move.moves.push({
                from: this.currChecker.row,
                to: ROW_BOX,
                type: this.currChecker.type
            });
            this.moveChecker(this.currChecker, ROW_BOX);
        } else {
            if (this.checkers[newrow].length === 1 && this.checkers[newrow][0].type !== this.currChecker.type) {
                let checker = this.checkers[newrow][0];
                move.moves.push({
                    from: checker.row,
                    to: ROW_TRASH,
                    type: checker.type
                });
                this.moveChecker(checker, ROW_TRASH);
            }
            move.moves.push({
                from: this.currChecker.row,
                to: placeholder.row,
                type: this.currChecker.type
            });
            this.moveChecker(this.currChecker, placeholder.row);
        }
        
        this.removePlaceholders();
        // check has available moves
        if (!this.checkAvailablePosForWhole() && this.diceIndices.unused.length > 0) {
            setTimeout(() => {
                this.onClickConfirm();
            }, 1000);
        }
    },

    moveChecker: function(checker, newrow=-1, undo=false) {
        let currrow = checker.getPosition().row;
        
        let newfloor = -1;
        switch (newrow) {
            case ROW_TRASH: 
                newfloor = this.checkerTrash[checker.type].length;
                break;
            case ROW_BOX: 
                newfloor = this.checkerBox[checker.type].length;
                break;
            default: 
                newfloor = this.checkers[newrow].length;
                break;
        }

        // move choosen chekcer to new pos
        checker.move(newrow, newfloor);
        this.sort();

        // add new checker
        switch (newrow) {
            case ROW_TRASH: 
                this.checkerTrash[checker.type].push(checker);
                break;
            case ROW_BOX: 
                this.checkerBox[checker.type].push(checker);
                break;
            default: 
                this.checkers[newrow].push(checker);
                break;
        }

        // remvoe checker from prev pos
        switch (currrow) {
            case ROW_TRASH: 
                this.checkerTrash[checker.type].pop();
                break;
            case ROW_BOX: 
                this.checkerBox[checker.type].pop();
                break;
            default: 
                this.checkers[currrow].pop();
                break;
        }

        // rearrange checkers
        if (this.inBoard(newrow))
            this.reArrangeCheckers(newrow, true);
        if (this.inBoard(currrow))
            this.reArrangeCheckers(currrow, false);
        
        checker.choose(false);

        // undo & confirm buttons
        if (this.diceIndices.unused.length > 0) {
            this.toggleUndoButton(true);
            this.toggleConfirmButton(false);
        } else {
            this.toggleConfirmButton(true);
        }
        if (this.diceIndices.used.length == 0) {
            this.toggleUndoButton(false);
        }

        if (newrow === ROW_BOX && this.checkerBox[checker.type].length == 15) {
            this.gameEnd(checker.type);
        }
    },

    reArrangeCheckers: function(row, byAdd) {
        let height = this.checkers[row].length;
        for (let checker of this.checkers[row]) {
            let {row, floor} = checker.getPosition();
            if (byAdd && floor === height-1) continue;
            let {x, y} = getLocation(checker.type, row, height-1, floor);
            moveAnim(this.game, checker.sprite, x, y, 200);
        }
    },

    toggleConfirmButton: function(show) {
        if (this.btnConfirm) {
            this.btnConfirm.visible = show;
            if (show) {
                this.btnConfirm.scale.setTo(0);
                this.game.add.tween(this.btnConfirm.scale).to({x: 1, y:1}, 500, Phaser.Easing.Bounce.Out, true);
            }
        }
    },

    toggleUndoButton: function(show) {
        if (this.btnUndo)
            this.btnUndo.visible = show;
            if (show) {
                this.btnUndo.scale.setTo(0);
                this.game.add.tween(this.btnUndo.scale).to({x: 1, y:1}, 500, Phaser.Easing.Bounce.Out, true);
            }
    },

    redrawBoard: function() {
        for (let i = 0 ; i < 24 ; i++) {
            let n = this.checkers[i].length;
            for (let j = 0 ; j < n ; j++) {
                let checker = this.checkers[i][j];
                let {x, y} = getLocation(checker.type, i, n-1, j);
                checker.setPosition(x, y);
            }
        }
        for (let i = 0 ; i < 2 ; i++) {
            let n = this.checkerTrash[i].length;
            for (let j = 0 ; j < n ; j++) {
                let checker = this.checkerTrash[i][j];
                let {x, y} = getLocation(checker.type, ROW_TRASH, n-1, j);
                checker.setPosition(x, y);
            }
        }
        for (let i = 0 ; i < 2 ; i++) {
            let n = this.checkerBox[i].length;
            for (let j = 0 ; j < n ; j++) {
                let checker = this.checkerBox[i][j];
                let {x, y} = getLocation(checker.type, ROW_BOX, n-1, j);
                checker.setPosition(x, y);
            }
        }
    },

    updateSwitchButton: function() {
        this.btnSwitchBoard.visible = this.isSwitchAble;
    },

    onClickUndo: function() {
        let used = this.diceIndices.used.pop();
        let step = used.step;
        for (let i = used.moves.length-1 ; i > -1 ; i--) {
            let move = used.moves[i];
            let checker;
            switch (move.to) {
                case ROW_TRASH: 
                    checker = this.checkerTrash[move.type][this.checkerTrash[move.type].length-1];
                    break;
                case ROW_BOX: 
                    checker = this.checkerBox[move.type][this.checkerBox[move.type].length-1];
                    checker.showOrigin();
                    break;
                default: 
                    checker = this.checkers[move.to][this.checkers[move.to].length-1];
                    break;
            }
            this.moveChecker(checker, move.from, true);
        }
        this.diceIndices.unused.push(step);
    },

    onClickConfirm: function() {
        this.toggleConfirmButton(false);
        this.toggleUndoButton(false);
        this.dice1.destroy();
        this.dice2.destroy();
        this.turn = (this.turn === MY_TYPE) ? OTHER_TYPE : MY_TYPE;
        this.createDices();
    },

    onClickSwitch: function() {
        MY_TYPE = (MY_TYPE == BLACK_CHECKER) ? WHITE_CHECKER : BLACK_CHECKER;
        OTHER_TYPE = (MY_TYPE == BLACK_CHECKER) ? WHITE_CHECKER : BLACK_CHECKER;
        
        let tempCheckers = [];
        for (let i = 0 ; i < 24 ; i++) {
            for (let checker of this.checkers[23-i]) {
                checker.updatePosition(i, checker.floor);
            }
            tempCheckers.push(this.checkers[23-i]);
        }
        this.checkers = tempCheckers;

        // let tempTrash = [];
        // for (let i = 0 ; i < 2 ; i++) {
        //     // for (let checker of this.checkerTrash[1-i]) {
        //     //     checker.updatePosition(ROW_TRASH, checker.floor);
        //     // }
        //     tempTrash.push(this.checkerTrash[1-i]);
        // }
        // this.checkerTrash = tempTrash;

        let tempBox = [];
        for (let i = 0 ; i < 2 ; i++) {
            for (let checker of this.checkerBox[i]) {
                checker.addAngle(180);
            }
            tempBox.push(this.checkerBox[i]);
        }
        this.checkerBox = tempBox;

        this.redrawBoard();
    },

    gameEnd: function(type) {
        this.isGameStarted = false;
        let bg = newSprite(`board`, 0, 0, 0, 0, 1, 1, 150, this.group, this.game);
        bg.alpha = 0.7;
        let label = newLabel(`WINNER`, 130, 'Arial', '#666666', CANVAS_WIDTH/2, CANVAS_HEIGHT/2-100, 0.5, 0.5, 1, 1, 300, this.group, this.game);
        label.scale.setTo(0);
        scaleAnim(this.game, label, 1, 1, 200);

        setTimeout(() => {
            let checker = new Checker(type, 0, CANVAS_WIDTH/2, CANVAS_HEIGHT/2+50, 300, this);
            checker.sprite.scale.setTo(0);
            scaleAnim(this.game, checker.sprite, 1, 1, 200);
            setTimeout(() => {
                let button = newButton("replay", CANVAS_WIDTH/2, CANVAS_HEIGHT/2+200, 0.5, 0.5,0, 0, 300, this.onClickReplay, this, this.group, this.game);
                button.scale.setTo(0);
                scaleAnim(this.game, button, 0.7, 0.7, 200);
            }, 500);
        }, 500);

    },

    onClickReplay: function() {
        window.location.reload();
    }
};
