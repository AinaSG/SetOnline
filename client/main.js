/**
 * Created by aina on 06/07/15.
 */
//var myname= prompt("Player Name:", "Shy Player");
var serverURL = 'localhost:9000';
//var serverURL = '192.168.1.41:9000'
var socket = require('socket.io-client')(serverURL);
var TWEEN = require('tween.js');

//CONSTANTS
var sW_ = 1100;
var sH_ = 900;
var pW_ = sW_/5;
var pH_ = sH_/4;
var sS_ = 0.6;
var mS_ = 0.8;
var bS_ = 0.9;
var sT_ = 1;
var mT_ = 1.2;
var bT_ = 1.4;

//GLOBALS
var mySelectedCards = 0;

//search
//game
//win
var gamestate = "search";
var myname= "Anon";
var opponentName = "Anon";
var opprequesting = false;

//GAMECONTAINER
var renderer = new PIXI.WebGLRenderer(sW_, sH_);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var searching = new PIXI.Container();
var win = new PIXI.Container();
var result = new PIXI.Container();

//ASSETS
//bg
var bg = PIXI.extras.TilingSprite.fromImage("./assets/bg.png", sW_, sH_);
stage.addChild(bg);
var bg2 = PIXI.extras.TilingSprite.fromImage("./assets/bg.png", sW_, sH_);
searching.addChild(bg2);
var bg3 = PIXI.extras.TilingSprite.fromImage("./assets/bg.png", sW_, sH_);
win.addChild(bg3);
var bg4 = PIXI.extras.TilingSprite.fromImage("./assets/bg.png", sW_, sH_);
result.addChild(bg4);
var c1 = PIXI.Sprite.fromImage("./assets/lostlost.png");
var c2 = PIXI.Sprite.fromImage("./assets/winwin.png");
var c3 = PIXI.Sprite.fromImage("./assets/tietie.png");
//trash
var t = PIXI.Sprite.fromImage("./assets/trash.png");
var re = PIXI.Sprite.fromImage("./assets/request.png");
t.anchor.set(0.5, 0.5);
t.inf = {};
t.inf.clicked = false;
t.interactive = true;
t.on('mouseover', onTrashOver);
t.on('mouseout', onTrashOut);
t.on('mousedown', onTrashClick);
t.on('touchstart', onTrashClick);
t.position.y = 855;
t.position.x = 1050;
re.anchor.set(0.5, 0.5);
re.position.y = 855;
re.position.x = 1050;
re.visible = opprequesting;
console.log("players :D");
var b = PIXI.Sprite.fromImage("./assets/bear.png");
b.anchor.set(0.5, 0.5);
b.scale.set(0.7);
b.position.y = 35;
b.position.x = 120;
var f = PIXI.Sprite.fromImage("./assets/frog.png");
f.anchor.set(0.5, 0.5);
f.scale.set (0.7);
f.position.y =35;
f.position.x =980;
stage.addChild(re);
stage.addChild(t);
stage.addChild(b);
stage.addChild(f);

var mypoints = 0;
var oppoints = 0;
var mp = new PIXI.Text(mypoints, {font:"50px Arial", fill:"white"});
var op = new PIXI.Text(oppoints, {font:"50px Arial", fill:"white"});
mp.anchor.set(0.5, 0.5);
op.anchor.set(0.5, 0.5);
mp.position.y = 35;
mp.position.x = 50;
op.position.y = 35;
op.position.x = 1050;
stage.addChild(mp);
stage.addChild(op);


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
//replace(0, {num: 1, col: "r", tex: "e", shape: "c"});
//replace(1, {num: 2, col: "g", tex: "f", shape: "t"});
//replace(2, {num: 3, col: "b", tex: "l", shape: "s"});


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
    else if (gamestate == "results"){
        renderer.render(result);
    }
    else {
        renderer.render(win);
    }
    TWEEN.update();
}

