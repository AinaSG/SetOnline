/**
 * Created by aina on 06/07/15.
 */

var serverURL = 'localhost:9000';
//var serverURL = '192.168.1.41:9000'
var socket = require('socket.io-client')(serverURL);


//CONSTANTS
var sW_ = 1100;
var sH_ = 900;
var pW_ = sW_/4;
var pH_ = sH_/4;
var sS_ = 0.7;
var mS_ = 0.8;
var bS_ = 0.9;

//GLOBALS
var mySelectedCards = 0;

//search
//game
//win
var gamestate = "search";

//GAMECONTAINER
var renderer = new PIXI.WebGLRenderer(sW_, sH_);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var searching = new PIXI.Container();
var win = new PIXI.Container();

//ASSETS
//bg
var bg = PIXI.extras.TilingSprite.fromImage("./assets/bg.png", sW_, sH_);
stage.addChild(bg);
var bg2 = PIXI.extras.TilingSprite.fromImage("./assets/bg.png", sW_, sH_);
searching.addChild(bg2);
var bg3 = PIXI.extras.TilingSprite.fromImage("./assets/bg.png", sW_, sH_);
win.addChild(bg3);
//cards
var tableCards = [];

//Card content
var shapetextures = [];
shapetextures["ce"] = PIXI.Texture.fromImage("./assets/ce.png");
shapetextures["cf"] = PIXI.Texture.fromImage("./assets/cf.png");
shapetextures["cl"] = PIXI.Texture.fromImage("./assets/cl.png");
shapetextures["te"] = PIXI.Texture.fromImage("./assets/te.png");
shapetextures["tf"] = PIXI.Texture.fromImage("./assets/tf.png");
shapetextures["tl"] = PIXI.Texture.fromImage("./assets/tl.png");
shapetextures["se"] = PIXI.Texture.fromImage("./assets/se.png");
shapetextures["sf"] = PIXI.Texture.fromImage("./assets/sf.png");
shapetextures["sl"] = PIXI.Texture.fromImage("./assets/sl.png");

//Texts
var text1 = PIXI.Sprite.fromImage("./assets/searching.png");
searching.addChild(text1);
var text2 = PIXI.Sprite.fromImage("./assets/win.png");
win.addChild(text2);

var cardbg = PIXI.Texture.fromImage("./assets/cardbg.png");

fillcards();
//var infoph ={num: 3, col: "b", tex: "e", shape: "s"};
replace(0, {num: 1, col: "r", tex: "e", shape: "c"});
replace(1, {num: 2, col: "g", tex: "f", shape: "t"});
replace(2, {num: 3, col: "b", tex: "l", shape: "s"});


//ANIMATE
animate();
function animate() {
    requestAnimationFrame(animate);
    if (gamestate == "game") {
        renderer.render(stage);
    }
    else if (gamestate == "search"){
        renderer.render(searching);
    }
    else {
        renderer.render(win);
    }
}

function fillcards() {
    for (var i=0; i<9; ++i){

        //Set card sprites properties
        var card = new PIXI.Sprite(cardbg);
        card.scale.set(sS_);
        card.inf = {}; //to store info of the card
        card.inf.id = i;
        card.inf.clicked = false;
        card.anchor.set(0.5, 0.5);
        card.position.x = ((i%3)+1) * pW_;
        card.position.y = (Math.floor(i/3)+1) * pH_;

        //Set card interactivity
        card.interactive = true;
        //click
        card.on('mousedown', onCardClick);
        card.on('touchstart', onCardClick);
        card.on('mouseover', onCardOver);
        card.on('mouseout', onCardOut);
        //Add card to the game
        stage.addChild(card);
        tableCards.push(card);
    }
}

function replace ( id, info){
    var card = tableCards[id];
    card.removeChildren();
    var shape = info.shape;
    var tex = info.tex;
    var color;
    if (info.col == "r"){
        color = 0x97080E;
    }
    else if (info.col == "g"){
        color = 0x488C13;
    }
    else {
        color = 0x1B55C0;
    }

    var simbols = [];
    for (var i = 0; i < info.num; ++i){
        var str = shape+tex;
        simbols[i] = new PIXI.Sprite(shapetextures[str]);
        simbols[i].tint = color;
        simbols[i].anchor.set(0.5, 0.5);
        card.addChild(simbols[i]);
    }
    if (info.num == 1){
      //NOOP
    }
    else if (info.num == 2){
        simbols[0].position.y += 55;
        simbols[1].position.y -= 55;

    }
    else {
        simbols[1].position.y += 75;
        simbols[2].position.y -= 75;
    }

}

socket.on('click_on_card', function (id){
    console.log("lol, recieved a click on" + id);
    var ca = tableCards[id];
    if (ca.inf.clicked){
        ca.scale.set(sS_);
        ca.inf.clicked = false;
        --mySelectedCards;
    }
    else if ( mySelectedCards<3 ) {
        ca.scale.set(bS_);
        ca.inf.clicked = true;
        ++mySelectedCards;
    }
});

socket.on('op_left', function(){
    gamestate = "win";
});

socket.on('begin', function(){
    gamestate = "game";
});



// Card functions
function onCardClick(){
    if (this.inf.clicked){
        this.scale.set(sS_);
        this.inf.clicked = false;
        --mySelectedCards;
        socket.emit('click_on_card', this.inf.id);
        console.log("lol, sending a click on" + this.inf.id);
    }
    else if ( mySelectedCards<3 ) {
        this.scale.set(bS_);
        this.inf.clicked = true;
        ++mySelectedCards;
        socket.emit('click_on_card', this.inf.id);
        console.log("lol, sending a click on" + this.inf.id);
    }
}

function onCardOver(){
    if(!this.inf.clicked){
        this.scale.set(mS_);
    }
}

function onCardOut(){
    if(!this.inf.clicked) {
        this.scale.set(sS_);
    }
}