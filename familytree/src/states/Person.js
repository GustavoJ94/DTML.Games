import Phaser from 'phaser'

export default class Person extends Phaser.Sprite {
 constructor (game, x, y, config) {
    super(game, x, y, 'treebg',0,config);
    this.game = game;

    this.setData(config);
    this.selected = false;
    this.brotherCount = 0;
    this.parentsCount = 0;
    this.brotherNum = null;
    this.parentNum = 0;
    this.erasebrotherNode = [];
    this.eraseParentNode = [];
    this.mainNode = null;
    this.eraseSignal = new Phaser.Signal();

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.setSize(this.width, this.height, 0, 0);
    this.sfxbtn = this.game.add.audio(this.type); 

    this.bg = this.game.add.sprite(0,0, 'sidebg');
    this.bg.anchor.set(0.5);

    this.scale.set(0.5);
    this.inputEnabled = true;
    this.input.useHandCursor = true;

    this.anchor.set(0.5);

    if(this.imageBg){
        this.character = this.game.add.sprite(0,0, this.imageBg,this.frameChar);
        this.character.anchor.set(0.5);
    }

    var erasePos = 0;

    if(this.relation != 'me'){
        var erasePos = -30;

        this.eraseBtn = this.game.add.button(30,-85, 'erase',function(){
            this.activateErase();
            if(this.relation == 'parents' || this.relation == 'grantparents' || this.relation == 'stepparents' || this.relation == 'grandgrandparents'){
                if(this.mainNode.relation == 'me' || this.mainNode.relation == 'parents' || this.mainNode.relation == 'grantparents' || this.mainNode.relation == 'stepparents'){
                    this.mainNode.parentsCount--;
                    this.mainNode.eraseParentNode.push(this.parentNum); 
                }
            }

            else if(this.relation == 'brothers' || this.relation == 'stepbrothers' || this.relation == 'sibling'){
                if(this.mainNode.relation == 'me' || this.mainNode.relation == 'parents' || this.mainNode.relation == 'stepparents' || this.mainNode.relation == 'brothers' || this.mainNode.relation == 'stepbrothers' || this.mainNode.relation == 'sibling'){
                    this.mainNode.brotherCount--;
                    this.mainNode.erasebrotherNode.push(this.brotherNum);
                }
            }

            this.destroy();
        }.bind(this));
    }

    this.wordVoiceBtn = this.game.add.button(erasePos,-85, 'voice',function(){if(this.sfxbtn.key != '')this.sfxbtn.play();}.bind(this));
    this.wordVoiceBtn.scale.set(1.5);
    this.wordVoiceBtn.anchor.set(0.5);
    
    this.nameInput = this.createTextInput(-75,60,this.name);

    this.addChild(this.bg);
    this.addChild(this.wordVoiceBtn);
    this.addChild(this.nameInput);

    if(this.relation != 'me'){
        this.eraseBtn.scale.set(1.5);
        this.eraseBtn.anchor.set(0.5);
        this.addChild(this.eraseBtn);
    }

    if(this.imageBg)
        this.addChild(this.character);
    
    this.setTintRelation();
    this.game.add.existing(this);
    return this;
}

activateErase() {
    this.eraseSignal.dispatch();
}

setData(cfg) {
    this.name = cfg.nombre;
    this.imageBg = cfg.image;
    this.frameChar = cfg.frame;
    this.sex = cfg.sex;
    this.type = cfg.type;
    this.relation = cfg.relation;
    this.direction = cfg.direction;
}

inputFocus(sprite) {
    sprite.canvasInput.focus();
}

setTintRelation(){
    if(this.relation == 'me'){
        this.tint = 0x266fd4;
    }
    else  if(this.relation == 'parents'){
        this.tint = 0xd3d426;
    }
    else  if(this.relation == 'stepparents'){
        this.tint = 0xd3d426;
    }
    else  if(this.relation == 'brothers'){
        this.tint = 0xd42626;
    }
    else  if(this.relation == 'stepbrothers'){
        this.tint = 0xd42626;
    }
    else  if(this.relation == 'sibling'){
        this.tint = 0x69d426;
    }
    else  if(this.relation == 'grantparents'){
        this.tint = 0xd46326;
    }
    else  if(this.relation == 'grandgrandparents'){
        this.tint = 0x9a24d0;
    }
}

setImageBg(cfg) {
    this.name = cfg.name;
    this.type = cfg.type;
    this.imageBg = cfg.image;
    this.frameChar = cfg.frame;
    this.sex = cfg.sex;

    if(this.character)
        this.character.destroy();
    
    this.nameInput.canvasInput._placeHolder = this.type.toUpperCase();
    this.inputFocus(this.nameInput);

    this.character = this.game.add.sprite(0,0, this.imageBg,this.frameChar);
    this.character.anchor.set(0.5);
    this.addChild(this.character);

    this.sfxbtn.destroy();
    this.sfxbtn = this.game.add.audio(this.type); 
}

haveImageBg() {
    if(this.imageBg && this.imageBg != 'undefined')
        return true;
    return false;
}

areBrothers(){
    if(this.relation == 'brothers')
        return true;
    return false;
}

areStepBrothers(){
    if(this.relation == 'stepbrothers')
        return true;
    return false;
}

areParents(){
    if(this.relation == 'parents')
        return true;
    return false;
}

areStepParents(){
    if(this.relation == 'stepparents')
        return true;
    return false;
}

areSiblings(){
    if(this.relation == 'sibling')
        return true;
    return false;
}

areGrantparents(){
    if(this.relation == 'grantparents')
        return true;
    return false;
}

areGreatGrantparents(){
    if(this.relation == 'grandgrandparents')
        return true;
    return false;
}

createTextInput(x, y, text) {
    var bmd = this.game.add.bitmapData(178, 35);
    var myInput = this.game.add.sprite(x, y, bmd);
    myInput.canvasInput = new CanvasInput({
        canvas: bmd.canvas,
        fontSize: 15,
        fontWeight: 'bold',
        width: this.bg.width+20,
        maxlength: 20,
        borderColor: '#000',
        borderWidth: 1,
        placeHolderColor: '#000',
        placeHolder: '' + text,
        padding: 10
    });
    myInput.inputEnabled = true;
    myInput.events.onInputUp.add(this.inputFocus, this);
    return myInput
}

}