function fillcards() {
    for (var i=0; i<12; ++i){

        //Set card sprites properties
        var card = new PIXI.Sprite(cardbg);
        card.scale.set(sS_);
        card.inf = {}; //to store info of the card
        card.inf.id = i;
        card.inf.clicked = false;
        card.inf.opponent = false;
        card.inf.color = null;
        card.inf.shape = null;
        card.inf.num = null;
        card.inf.texture = null;
        card.anchor.set(0.5, 0.5);
        card.position.x = ((i%4)+1) * pW_;
        card.position.y = (Math.floor(i/4)+1) * pH_;

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

function actual_replace ( id, info){
    var card = tableCards[id];
    card.removeChildren();
    if(info.isCard) {
        var shape = info.shape;
        var tex = info.tex;
        card.inf.color = info.col;
        card.inf.shape = info.shape;
        card.inf.num = info.num;
        card.inf.texture = info.tex;
        var color;
        if (info.col == "r") {
            color = 0x97080E;
        }
        else if (info.col == "g") {
            color = 0x488C13;
        }
        else {
            color = 0x1B55C0;
        }

        var simbols = [];
        for (var i = 0; i < info.num; ++i) {
            var str = shape + tex;
            simbols[i] = new PIXI.Sprite(shapetextures[str]);
            simbols[i].tint = color;
            simbols[i].anchor.set(0.5, 0.5);
            card.addChild(simbols[i]);
        }
        if (info.num == 1) {
            //NOOP
        }
        else if (info.num == 2) {
            simbols[0].position.y += 55;
            simbols[1].position.y -= 55;

        }
        else {
            simbols[1].position.y += 75;
            simbols[2].position.y -= 75;
        }
    }
    else {
        tableCards[id].visible = false;
    }
}

function replace ( id, info){
    var card = tableCards[id];
    var tween = new TWEEN.Tween(card.scale).to({x:0,y:0},200);
    tween.onComplete(function(){
        actual_replace(id,info);
    });
    if(info.isCard) {
        tween.chain(new TWEEN.Tween(card.scale).to({x:sS_,y:sS_},200).onComplete(function(){
            card.interactive = true;
        }));
    }
    card.interactive = false;
    tween.start();
}

socket.on('click_on_card', function (id){
    console.log("lol, recieved a click on" + id);
    //var ca = tableCards[id];
    if (tableCards[id].inf.opponent){
        unselectopponent(id);
    }
    else {
        selectopponent(id);
    }
});

socket.on('op_left', function(){
    gamestate = "win";
});

socket.on('begin', function(cards){
    myname = prompt("Player Name:", "Anon");
    socket.emit('anounceName', myname);
    for (var i = 0; i < 12; ++i){
        replace(i, cards[i]);
    }
});

socket.on('trash_cards', function(cards){
    unselectTrash();
    uncheckAll();
    opprequesting = false;
    re.visible = opprequesting;
    for (var i = 0; i < 12; ++i){
        replace(i, cards[i]);
    }
});

socket.on('set_op_name', function(name){
    opponentName = name;
    console.log (myname, ": recieved my oponent's name: ", name);
    var text = new PIXI.Text((myname + " VS " + opponentName), {font:"50px Arial", fill:"white"});
    text.anchor.set(0.5, 0.5);
    text.position.y = 35;
    text.position.x = sW_/2;
    stage.addChild(text);
    gamestate = "game";
});

socket.on('points', function(info, updatep){
    if (updatep) {
        oppoints = oppoints + 1;
        op.text = oppoints;
    }
    uncheckAll();
    for(var i = 0; i< 3; ++i){
        replace(info[i].id, info[i]);
    }
});

socket.on('end_game', function(){
    gamestate = "results";
    if (oppoints > mypoints){
        result.addChild(c1);
    }
    else if (mypoints > oppoints){
        result.addChild(c2);
    }
    else {
        result.addChild(c3);
    }
});

socket.on('request_trash', function(){
    opprequesting = !opprequesting;
    re.visible = opprequesting;
});

// Card functions
function onCardClick(){
    if (this.inf.clicked){
        unselectmy(this.inf.id);
        socket.emit('click_on_card', this.inf.id);
        console.log("lol, sending a click on" + this.inf.id);
    }
    else if ( mySelectedCards<3 ) {
        selectmy(this.inf.id);
        socket.emit('click_on_card', this.inf.id);
        console.log("lol, sending a click on" + this.inf.id);
    }
    if(mySelectedCards == 3){
        tripsCheckEm();
    }
}

function onTrashClick(){
    if (this.inf.clicked){
        socket.emit('click_on_trash');
        unselectTrash();
    }
    else {
        socket.emit('click_on_trash');
        selectTrash();
    }
}

function unselectTrash(){
    t.scale.set(sT_);
    t.inf.clicked = false;
    t.tint = 0xFFFFFF;
}

function selectTrash(){
    t.scale.set(bT_);
    t.inf.clicked = true;
    t.tint = 0xFF0000;
}

function unselectmy(i){
    tableCards[i].scale.set(sS_);
    tableCards[i].inf.clicked = false;
    --mySelectedCards;
}

function selectmy(i){
    tableCards[i].scale.set(bS_);
    tableCards[i].inf.clicked = true;
    ++mySelectedCards;
}

function unselectopponent(i){
    tableCards[i].tint = 0xFFFFFF;
    tableCards[i].inf.opponent = false;
}

function selectopponent(i){
    tableCards[i].tint = 0xDEDEDE;
    tableCards[i].inf.opponent = true;
}

function uncheckAll(){
    for (var i = 0; i < 12; ++i){
        if (tableCards[i].inf.clicked){
            unselectmy(i);
            socket.emit('click_on_card', i);
        }
    }
}

function getPoints(){
    console.log("Points!");
    info = [];
    for (var i = 0; i < 12; ++i){
        if (tableCards[i].inf.clicked){
            info.push(i);
        }
    }
    socket.emit('points', info);
    mypoints = mypoints +1;
    mp.text = mypoints;
    uncheckAll();
}

function tripsCheckEm() {
    var sel = [];
    for ( var i = 0; i < 12; ++i ){
        //console.log(i, tableCards[i]);
        if (tableCards[i].inf.clicked) sel.push(tableCards[i].inf);
    }
    var c = (sel[0].color == sel[1].color && sel[0].color == sel[2].color) || (sel[0].color != sel[1].color && sel[0].color != sel[2].color && sel[1].color != sel[2].color);
    var s = (sel[0].shape == sel[1].shape && sel[0].shape == sel[2].shape) || (sel[0].shape != sel[1].shape && sel[0].shape != sel[2].shape && sel[1].shape != sel[2].shape);
    var t = (sel[0].texture == sel[1].texture && sel[0].texture == sel[2].texture) || (sel[0].texture != sel[1].texture && sel[0].texture != sel[2].texture && sel[1].texture != sel[2].texture);
    var n = (sel[0].num == sel[1].num && sel[0].num == sel[2].num) || (sel[0].num != sel[1].num && sel[0].num != sel[2].num && sel[1].num != sel[2].num);

    if (c && s && t && n) {
        console.log ("checked");
        getPoints();
    }
    else {
        uncheckAll();
        console.log("so close");
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

function onTrashOver(){
    if(!this.inf.clicked){
        this.scale.set(mT_);
        re.scale.set(mT_);
    }
}

function onTrashOut(){
    if(!this.inf.clicked) {
        this.scale.set(sT_);
        re.scale.set(sT_);
    }
}