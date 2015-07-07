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

//GAMECONTAINER
var renderer = new PIXI.WebGLRenderer(sW_, sH_);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();

//ASSETS
//bg
var bg = PIXI.extras.TilingSprite.fromImage("./assets/bg.png", sW_, sH_);
stage.addChild(bg);
//cards
var tableCards = [];

var cardbg = PIXI.Texture.fromImage("./assets/cardbg.png");

fillcards();



//ANIMATE
animate();
function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
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