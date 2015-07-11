/**
 * Created by aina on 10/07/15.
 */

var Card = require("./Card.js");

function Room( name ){
    this.name = name;
    this.state = false;
    this.played = false;
    this.p1_name = null;
    this.p2_name = null;
    this.anounced_names = 0;
    this.p1_trashing = false;
    this.p2_trashing = false;
    this.p1 = name;
    this.p2 = null;
    this.tablecards = [];
}

Room.prototype.generatedeck = function(){
    var de = [];
    for (var i = 0; i < 81; ++i){
        de[i] = {};
        de[i].table = false;
        de[i].id = i;
    }
    return de;
};

Room.prototype.getRemaining = function(){
    return  (this.deck.length);
};

Room.prototype.newcards = function(toreplace){
        var nc = [];
    for( var i = 2; i>=0; --i){ //com que anem del mes gran al mes petit, les 3 no cambien de posició al deque;
        var del = toreplace[i];
        //delete this.deck[i];
        this.deck.splice(i, 1);
    }
    var cartesbuides;
    if(this.deck.length >= 12){
        cartesbuides = 0;
    }
    else {
        cartesbuides = 12 - this.deck.length;
    }
    for (var i = 9; i<12-cartesbuides; ++i){
        this.deck[i].table = true;
        var c = this.allcards[this.deck[i].id];
        this.tablecards[i] = c;
        var ci = {isCard: true, id: toreplace[i-9], num: c.num, col: c.color, tex: c.texture, shape: c.shape};
        nc.push(ci);
    }
    for (var i = 12-cartesbuides; i< 12; ++i){
        var ci = {isCard: false, id: toreplace[i-9], num: null, col: null, tex: null, shape: null};
        nc.push(ci);

    }
    console.log("newcards -> Remaining cards: " + this.deck.length);
    return nc;
};

Room.prototype.begincards = function(){
    this.deck = this.generatedeck();
    var infos = [];
    this.deck.sort( function() { return 0.5 - Math.random() } );
    for (var i = 0; i < 12; ++i){
        this.deck[i].table = true;
        var c = this.allcards[this.deck[i].id];
        this.tablecards[i] = c;
        var ci = {isCard: true, id: i, num: c.num, col: c.color, tex: c.texture, shape: c.shape};
        infos.push(ci);
    }
    console.log("begincards -> Remaining cards: " + this.deck.length);
    return infos;
};

Room.prototype.trashcards = function(){
    //traiem les cartes de la taula
    for (var i=0; i < 12; ++i){
        this.deck[i].table = false;
    }
    this.deck.sort( function(){ return 0.5 - Math.random() });
    var infos = [];
    for (var i = 0; i < 12; ++i){
        this.deck[i].table = true;
        var c = this.allcards[this.deck[i].id];
        this.tablecards[i] = c;
        var ci = {isCard: true, num: c.num, col: c.color, tex: c.texture, shape: c.shape};
        infos.push(ci);
    }
    console.log("trashcards -> Remaining cards: " + this.deck.length);
    return infos;
};

Room.prototype.allcards = [];
    var  idc = 0;
    for (var sh = 1; sh <= 3; ++sh){
        for (var co = 1; co <= 3; ++co){
            for(var nu = 1; nu <= 3; ++nu){
                for (var te = 1; te <= 3; ++te){
                    Room.prototype.allcards.push(new Card(idc, sh, co, nu, te));
                    ++idc;
                }
            }
        }
    }



module.exports = Room;